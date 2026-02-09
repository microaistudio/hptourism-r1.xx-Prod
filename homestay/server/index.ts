import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { config } from "@shared/config";
import { httpLogger, logger } from "./logger";
import { globalRateLimiter } from "./security/rateLimit";
import helmet from "helmet";
import { startBackupScheduler } from "./services/backup-scheduler";

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
  server.listen({
    port,
    host: config.server.host,
    reusePort: true,
  }, () => {
    logger.info({ port, host: config.server.host }, "server started");

    // Initialize backup scheduler
    startBackupScheduler().catch((err) => {
      logger.error({ err }, "Failed to start backup scheduler");
    });
  });
})();
