import rateLimit from "express-rate-limit";
import type { RequestHandler } from "express";
import { config } from "@shared/config";
import { logger } from "../logger";
import { db } from "../db";
import { systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const RATE_LIMIT_SETTING_KEY = "rate_limit_configuration";

type RateLimitConfig = {
  enabled: boolean;
  global: { maxRequests: number; windowMinutes: number };
  auth: { maxRequests: number; windowMinutes: number };
  upload: { maxRequests: number; windowMinutes: number };
};

// Cache for rate limit config (60 second TTL)
let cachedConfig: RateLimitConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Default config (matches .env)
const DEFAULT_CONFIG: RateLimitConfig = {
  enabled: config.security.enableRateLimit,
  global: {
    maxRequests: config.security.rateLimit.maxRequests,
    windowMinutes: Math.round(config.security.rateLimit.windowMs / 60000)
  },
  auth: {
    maxRequests: config.security.rateLimit.authMaxRequests,
    windowMinutes: Math.round(config.security.rateLimit.authWindowMs / 60000)
  },
  upload: {
    maxRequests: config.security.rateLimit.uploadMaxRequests,
    windowMinutes: Math.round(config.security.rateLimit.uploadWindowMs / 60000)
  }
};

async function getRateLimitConfig(): Promise<RateLimitConfig> {
  const now = Date.now();

  // Return cached if still valid
  if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return cachedConfig;
  }

  try {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY))
      .limit(1);

    if (setting?.settingValue) {
      cachedConfig = { ...DEFAULT_CONFIG, ...(setting.settingValue as Partial<RateLimitConfig>) };
    } else {
      cachedConfig = DEFAULT_CONFIG;
    }
    cacheTimestamp = now;
    return cachedConfig;
  } catch (error) {
    logger.warn({ err: error }, "[rate-limit] Failed to fetch config from DB, using defaults");
    return DEFAULT_CONFIG;
  }
}

// Force cache refresh (called when settings are updated)
export function invalidateRateLimitCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

type LimiterType = "global" | "auth" | "upload";

const disabledLimiter: RequestHandler = (_req, _res, next) => next();

// Create a dynamic limiter that checks config on each request
function createDynamicLimiter(type: LimiterType, message: string): RequestHandler {
  // We use a wrapper that checks the current config
  return async (req, res, next) => {
    try {
      const rateLimitConfig = await getRateLimitConfig();

      if (!rateLimitConfig.enabled) {
        return next();
      }

      const limiterConfig = rateLimitConfig[type];
      const windowMs = limiterConfig.windowMinutes * 60 * 1000;
      const max = limiterConfig.maxRequests;

      // Create limiter instance for this request
      const limiter = rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => req.ip || "unknown",
        handler: (req, res, _next, options) => {
          logger.warn(
            {
              ip: req.ip,
              path: req.originalUrl,
              userId: (req as any)?.session?.userId ?? null,
              limiter: type,
            },
            "Rate limit exceeded",
          );
          res.status(options.statusCode).json({ message });
        },
      });

      limiter(req, res, next);
    } catch (error) {
      // On error, allow request through but log warning
      logger.warn({ err: error }, "[rate-limit] Error in rate limiter, allowing request");
      next();
    }
  };
}

export const globalRateLimiter = createDynamicLimiter(
  "global",
  "Too many requests from this IP. Please try again soon."
);

export const authRateLimiter = createDynamicLimiter(
  "auth",
  "Too many authentication attempts. Please wait a few minutes and try again."
);

export const uploadRateLimiter = createDynamicLimiter(
  "upload",
  "Upload rate exceeded. Please retry after a short pause."
);

