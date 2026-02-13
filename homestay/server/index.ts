import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { config } from "@shared/config";
import { httpLogger, logger } from "./logger";
import { globalRateLimiter } from "./security/rateLimit";
import helmet from "helmet";
import { startBackupScheduler } from "./services/backup-scheduler";

// ── Crash Diagnostics ────────────────────────────────────────────────
// Log the REAL crash cause before the process dies.
// Without these, we only see EADDRINUSE from subsequent restarts.
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught Exception:", err);
  logger.fatal({ err: err.message, stack: err.stack }, "[server] uncaught exception — process will exit");
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("[FATAL] Unhandled Rejection:", reason);
  logger.fatal({ reason: String(reason) }, "[server] unhandled promise rejection — process will exit");
  process.exit(1);
});

const app = express();
logger.info(
  {
    level: config.logging.level,
    pretty: config.logging.pretty,
    file: config.logging.file,
  },
  "[logging] bootstrap configuration",
);
// Behind reverse proxy (nginx) so secure cookies work
app.set("trust proxy", 1);
app.disable("x-powered-by");

// SECURITY FIX (Issue 4): Enforce HTTPS in Production
app.use((req, res, next) => {
  // Only enforce in production environment
  if (app.get("env") === "development" || req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
    return next();
  }

  // Check if the request is secure (via trust proxy)
  if (!req.secure && req.headers["x-forwarded-proto"] !== "https") {
    // For GET requests, redirect to HTTPS
    if (req.method === "GET") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }

    // For sensitive methods (POST, PUT, etc.), reject the request to prevent data leakage.
    // The client should have used HTTPS in the first place.
    return res.status(403).send("SSL Required");
  }

  next();
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://himaccess.hp.gov.in"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://himaccess.hp.gov.in"],
      imgSrc: ["'self'", "data:", "blob:", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      connectSrc: ["'self'", "https://eservices.himachaltourism.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      frameSrc: ["'self'", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      formAction: ["'self'", "https://himkosh.hp.nic.in", "https://himkosh.hp.gov.in", "https://himaccess.hp.gov.in", "https://sso.hp.gov.in", "https://test.ccavenue.com", "https://secure.ccavenue.com"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year (HPSDC Issue #7)
    includeSubDomains: true,
    preload: false,
  },
  frameguard: {
    action: "sameorigin",
  },
}));

// Block documentation file access (Issue 3 - Documentation Disclosure)
app.use((req, res, next) => {
  const blockedPaths = [
    "/readme.md", "/changelog.md", "/license", "/license.md", "/license.txt",
    "/authors.md", "/contributors.md", "/security.md"
  ];

  // Check exact path match (case-insensitive)
  if (blockedPaths.includes(req.path.toLowerCase())) {
    return res.status(404).send("Not Found");
  }

  // Block docs directory if it exists
  if (req.path.toLowerCase().startsWith("/docs/")) {
    return res.status(404).send("Not Found");
  }

  next();
});

// Block dangerous HTTP methods (Issue 5)
app.use((req, res, next) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  next();
});

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  limit: '50mb'
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(globalRateLimiter);

app.use(httpLogger);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Handle Zod errors specifically
    if (err.name === 'ZodError' || (err.errors && Array.isArray(err.errors))) {
      return res.status(400).json({
        message: "Validation Error",
        errors: err.errors
      });
    }

    // Log the error if it's a server error
    if (status >= 500) {
      logger.error({ err }, "[server] Unhandled error");
    }

    res.status(status).json({ message });
    // Do not re-throw error as response is already sent
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = config.server.port;
  let retryCount = 0;
  const MAX_RETRIES = 10;

  // Handle port-in-use errors gracefully instead of crash-looping
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      retryCount++;
      if (retryCount > MAX_RETRIES) {
        logger.error({ port, retryCount }, "[server] port still in use after max retries, exiting");
        process.exit(1);
      }
      logger.warn({ port, retryCount }, "[server] port in use, retrying in 3 seconds...");
      setTimeout(() => {
        server.listen({ port, host: config.server.host });
      }, 3000);
    } else if (err.code === "ERR_SERVER_NOT_RUNNING") {
      // Ignore — happens during cleanup, not a real error
    } else {
      logger.error({ err }, "[server] fatal error");
      process.exit(1);
    }
  });

  server.listen({
    port,
    host: config.server.host,
  }, () => {
    retryCount = 0;
    logger.info({ port, host: config.server.host }, "server started");

    // Initialize backup scheduler
    startBackupScheduler().catch((err) => {
      logger.error({ err }, "Failed to start backup scheduler");
    });
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────
  // Properly close the HTTP server so the port is released before exit.
  // This prevents the recurring EADDRINUSE crash-loop on PM2 restart.
  let shuttingDown = false;

  function gracefulShutdown(signal: string) {
    if (shuttingDown) return; // prevent double-shutdown
    shuttingDown = true;
    logger.info({ signal }, "[server] received shutdown signal, closing gracefully...");

    // Stop accepting new connections
    server.close((err) => {
      if (err) {
        logger.error({ err }, "[server] error during shutdown");
        process.exit(1);
      }
      logger.info("[server] all connections closed, exiting cleanly");
      process.exit(0);
    });

    // Force exit after 5 seconds if connections don't close
    setTimeout(() => {
      logger.warn("[server] forcefully shutting down after timeout");
      process.exit(1);
    }, 5000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
})();
