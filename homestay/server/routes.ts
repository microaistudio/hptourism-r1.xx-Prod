import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import { eq, or, ilike, inArray } from "drizzle-orm";
import { pool, db } from "./db";
import { storage } from "./storage";
import { logApplicationAction } from "./audit";
import { logger, logHttpTrace } from "./logger";
import { authRateLimiter, uploadRateLimiter } from "./security/rateLimit";
import { config as appConfig } from "@shared/config";
import { getDistrictsCoveredBy } from "@shared/districtRouting";
import {
  HIMKOSH_GATEWAY_SETTING_KEY,
  HimkoshGatewaySettingValue,
  resolveHimkoshGatewayConfig,
  trimMaybe as trimHimkoshString,
  parseOptionalNumber as parseOptionalHimkoshNumber,
} from "./himkosh/gatewayConfig";
import { HimKoshCrypto, buildRequestString } from "./himkosh/crypto";
import { fetchAllDdoCodes, resolveDistrictDdo } from "./himkosh/ddo";
import {
  type User,
  type HomestayApplication,
  type InsertHomestayApplication,
  type ApplicationServiceContext,
  homestayApplications,
  documents,
  payments,
  productionStats,
  users,
  userProfiles,
  type UserProfile,
  inspectionOrders,
  inspectionReports,
  objections,
  clarifications,
  certificates,
  notifications,
  applicationActions,
  reviews,
  auditLogs,
  himkoshTransactions,
  ddoCodes,
  systemSettings,
  type SystemSetting,
  lgdDistricts,
  lgdTehsils,
  lgdBlocks,
  lgdGramPanchayats,
  lgdUrbanBodies,
  districtBaselineStats,
} from "@shared/schema";
import {
  DEFAULT_UPLOAD_POLICY,
  UPLOAD_POLICY_SETTING_KEY,
  type UploadPolicy,
  normalizeUploadPolicy,
} from "@shared/uploadPolicy";
import {
  DEFAULT_CATEGORY_ENFORCEMENT,
  DEFAULT_CATEGORY_RATE_BANDS,
  DEFAULT_ROOM_CALC_MODE,
  ENFORCE_CATEGORY_SETTING_KEY,
  ROOM_RATE_BANDS_SETTING_KEY,
  ROOM_CALC_MODE_SETTING_KEY,
  DA_SEND_BACK_SETTING_KEY,

  LOGIN_OTP_SETTING_KEY,
  EXISTING_RC_MIN_ISSUE_DATE_SETTING_KEY,
  DEFAULT_EXISTING_RC_MIN_ISSUE_DATE,
  normalizeCategoryEnforcementSetting,
  normalizeCategoryRateBands,
  normalizeRoomCalcModeSetting,
  normalizeBooleanSetting,
  normalizeIsoDateSetting,
} from "@shared/appSettings";
import { deriveDistrictRoutingLabel } from "@shared/districtRouting";
import { isLegacyApplication as isLegacyApplicationRecord } from "@shared/legacy";
import express from "express";
import { randomUUID, randomInt, createHash } from "crypto";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { z } from "zod";
import bcrypt from "bcrypt";
import { eq, desc, asc, ne, and, or, sql, gte, lte, like, ilike, inArray, type AnyColumn } from "drizzle-orm";
import { createSettingsRouter } from "./routes/settings";
import { createPublicRouter } from "./routes/public";
import { createAdminStatsRouter } from "./routes/admin-stats";
import { startScraperScheduler } from "./scraper";
import { ObjectStorageService, OBJECT_STORAGE_MODE, LOCAL_OBJECT_DIR, LOCAL_MAX_UPLOAD_BYTES } from "./objectStorage";
import {
  linkDocumentToStorage,
  buildLocalObjectKey,
  upsertStorageMetadata,
  markStorageObjectAccessed,
} from "./storageManifest";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import { normalizeDistrictForMatch, districtsMatch, buildDistrictWhereClause } from "./routes/helpers/district";
import {
  DEFAULT_EMAIL_BODY,
  DEFAULT_EMAIL_SUBJECT,
  DEFAULT_SMS_BODY,
  sendTestEmail,
  sendTestSms,
  sendTwilioSms,
  sendNicV2Sms,
} from "./services/communications";
import type { SmsGatewayV2Settings } from "./services/communications";
import himkoshRoutes from "./himkosh/routes";
import { createAdminCommunicationsRouter } from "./routes/admin/communications";
import { createAdminHimkoshRouter } from "./routes/admin/himkosh";
import { createAdminUsersRouter } from "./routes/admin/users";
import { createAdminSettingsRouter } from "./routes/admin/settings";
import { createAdminLegacyRcRouter } from "./routes/admin/legacy-rc";
import { createAdminDbRouter } from "./routes/admin/db";
import { createAdminNotificationsRouter } from "./routes/admin/notifications";
import { createAdminStatsRouter } from "./routes/admin/stats";
import { createAdminDevopsRouter } from "./routes/admin/devops";
import { createBackupRouter } from "./routes/admin/backup";
import { createMigrationRouter } from "./routes/admin/migration";
import { createAdminSeedRouter } from "./routes/admin/seed";
import { createAdminReportsRouter } from "./routes/admin/reports";
import { registerDaRoutes } from "./routes/da";
import { getLegacyForwardEnabled } from "./routes/helpers/legacy";
import { MAX_ROOMS_ALLOWED, MAX_BEDS_ALLOWED, validateCategorySelection } from "@shared/fee-calculator";
import type { CategoryType } from "@shared/fee-calculator";
import {
  lookupStaffAccountByIdentifier,
  lookupStaffAccountByMobile,
  getDistrictStaffManifest,
} from "@shared/districtStaffManifest";
import { formatUserForResponse } from "./routes/core/users";
import {
  CAPTCHA_SETTING_KEY,
  getCaptchaSetting,
  shouldBypassCaptcha,
  updateCaptchaSettingCache,
} from "./routes/core/captcha";
import "./staffManifestSync";
import { getSystemSettingRecord } from "./services/systemSettings";
import { requireAuth, requireRole } from "./routes/core/middleware";
import {
  createLoginOtpChallenge,
  createPasswordResetChallenge,
  findUserByIdentifier,
  getLoginOtpSetting,
  maskEmailAddress,
  maskMobileNumber,
  type PasswordResetChannel,
} from "./routes/auth/utils";
import { createAuthRouter, createProfileRouter } from "./routes/auth";
import { hpssoRouter } from "./routes/auth/hpsso";
import { validateHPSSOToken } from "./services/hpsso";
import testRunnerRoutes from "./routes/test-runner";
import baselineStatsRouter from "./routes/admin/baseline-stats";

import { createPaymentsRouter } from "./routes/payments";
import { createDtdoRouter } from "./routes/dtdo";
import { handleStaffProfileUpdate, handleStaffPasswordChange } from "./routes/core/user-handlers";
import {
  EMAIL_GATEWAY_SETTING_KEY,
  SMS_GATEWAY_SETTING_KEY,
  sanitizeEmailGateway,
  sanitizeSmsGateway,
  queueNotification,
  resolveNotificationChannelState,
  createInAppNotification,
  emailProviders,
  formatGatewaySetting,
  type EmailGatewayProvider,
  type EmailGatewaySettingValue,
  type EmailGatewaySecretSettings,
  type SmsGatewayProvider,
  type SmsGatewaySettingValue,
  type NicSmsGatewaySettings,
  type TwilioSmsGatewaySecretSettings,
  extractLegacyEmailProfile,
  getEmailProfileFromValue,
} from "./services/notifications";
import {
  BYTES_PER_MB,
  normalizeMime,
  getExtension,
  validateDocumentsAgainstPolicy,
  type NormalizedDocumentRecord,
} from "./services/documentValidation";
import { createApplicationsRouter } from "./routes/applications";
import { createOwnerApplicationsRouter } from "./routes/applications/owner";
import { createServiceCenterRouter } from "./routes/applications/service-center";
import { createExistingOwnersRouter } from "./routes/applications/existing-owners";
import { createUploadRouter } from "./routes/uploads";
import { trimOptionalString, trimRequiredString, parseIsoDateOrNull } from "./routes/helpers/format";
import { removeUndefined } from "./routes/helpers/object";

import { summarizeTimelineActor } from "./routes/helpers/timeline";
import { LEGACY_DTD0_FORWARD_SETTING_KEY } from "./routes/helpers/legacy";
import { isPgUniqueViolation } from "./routes/helpers/db";
import { CORRECTION_CONSENT_TEXT } from "./routes/constants";

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId: string;
    captchaAnswer?: string | null;
    captchaIssuedAt?: number | null;
  }
}

const routeLog = logger.child({ module: "routes" });
const adminHimkoshCrypto = new HimKoshCrypto();

const normalizeStringField = (value: unknown, fallback = "", maxLength?: number) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  if (typeof maxLength === "number" && maxLength > 0 && trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }
  return trimmed;
};

const toNullableString = (value: unknown, maxLength?: number) => {
  const normalized = normalizeStringField(value, "", maxLength);
  return normalized || null;
};

const preprocessNumericInput = (val: unknown) => {
  if (typeof val === "number") {
    return Number.isNaN(val) ? undefined : val;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed || trimmed.toLowerCase() === "nan") {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : trimmed;
  }
  return val;
};

const coerceNumberField = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const toDateOnly = (value: Date) => {
  const normalized = new Date(value);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS = 7;

const STAFF_PROFILE_ROLES = ['dealing_assistant', 'district_tourism_officer', 'district_officer'] as const;

const staffProfileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  firstName: z.string().min(1).optional().or(z.literal("")),
  lastName: z.string().min(1).optional().or(z.literal("")),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  alternatePhone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit alternate number").optional().or(z.literal("")),
  officePhone: z.string().regex(/^[0-9+\-()\s]{5,20}$/, "Enter a valid office contact number").optional().or(z.literal("")),
  designation: z.string().max(120, "Designation must be 120 characters or fewer").optional().or(z.literal("")),
  department: z.string().max(120, "Department must be 120 characters or fewer").optional().or(z.literal("")),
  employeeId: z.string().max(50, "Employee ID must be 50 characters or fewer").optional().or(z.literal("")),
  officeAddress: z.string().max(500, "Office address must be 500 characters or fewer").optional().or(z.literal("")),
});

const numberOrNull = (value: number | null | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return value;
};

const sanitizeHimkoshGatewaySetting = (value?: HimkoshGatewaySettingValue | null) => {
  if (!value) return null;
  return {
    merchantCode: value.merchantCode ?? "",
    deptId: value.deptId ?? "",
    serviceCode: value.serviceCode ?? "",
    ddo: value.ddo ?? "",
    head1: value.head1 ?? "",
    head2: value.head2 ?? "",
    head2Amount: typeof value.head2Amount === "number" ? value.head2Amount : null,
    returnUrl: value.returnUrl ?? "",
    allowFallback: value.allowFallback !== false,
  };
};



const isServiceApplicationKind = (kind?: HomestayApplication["applicationKind"] | null) =>
  Boolean(kind && kind !== "new_registration");

const toNumberFromUnknown = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const canViewInspectionReport = (user: User | null, application: HomestayApplication | null) => {
  if (!user || !application) {
    return false;
  }

  if (user.role === "property_owner") {
    return user.id === application.userId;
  }

  // Other authenticated roles can view inspection reports
  return true;
};


import { createPublicSettingsRouter } from "./routes/public-settings";

export async function registerRoutes(app: Express): Promise<Server> {


  // EMERGENCY PATCH: Explicitly register validate-json passing everything else
  app.get("/api/auth/hpsso/validate-json", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) return res.status(400).json({ error: 'Token required' });

      const ssoUserData = await validateHPSSOToken(token);
      routeLog.info({ sso_id: ssoUserData.sso_id }, 'v9: Manual token validation success in routes.ts');

      let existingUser = null;
      if (ssoUserData.mobile) {
        const usersFound = await db.select().from(users).where(eq(users.mobile, ssoUserData.mobile)).limit(1);
        if (usersFound.length > 0) existingUser = usersFound[0];
      }

      res.json({
        success: true,
        sso_data: {
          sso_id: ssoUserData.sso_id,
          name: ssoUserData.name,
          mobile: ssoUserData.mobile,
          email: ssoUserData.email,
          district: ssoUserData.dist,
          state: ssoUserData.state,
          address: ssoUserData.loc,
        },
        existing_user: existingUser ? { id: existingUser.id, username: existingUser.username } : null,
        action: existingUser ? 'link_required' : 'register'
      });
    } catch (error) {
      routeLog.error({ err: error }, 'Token validation failed');
      res.status(500).json({ error: error instanceof Error ? error.message : 'Validation failed' });
    }
  });

  // ... existing code ...

  // Public/Shared Settings Routes
  app.use("/api/settings", createPublicSettingsRouter());

  // Session store: align with rc3 (single worker, Postgres-backed)
  const PgSession = connectPgSimple(session);
  const sessionStore = new PgSession({
    pool,
    tableName: "session",
    createTableIfMissing: true,
    pruneSessionInterval: 600, // 10 minutes (reduce DB load)
  });

  // Session middleware
  const envCookieName = process.env.SESSION_COOKIE_NAME || "hp-tourism.sid";
  const isProduction = process.env.NODE_ENV === "production";
  const envCookieSecure = isProduction || (process.env.SESSION_COOKIE_SECURE || "true").toLowerCase() === "true";
  const envCookieSameSite = (process.env.SESSION_COOKIE_SAMESITE || "lax").toLowerCase() as "lax" | "strict" | "none";
  // FIX: Allow dev1.osipl.dev by clearing restrictive domain if set to dev.osipl.dev
  const rawDomain = process.env.SESSION_COOKIE_DOMAIN;
  const envCookieDomain = rawDomain === "dev.osipl.dev" ? undefined : (rawDomain || undefined);

  // Validate session secret is set (required for security)
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET environment variable must be set with at least 32 characters");
  }

  app.use(
    session({
      name: envCookieName,
      store: sessionStore,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true, // Force cookie refresh on every response
      proxy: true, // Trust the reverse proxy when setting secure cookies
      cookie: {
        secure: envCookieSecure,
        sameSite: envCookieSameSite,
        httpOnly: true,
        domain: envCookieDomain,
        maxAge: 1000 * 60 * 60 * 8, // 8 hours (government portal security)
      },
    })
  );

  app.use((req, _res, next) => {
    if (req.path.startsWith("/api/admin/settings")) {
      logHttpTrace("request", {
        method: req.method,
        path: req.path,
        userId: req.session.userId ?? "none",
      });
    }
    next();
  });

  // Debug route to verify session and server identity (Diagnostic)
  app.get("/api/verify-session-status", (req, res) => {
    res.json({
      pid: process.pid,
      port: process.env.PORT,
      userId: req.session?.userId,
      hasSession: !!req.session,
      cookie: req.headers.cookie ? "present" : "missing",
      timestamp: new Date().toISOString()
    });
  });

  // Direct route for password verification (Placed here to be AFTER session middleware but BEFORE generic routers)
  app.post("/api/verify-critical-password", async (req, res) => {
    try {
      const { password, username } = req.body;

      if (!password || typeof password !== "string") {
        return res.status(400).json({ message: "Password is required" });
      }

      let user;

      // Strategy 1: Session-based (Preferred)
      if (req.session?.userId) {
        user = await db.query.users.findFirst({
          where: eq(users.id, req.session.userId),
        });
      }
      // Strategy 2: Username-based (Fallthrough for split-routing scenarios where session is trapped on legacy server)
      else if (username && typeof username === "string") {
        user = await db.query.users.findFirst({
          where: eq(users.username, username),
        });
      }

      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Verify password (schema column is 'password' which contains the hash)
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Success
      res.json({ verified: true });
    } catch (error) {
      // Fix logging to properly capture error object
      logger.error(error, "Password verification failed");
      res.status(500).json({ message: "Verification failed" });
    }
  });

  // Public API endpoints (no authentication required)
  // Application tracking by application number, aadhaar, or phone
  app.get("/api/applications/track", async (req, res) => {
    try {
      const { app: appNumber, aadhaar, phone } = req.query;

      let application = null;

      if (appNumber && typeof appNumber === "string") {
        // Search by application number
        [application] = await db
          .select({
            id: homestayApplications.id,
            applicationNumber: homestayApplications.applicationNumber,
            propertyName: homestayApplications.propertyName,
            ownerName: homestayApplications.ownerName,
            category: homestayApplications.category,
            district: homestayApplications.district,
            totalRooms: homestayApplications.totalRooms,
            status: homestayApplications.status,
            submittedAt: homestayApplications.submittedAt,
            remarks: homestayApplications.daRemarks,
          })
          .from(homestayApplications)
          .where(eq(homestayApplications.applicationNumber, appNumber))
          .limit(1);
      } else if (aadhaar && typeof aadhaar === "string") {
        // Search by Aadhaar (last 4 digits match for privacy)
        const aadhaarLast4 = aadhaar.slice(-4);
        [application] = await db
          .select({
            id: homestayApplications.id,
            applicationNumber: homestayApplications.applicationNumber,
            propertyName: homestayApplications.propertyName,
            ownerName: homestayApplications.ownerName,
            category: homestayApplications.category,
            district: homestayApplications.district,
            totalRooms: homestayApplications.totalRooms,
            status: homestayApplications.status,
            submittedAt: homestayApplications.submittedAt,
            remarks: homestayApplications.daRemarks,
          })
          .from(homestayApplications)
          .where(sql`${homestayApplications.ownerAadhaar} LIKE ${'%' + aadhaarLast4}`)
          .limit(1);
      } else if (phone && typeof phone === "string") {
        // Search by phone number
        [application] = await db
          .select({
            id: homestayApplications.id,
            applicationNumber: homestayApplications.applicationNumber,
            propertyName: homestayApplications.propertyName,
            ownerName: homestayApplications.ownerName,
            category: homestayApplications.category,
            district: homestayApplications.district,
            totalRooms: homestayApplications.totalRooms,
            status: homestayApplications.status,
            submittedAt: homestayApplications.submittedAt,
            remarks: homestayApplications.daRemarks,
          })
          .from(homestayApplications)
          .where(eq(homestayApplications.ownerMobile, phone))
          .limit(1);
      } else {
        return res.status(400).json({ message: "Please provide app, aadhaar, or phone query parameter" });
      }

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(application);
    } catch (error: any) {
      routeLog.error({ err: error, stack: error?.stack }, "[track] Error tracking application");
      res.status(500).json({ message: "Failed to track application", error: error?.message });
    }
  });

  // Certificate verification
  app.get("/api/certificates/verify", async (req, res) => {
    try {
      const { cert } = req.query;

      if (!cert || typeof cert !== "string") {
        return res.status(400).json({ message: "Please provide cert query parameter" });
      }

      // Look up certificate
      const [certificate] = await db
        .select({
          id: certificates.id,
          certificateNumber: certificates.certificateNumber,
          propertyName: homestayApplications.propertyName,
          ownerName: homestayApplications.ownerName,
          category: homestayApplications.category,
          district: homestayApplications.district,
          issuedAt: certificates.issuedDate,
        })
        .from(certificates)
        .innerJoin(homestayApplications, eq(certificates.applicationId, homestayApplications.id))
        .where(eq(certificates.certificateNumber, cert))
        .limit(1);

      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.json(certificate);
    } catch (error) {
      routeLog.error("[verify] Error verifying certificate:", error);
      res.status(500).json({ message: "Failed to verify certificate" });
    }
  });

  // HP SSO (Him Access Citizen) authentication routes
  app.use("/api/auth/hpsso", hpssoRouter);

  // Direct route for password verification (Must be BEFORE generic auth router)


  app.use("/api/auth", createAuthRouter());

  app.use("/api/profile", createProfileRouter());

  // Test Runner (Must be before generic /api routes)
  app.use("/api/test", testRunnerRoutes);

  app.use("/api/applications", createApplicationsRouter());
  app.use("/api/payments", createPaymentsRouter());
  app.use("/api/dtdo", createDtdoRouter());
  app.use(
    "/api/applications",
    createOwnerApplicationsRouter({
      getRoomRateBandsSetting,
    }),
  );
  app.use("/api/service-center", createServiceCenterRouter());
  app.use("/api/existing-owners", createExistingOwnersRouter());

  // Adventure Sports routes
  const adventureSportsRoutes = (await import("./routes/adventure-sports")).default;
  app.use("/api/adventure-sports", adventureSportsRoutes);

  // Grievance Management
  const grievanceRouter = (await import("./routes/grievances")).default;
  app.use("/api/grievances", grievanceRouter);

  // Grievance Reports & Analytics
  const grievanceReportsRouter = (await import("./routes/grievances/reports")).default;
  app.use("/api/grievances/reports", grievanceReportsRouter);

  // Public endpoint for multi-service hub check (used by login redirect)
  const { getMultiServiceHubEnabled } = await import("./routes/core/multi-service");
  app.get("/api/portal/multi-service-enabled", async (_req, res) => {
    try {
      const enabled = await getMultiServiceHubEnabled();
      res.json({ enabled });
    } catch (error) {
      routeLog.error("[portal] Failed to check multi-service setting:", error);
      res.json({ enabled: false }); // Default to disabled on error
    }
  });

  app.use("/api/admin", createAdminCommunicationsRouter());
  // Administrative stats and settings
  const adminStatsRouter = createAdminStatsRouter();
  app.use("/api/admin", adminStatsRouter);

  const adminHimkoshRouter = createAdminHimkoshRouter();
  app.use("/api/admin", adminHimkoshRouter);

  // User Management
  app.use("/api/admin", createAdminUsersRouter());

  const adminSettingsRouter = createAdminSettingsRouter();
  app.use("/api/admin", adminSettingsRouter);

  // Public routes (Stats, etc.)
  const publicRouter = createPublicRouter();
  app.use("/api/public", publicRouter);
  app.use("/api/admin", createAdminDevopsRouter());
  app.use("/api/admin/backup", createBackupRouter());
  app.use("/api/admin/migration", createMigrationRouter());
  app.use("/api/admin", createAdminSeedRouter());
  app.use("/api/admin", createAdminReportsRouter());
  app.use("/api", createAdminLegacyRcRouter());
  app.use("/api/admin", baselineStatsRouter);

  // Admin Application Actions (Reactivate etc.)
  const { default: adminAppActionsRouter } = await import("./routes/admin/application-actions");
  app.use(adminAppActionsRouter);


  // State Dashboard (Him-Darshan)
  // Protected by auth, accessible to all logged-in staff/officers
  const statsRouter = (await import("./routes/stats")).default;
  app.use("/api/stats", requireAuth, statsRouter);

  // DA send-back OTP verification routes
  const { createSendbackOtpRouter } = await import("./routes/sendback-otp");
  app.use("/api/sendback-otp", createSendbackOtpRouter());

  // Dev Tools (Workflow Simulator) - STRICTLY DEV ONLY (Protected by internal middleware)
  const { createDevToolsRouter } = await import("./routes/dev-tools");
  app.use("/api/dev", createDevToolsRouter());

  // CCAvenue Test Routes
  const { createCCAvenueTestRouter } = await import("./routes/ccavenue-test");
  app.use("/api/ccavenue/test", createCCAvenueTestRouter());

  registerDaRoutes(app);

  const getUploadPolicy = async (): Promise<UploadPolicy> => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, UPLOAD_POLICY_SETTING_KEY))
        .limit(1);

      if (!setting) {
        return DEFAULT_UPLOAD_POLICY;
      }

      return normalizeUploadPolicy(setting.settingValue);
    } catch (error) {
      routeLog.error("[upload-policy] Failed to fetch policy, falling back to defaults:", error);
      return DEFAULT_UPLOAD_POLICY;
    }
  };

  app.use("/api", createUploadRouter({ getUploadPolicy }));

  const getCategoryEnforcementSetting = async () => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, ENFORCE_CATEGORY_SETTING_KEY))
        .limit(1);

      if (!setting) {
        return DEFAULT_CATEGORY_ENFORCEMENT;
      }

      return normalizeCategoryEnforcementSetting(setting.settingValue);
    } catch (error) {
      routeLog.error("[category-enforcement] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_CATEGORY_ENFORCEMENT;
    }
  };

  async function getRoomRateBandsSetting() {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, ROOM_RATE_BANDS_SETTING_KEY))
        .limit(1);

      if (!setting) {
        return DEFAULT_CATEGORY_RATE_BANDS;
      }

      return normalizeCategoryRateBands(setting.settingValue);
    } catch (error) {
      routeLog.error("[room-rate-bands] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_CATEGORY_RATE_BANDS;
    }
  }

  const getRoomCalcModeSetting = async () => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, ROOM_CALC_MODE_SETTING_KEY))
        .limit(1);
      if (!setting) {
        return DEFAULT_ROOM_CALC_MODE;
      }
      return normalizeRoomCalcModeSetting(setting.settingValue);
    } catch (error) {
      routeLog.error("[room-calc-mode] Failed to fetch setting, falling back to defaults:", error);
      return DEFAULT_ROOM_CALC_MODE;
    }
  };

  app.get("/api/settings/upload-policy", requireAuth, async (_req, res) => {
    try {
      const policy = await getUploadPolicy();
      res.json(policy);
    } catch (error) {
      routeLog.error("[upload-policy] Failed to fetch policy:", error);
      res.status(500).json({ message: "Failed to fetch upload policy" });
    }
  });

  app.get("/api/settings/category-enforcement", requireAuth, async (_req, res) => {
    try {
      const setting = await getCategoryEnforcementSetting();
      res.json(setting);
    } catch (error) {
      routeLog.error("[category-enforcement] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch category enforcement setting" });
    }
  });

  app.get("/api/settings/room-rate-bands", requireAuth, async (_req, res) => {
    try {
      const setting = await getRoomRateBandsSetting();
      res.json(setting);
    } catch (error) {
      routeLog.error("[room-rate-bands] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch rate band setting" });
    }
  });

  app.get("/api/settings/room-calc-mode", requireAuth, async (_req, res) => {
    try {
      const setting = await getRoomCalcModeSetting();
      res.json(setting);
    } catch (error) {
      routeLog.error("[room-calc-mode] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch room configuration mode" });
    }
  });



  // ========================================
  // DEALING ASSISTANT (DA) ROUTES
  // ========================================



  app.patch("/api/staff/profile", requireRole(...STAFF_PROFILE_ROLES), handleStaffProfileUpdate);
  app.patch("/api/da/profile", requireRole('dealing_assistant'), handleStaffProfileUpdate);
  app.patch("/api/dtdo/profile", requireRole('district_tourism_officer', 'district_officer'), handleStaffProfileUpdate);

  app.post("/api/staff/change-password", requireRole(...STAFF_PROFILE_ROLES), handleStaffPasswordChange);
  app.post("/api/da/change-password", requireRole('dealing_assistant'), handleStaffPasswordChange);
  app.post("/api/dtdo/change-password", requireRole('district_tourism_officer', 'district_officer'), handleStaffPasswordChange);
  app.post("/api/owner/change-password", requireRole('property_owner'), handleStaffPasswordChange);



  const LEGACY_VERIFY_ALLOWED_STATUSES = new Set([
    "legacy_rc_review",
    "submitted",
    "under_scrutiny",
    "forwarded_to_dtdo",
    "dtdo_review",
  ]);

  app.post(
    "/api/applications/:id/legacy-verify",
    requireRole("dealing_assistant", "district_tourism_officer", "district_officer"),
    async (req, res) => {
      try {
        const { remarks } = req.body ?? {};
        const trimmedRemarks = typeof remarks === "string" ? remarks.trim() : "";
        const actorId = req.session.userId!;
        const actor = await storage.getUser(actorId);
        const application = await storage.getApplication(req.params.id);

        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }

        if (!isServiceApplicationKind(application.applicationKind)) {
          return res
            .status(400)
            .json({ message: "Legacy verification is only available for service requests." });
        }

        if (!application.status || !LEGACY_VERIFY_ALLOWED_STATUSES.has(application.status)) {
          return res.status(400).json({
            message: "Application is not in a state that allows legacy verification.",
          });
        }

        if (actor?.district && !districtsMatch(actor.district, application.district)) {
          return res
            .status(403)
            .json({ message: "You can only process applications from your district." });
        }

        const now = new Date();
        const updates: Partial<HomestayApplication> = {
          status: "approved",
          currentStage: "final",
          approvedAt: now,
        };

        if (!application.certificateIssuedDate) {
          updates.certificateIssuedDate = now;
        }

        if (
          actor?.role === "district_tourism_officer" ||
          actor?.role === "district_officer"
        ) {
          updates.dtdoId = actorId;
          updates.dtdoReviewDate = now;
          updates.dtdoRemarks = trimmedRemarks || application.dtdoRemarks || null;
        } else if (actor?.role === "dealing_assistant") {
          updates.daId = actorId;
          updates.daReviewDate = now;
          updates.daRemarks = trimmedRemarks || application.daRemarks || null;
        }

        const updated = await storage.updateApplication(req.params.id, updates);
        await logApplicationAction({
          applicationId: req.params.id,
          actorId,
          action: "legacy_rc_verified",
          previousStatus: application.status,
          newStatus: "approved",
          feedback: trimmedRemarks || undefined,
        });

        res.json({
          message: "Legacy RC verified successfully.",
          application: updated ?? { ...application, ...updates },
        });
      } catch (error) {
        routeLog.error("[legacy] Failed to verify application:", error);
        res.status(500).json({ message: "Failed to verify legacy request" });
      }
    },
  );

  app.get(
    "/api/legacy/settings",
    requireRole(
      "dealing_assistant",
      "district_tourism_officer",
      "district_officer",
      "admin",
      "super_admin",
      "admin_rc",
    ),
    async (_req, res) => {
      try {
        const forwardEnabled = await getLegacyForwardEnabled();
        res.json({ forwardEnabled });
      } catch (error) {
        routeLog.error("[legacy] Failed to load settings", error);
        res.status(500).json({ message: "Failed to load legacy settings" });
      }
    },
  );

  // ========================================
  // DTDO (District Tourism Development Officer) ROUTES
  // ========================================

  // Get applications for DTDO (district-specific)
  app.get("/api/dtdo/applications", requireRole('district_tourism_officer', 'district_officer'), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);

      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }

      const districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);

      // Get all applications from this DTDO's district ordered by most recent
      const allApplications = await db
        .select()
        .from(homestayApplications)
        .where(districtCondition)
        .orderBy(desc(homestayApplications.createdAt));

      let latestCorrectionMap: Map<
        string,
        { createdAt: Date | null; feedback: string | null }
      > | null = null;
      if (allApplications.length > 0) {
        const applicationIds = allApplications.map((app) => app.id);
        const correctionRows = await db
          .select({
            applicationId: applicationActions.applicationId,
            createdAt: applicationActions.createdAt,
            feedback: applicationActions.feedback,
          })
          .from(applicationActions)
          .where(
            and(
              inArray(applicationActions.applicationId, applicationIds),
              eq(applicationActions.action, "correction_resubmitted"),
            ),
          )
          .orderBy(desc(applicationActions.createdAt));
        latestCorrectionMap = new Map();
        for (const row of correctionRows) {
          if (!latestCorrectionMap.has(row.applicationId)) {
            latestCorrectionMap.set(row.applicationId, {
              createdAt: row.createdAt ?? null,
              feedback: row.feedback ?? null,
            });
          }
        }
      }

      // Enrich with owner and DA information
      const applicationsWithDetails = await Promise.all(
        allApplications.map(async (app) => {
          const owner = await storage.getUser(app.userId);

          // Get DA name if the application was forwarded by DA
          let daName = undefined;
          const daRemarks = (app as unknown as { daRemarks?: string }).daRemarks;
          if (daRemarks || app.daId) {
            const da = app.daId ? await storage.getUser(app.daId) : null;
            daName = da?.fullName || 'Unknown DA';
          }

          return {
            ...app,
            ownerName: owner?.fullName || 'Unknown',
            ownerMobile: owner?.mobile || 'N/A',
            daName,
            latestCorrection: latestCorrectionMap?.get(app.id) ?? null,
          };
        })
      );

      res.json(applicationsWithDetails);
    } catch (error) {
      routeLog.error("[dtdo] Failed to fetch applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // DTDO can update application fields (for certificate corrections)
  app.patch("/api/dtdo/applications/:id", requireRole('district_tourism_officer', 'district_officer'), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);

      if (!user || !user.district) {
        return res.status(400).json({ message: "DTDO must be assigned to a district" });
      }

      const application = await storage.getApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Verify application belongs to DTDO's district
      if (application.district?.toLowerCase() !== user.district?.toLowerCase()) {
        return res.status(403).json({ message: "You can only update applications in your district" });
      }

      // Allow updating only specific fields for corrections
      const allowedFields = [
        'ownerName', 'ownerGender', 'guardianName', 'ownerAadhaar',
        'propertyName', 'address', 'pincode', 'latitude', 'longitude',
        'singleBedRooms', 'doubleBedRooms', 'familySuites',
        'singleBedRoomRate', 'doubleBedRoomRate', 'familySuiteRate',
        'nearestHospital', 'distanceAirport', 'distanceRailway', 'distanceCityCenter', 'distanceBusStand'
      ];

      const updates: Record<string, unknown> = {};
      for (const field of allowedFields) {
        if (field in req.body) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // Update the application
      const updated = await db
        .update(homestayApplications)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(homestayApplications.id, req.params.id))
        .returning();

      // Log the action
      await db.insert(applicationActions).values({
        id: crypto.randomUUID(),
        applicationId: req.params.id,
        userId,
        action: "dtdo_edit",
        feedback: `DTDO updated fields: ${Object.keys(updates).join(', ')}`,
        createdAt: new Date(),
      });

      routeLog.info("[dtdo] Application updated", {
        applicationId: req.params.id,
        updatedBy: user.username,
        fields: Object.keys(updates),
      });

      res.json({ success: true, application: updated[0] });
    } catch (error) {
      routeLog.error("[dtdo] Failed to update application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });




  // ====================================================================
  // DA INSPECTION ROUTES
  // ====================================================================

  // Get all inspection orders assigned to this DA
  app.get("/api/da/inspections", requireRole('dealing_assistant'), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!user.district) {
        return res.status(400).json({ message: "Dealing Assistant must be assigned to a district" });
      }

      const districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);

      // Get all inspection orders for the district
      // We join with homestayApplications to filter by district to ensure visibility even if assignedTo doesn't match exactly
      const rows = await db
        .select({
          order: inspectionOrders
        })
        .from(inspectionOrders)
        .innerJoin(homestayApplications, eq(inspectionOrders.applicationId, homestayApplications.id))
        .where(or(districtCondition, eq(inspectionOrders.assignedTo, userId)))
        .orderBy(desc(inspectionOrders.createdAt));

      if (process.env.NODE_ENV !== "production") {
        // Log query success in dev
      }

      const inspectionOrdersData = rows.map(r => r.order);

      routeLog.info("[da] inspections query", {
        userId,
        username: user?.username,
        district: user.district,
        count: inspectionOrdersData.length,
        orderIds: inspectionOrdersData.map((order) => order.id),
      });

      // Enrich with application and property details
      const enrichedOrders = await Promise.all(
        inspectionOrdersData.map(async (order) => {
          try {
            const application = await storage.getApplication(order.applicationId);
            if (!application) {
              // log application finding mismatch
              // console.warn(`[InspectionList] Warning: Application not found for Order ${order.id}, AppId: ${order.applicationId}`);
            } else {
              // Found application

            }
            const owner = application ? await storage.getUser(application.userId) : null;

            // Check if report already exists
            const existingReport = await db
              .select()
              .from(inspectionReports)
              .where(eq(inspectionReports.inspectionOrderId, order.id))
              .limit(1);

            return {
              ...order,
              application: application
                ? {
                  id: application.id,
                  applicationNumber: application.applicationNumber,
                  propertyName: application.propertyName,
                  category: application.category,
                  status: application.status,
                  dtdoRemarks: application.dtdoRemarks ?? null,
                }
                : null,
              owner: owner ? {
                fullName: owner.fullName,
                mobile: owner.mobile,
              } : null,
              reportSubmitted: existingReport.length > 0,
            };
          } catch (e: any) {
            console.error(`[InspectionList] Error enriching order ${order.id}:`, e);
            return {
              ...order,
              application: null,
              owner: null,
              reportSubmitted: false
            };
          }
        })
      );

      res.json(enrichedOrders);
    } catch (error) {
      routeLog.error("[da] Failed to fetch inspections:", error);
      res.status(500).json({ message: "Failed to fetch inspections" });
    }
  });

  // Get single inspection order details
  app.get("/api/da/inspections/:id", requireRole('dealing_assistant'), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);

      const order = await db
        .select()
        .from(inspectionOrders)
        .where(eq(inspectionOrders.id, req.params.id))
        .limit(1);

      if (order.length === 0) {
        return res.status(404).json({ message: "Inspection order not found" });
      }

      // Get application details FIRST to check district permission
      const application = await storage.getApplication(order[0].applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Verify this inspection is assigned to the logged-in DA OR user is in the same district
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const isAssigned = order[0].assignedTo === userId;
      const isSameDistrict = user.district && districtsMatch(user.district, application.district);

      if (!isAssigned && !isSameDistrict) {
        return res.status(403).json({ message: "You can only access inspections assigned to you or within your district" });
      }

      // Get owner details
      const owner = await storage.getUser(application.userId);

      // Get documents
      const documents = await storage.getDocumentsByApplication(application.id);

      // Check if report already submitted
      const existingReport = await db
        .select()
        .from(inspectionReports)
        .where(eq(inspectionReports.inspectionOrderId, req.params.id))
        .limit(1);

      res.json({
        order: order[0],
        application,
        owner: owner ? {
          fullName: owner.fullName,
          mobile: owner.mobile,
          email: owner.email,
        } : null,
        documents,
        reportSubmitted: existingReport.length > 0,
        existingReport: existingReport.length > 0 ? existingReport[0] : null,
      });
    } catch (error) {
      routeLog.error("[da] Failed to fetch inspection details:", error);
      res.status(500).json({ message: "Failed to fetch inspection details" });
    }
  });

  // Submit inspection report
  app.post("/api/da/inspections/:id/submit-report", requireRole('dealing_assistant'), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const orderId = req.params.id;

      // Validate the inspection order exists and is assigned to this DA
      const order = await db
        .select()
        .from(inspectionOrders)
        .where(eq(inspectionOrders.id, orderId))
        .limit(1);

      if (order.length === 0) {
        return res.status(404).json({ message: "Inspection order not found" });
      }

      if (order[0].assignedTo !== userId) {
        return res.status(403).json({ message: "You can only submit reports for inspections assigned to you" });
      }

      // Check if report already exists
      const existingReport = await db
        .select()
        .from(inspectionReports)
        .where(eq(inspectionReports.inspectionOrderId, orderId))
        .limit(1);

      if (existingReport.length > 0) {
        return res.status(400).json({ message: "Inspection report already submitted for this order" });
      }

      // Validate actual inspection date
      const scheduledDate = new Date(order[0].inspectionDate);
      const actualInspectionDateInput = req.body.actualInspectionDate
        ? new Date(req.body.actualInspectionDate)
        : null;

      if (!actualInspectionDateInput || Number.isNaN(actualInspectionDateInput.getTime())) {
        return res.status(400).json({ message: "Actual inspection date is required" });
      }

      const normalizedScheduledDate = toDateOnly(scheduledDate);
      const normalizedActualDate = toDateOnly(actualInspectionDateInput);
      const normalizedToday = toDateOnly(new Date());
      const earliestOverrideDate = toDateOnly(subDays(normalizedScheduledDate, EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS));
      const earlyOverrideEnabled = Boolean(req.body.earlyInspectionOverride);
      const earlyOverrideReason = typeof req.body.earlyInspectionReason === "string"
        ? req.body.earlyInspectionReason.trim()
        : "";
      const actualBeforeSchedule = normalizedActualDate < normalizedScheduledDate;

      if (actualBeforeSchedule) {
        if (!earlyOverrideEnabled) {
          return res.status(400).json({
            message: `Actual inspection date cannot be before the scheduled date (${format(normalizedScheduledDate, "PPP")}). Enable the early inspection override and record a justification.`,
          });
        }
        if (normalizedActualDate < earliestOverrideDate) {
          return res.status(400).json({
            message: `Early inspections can only be logged up to ${EARLY_INSPECTION_OVERRIDE_WINDOW_DAYS} days before the scheduled date.`,
          });
        }
        if (!earlyOverrideReason || earlyOverrideReason.length < 15) {
          return res.status(400).json({
            message: "Please provide a justification of at least 15 characters for the early inspection.",
          });
        }
      }

      if (normalizedActualDate > normalizedToday) {
        return res.status(400).json({ message: "Actual inspection date cannot be in the future" });
      }

      // Validate and prepare report data
      const daysEarly = actualBeforeSchedule
        ? differenceInCalendarDays(normalizedScheduledDate, normalizedActualDate)
        : 0;
      const earlyOverrideNote =
        actualBeforeSchedule && earlyOverrideEnabled
          ? `Early inspection override: Conducted ${daysEarly} day${daysEarly === 1 ? '' : 's'} before the scheduled date (${format(normalizedScheduledDate, "PPP")}). Reason: ${earlyOverrideReason}`
          : null;
      const mergedMandatoryRemarks = (() => {
        const baseRemarks = req.body.mandatoryRemarks?.trim();
        if (!earlyOverrideNote) {
          return baseRemarks || null;
        }
        return baseRemarks ? `${baseRemarks}\n\n${earlyOverrideNote}` : earlyOverrideNote;
      })();

      const reportData = {
        inspectionOrderId: orderId,
        applicationId: order[0].applicationId,
        submittedBy: userId,
        submittedDate: new Date(),
        actualInspectionDate: normalizedActualDate,
        // Basic verification fields
        roomCountVerified: req.body.roomCountVerified ?? false,
        actualRoomCount: req.body.actualRoomCount || null,
        categoryMeetsStandards: req.body.categoryMeetsStandards ?? false,
        recommendedCategory: req.body.recommendedCategory || null,
        // ANNEXURE-III Checklists
        mandatoryChecklist: req.body.mandatoryChecklist || null,
        mandatoryRemarks: mergedMandatoryRemarks,
        desirableChecklist: req.body.desirableChecklist || null,
        desirableRemarks: req.body.desirableRemarks || null,
        // Legacy compatibility fields
        amenitiesVerified: req.body.amenitiesVerified || null,
        amenitiesIssues: req.body.amenitiesIssues || null,
        fireSafetyCompliant: req.body.fireSafetyCompliant ?? false,
        fireSafetyIssues: req.body.fireSafetyIssues || null,
        structuralSafety: req.body.structuralSafety ?? false,
        structuralIssues: req.body.structuralIssues || null,
        // Overall assessment
        overallSatisfactory: req.body.overallSatisfactory ?? false,
        recommendation: req.body.recommendation || 'approve',
        detailedFindings: req.body.detailedFindings || '',
        // Additional fields
        inspectionPhotos: req.body.inspectionPhotos || null,
        reportDocumentUrl: req.body.reportDocumentUrl || null,
      };

      // Load application to capture previous status for logging
      const currentApplication = await storage.getApplication(order[0].applicationId);

      // Insert inspection report
      const [newReport] = await db.insert(inspectionReports).values(reportData).returning();

      // Update inspection order status to completed
      await db.update(inspectionOrders)
        .set({ status: 'completed', updatedAt: new Date() })
        .where(eq(inspectionOrders.id, orderId));

      const normalizedRecommendation = (reportData.recommendation || "").toLowerCase();
      const siteInspectionOutcome =
        normalizedRecommendation === "raise_objections"
          ? "objection"
          : normalizedRecommendation === "approve"
            ? "recommended"
            : "completed";
      const applicationId = order[0].applicationId;
      if (!applicationId) {
        return res.status(400).json({ message: "Inspection order is missing an application reference" });
      }
      const applicationIdSafe = applicationId as string;

      // Auto-create acknowledgement if owner never clicked it, so downstream stages are not blocked.
      const ackExists = await db
        .select({ id: applicationActions.id })
        .from(applicationActions)
        .where(
          and(
            eq(applicationActions.applicationId, applicationIdSafe),
            eq(applicationActions.action, "inspection_acknowledged"),
          ),
        )
        .limit(1);
      if (ackExists.length === 0) {
        await db.insert(applicationActions).values({
          applicationId: applicationIdSafe,
          officerId: userId,
          action: "inspection_acknowledged",
          previousStatus: currentApplication?.status ?? null,
          newStatus: currentApplication?.status ?? null,
          feedback: "Auto-acknowledged after inspection completion.",
        });
      }

      await storage.updateApplication(applicationIdSafe, {
        status: "inspection_under_review",
        currentStage: "inspection_completed",
        siteInspectionNotes: reportData.detailedFindings || null,
        siteInspectionOutcome,
        siteInspectionCompletedDate: new Date(),
        inspectionReportId: newReport.id,
        clarificationRequested: null,
        rejectionReason: null,
      } as Partial<HomestayApplication>);

      await logApplicationAction({
        applicationId: applicationIdSafe,
        actorId: userId,
        action: "inspection_completed",
        previousStatus: currentApplication?.status ?? null,
        newStatus: "inspection_under_review",
        feedback: reportData.detailedFindings || null,
      });

      res.json({
        report: newReport,
        message: "Inspection report submitted successfully",
      });
    } catch (error) {
      routeLog.error("[da] Failed to submit inspection report:", error);
      res.status(500).json({ message: "Failed to submit inspection report" });
    }
  });

  // Document Routes

  // Get documents for application


  // Payment Routes

  // Create payment


  // Public Routes (Discovery Platform)

  // Get approved properties
  app.get("/api/public/properties", async (req, res) => {
    try {
      const properties = await storage.getApplicationsByStatus('approved');
      res.json({ properties });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get payment workflow setting (public - needed by application form)
  app.get("/api/public/settings/payment-workflow", async (_req, res) => {
    try {
      const { getPaymentWorkflow } = await import("./services/systemSettings");
      const workflow = await getPaymentWorkflow();
      res.json({ workflow });
    } catch (error) {
      routeLog.error("Failed to fetch payment workflow setting:", error);
      // Default to legacy flow on error
      res.json({ workflow: "on_approval" });
    }
  });

  // Get default payment gateway setting (public - needed by payment page)
  app.get("/api/public/settings/payment-gateway", async (_req, res) => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, "default_payment_gateway"))
        .limit(1);

      const gateway = (setting?.settingValue as any)?.gateway ?? "himkosh";
      res.json({ gateway });
    } catch (error) {
      routeLog.error("Failed to fetch payment gateway setting:", error);
      res.json({ gateway: "himkosh" }); // Default fallback
    }
  });

  // Analytics Routes (Officers Only)

  // Get production portal statistics (Legacy A + Real-time P)
  // UPDATED: Filters by district for DA/DTDO/DO
  app.get("/api/analytics/production-stats", requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"), async (req, res) => {
    try {
      let user = req.user as User;
      if (!user && req.session?.userId) {
        user = await storage.getUser(req.session.userId);
      }
      if (!user) {
        console.error("[ProductionStats] req.user AND session.userId missing");
        return res.status(401).json({ message: "User context missing" });
      }
      let query = db.select().from(homestayApplications);
      let isGlobalView = false;

      // 1. Apply District Filter
      // If user has a district, they see only their district (Filtered View).
      // Even if admin/state_officer, if they are restricted to a district/acting as one, they don't see global legacy stats.
      if (["admin", "state_officer"].includes(user.role) && !user.district) {
        isGlobalView = true;
      } else if (user.district) {
        // District officers (or admins with district) see only their jurisdiction
        const coveredDistricts = getDistrictsCoveredBy(user.district);
        if (coveredDistricts.length > 0) {
          const filters = coveredDistricts.map(d => ilike(homestayApplications.district, d));
          if (filters.length === 1) {
            query = db.select().from(homestayApplications).where(filters[0]) as any;
          } else {
            query = db.select().from(homestayApplications).where(or(...filters)) as any;
          }
        }
      }

      // 2. Fetch real-time counts from DB (P)
      const allApplications = await query;

      const realtime = allApplications.reduce(
        (acc, app) => {
          acc.total++;
          if (app.status === "approved") acc.approved++;
          else if (app.status === "rejected") acc.rejected++;
          else if (app.status === "submitted" || app.status === "under_review" || app.status === "payment_pending") acc.pending++;
          return acc;
        },
        { total: 0, approved: 0, rejected: 0, pending: 0 }
      );

      // 3. Fetch legacy stats from system settings (A) - ONLY for Global Admin View
      // Legacy stats are global aggregates and cannot be split by district.
      let legacy = {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };

      if (isGlobalView) {
        const [legacySetting] = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.settingKey, "admin_legacy_stats"))
          .limit(1);

        if (legacySetting?.settingValue) {
          legacy = legacySetting.settingValue as any;
        }
      }

      // 4. Fetch Baseline/Offline Stats (Manual Processing June '25 - Jan '26)
      // These are district-specific, so we can filter them correctly.
      let baselineTotal = 0;
      let baselineApproved = 0;
      let baselineRejected = 0;
      let baselinePending = 0;

      const baselineStats = await db.select().from(districtBaselineStats);

      baselineStats.forEach(stat => {
        let include = false;
        if (isGlobalView) {
          include = true;
        } else if (user.district) {
          const covered = getDistrictsCoveredBy(user.district);
          // Simple case-insensitive match
          if (covered.some(d => d.toLowerCase() === stat.district.toLowerCase())) {
            include = true;
          }
        }

        if (include) {
          baselineTotal += stat.totalCount;
          baselineApproved += stat.approvedCount;
          baselineRejected += stat.rejectedCount;
          baselinePending += stat.pendingCount;
        }
      });

      // 5. Combine counts (Realtime + Legacy + Baseline)
      const stats = {
        totalApplications: realtime.total + (parseInt(legacy.total) || 0) + baselineTotal,
        approvedApplications: realtime.approved + (parseInt(legacy.approved) || 0) + baselineApproved,
        rejectedApplications: realtime.rejected + (parseInt(legacy.rejected) || 0) + baselineRejected,
        pendingApplications: realtime.pending + (parseInt(legacy.pending) || 0) + baselinePending,
        scrapedAt: new Date(),
        realtime,
        legacy,
        baseline: {
          total: baselineTotal,
          approved: baselineApproved,
          rejected: baselineRejected,
          pending: baselinePending
        }
      };

      res.json({ stats });
    } catch (error) {
      console.error('Production stats error DETAILED:', error);
      res.status(500).json({ message: "Failed to fetch production stats", error: String(error) });
    }
  });

  // Get analytics dashboard data
  app.get("/api/analytics/dashboard", requireRole("dealing_assistant", "district_tourism_officer", "district_officer", "state_officer", "admin"), async (req, res) => {
    try {
      const userId = req.session.userId!;
      const currentUser = await storage.getUser(userId);

      const allApplications = await storage.getAllApplications();
      const allUsers = await storage.getAllUsers();

      const normalizeStatus = (status: string | null | undefined) =>
        (status ?? "").trim().toLowerCase();

      const shouldScopeByDistrict =
        currentUser &&
        ["dealing_assistant", "district_tourism_officer", "district_officer"].includes(currentUser.role) &&
        typeof currentUser.district === "string" &&
        currentUser.district.length > 0;

      const scopedApplications = shouldScopeByDistrict
        ? allApplications.filter((app) => app.district === currentUser!.district)
        : allApplications;

      const scopedOwners = shouldScopeByDistrict
        ? allUsers.filter((user) => user.role === "property_owner" && user.district === currentUser!.district)
        : allUsers.filter((user) => user.role === "property_owner");

      // Separate Existing RC (legacy onboarded) from regular pipeline apps
      const isLegacyRC = (app: any) => (app.applicationNumber || '').startsWith('LG-HS-');
      const pipelineApps = scopedApplications.filter((app) => !isLegacyRC(app));
      const existingRCCount = scopedApplications.filter((app) => isLegacyRC(app)).length;

      const byStatusNew = {
        submitted: pipelineApps.filter((app) => normalizeStatus(app.status) === "submitted").length,
        under_scrutiny: pipelineApps.filter((app) => normalizeStatus(app.status) === "under_scrutiny").length,
        forwarded_to_dtdo: pipelineApps.filter((app) => normalizeStatus(app.status) === "forwarded_to_dtdo").length,
        dtdo_review: pipelineApps.filter((app) => normalizeStatus(app.status) === "dtdo_review").length,
        inspection_scheduled: pipelineApps.filter((app) => normalizeStatus(app.status) === "inspection_scheduled").length,
        inspection_under_review: pipelineApps.filter((app) => normalizeStatus(app.status) === "inspection_under_review").length,
        reverted_to_applicant: pipelineApps.filter((app) => normalizeStatus(app.status) === "reverted_to_applicant").length,
        approved: pipelineApps.filter((app) => normalizeStatus(app.status) === "approved").length,
        rejected: pipelineApps.filter((app) => normalizeStatus(app.status) === "rejected").length,
        draft: pipelineApps.filter((app) => normalizeStatus(app.status) === "draft").length,
      } as const;

      const byStatusLegacy = {
        pending: byStatusNew.submitted,
        district_review: byStatusNew.under_scrutiny,
        state_review: byStatusNew.dtdo_review,
        approved: byStatusNew.approved,
        rejected: byStatusNew.rejected,
      };

      const byStatus = { ...byStatusNew, ...byStatusLegacy };

      const total = pipelineApps.length;
      const newApplications = byStatus.submitted;

      const byCategory = {
        diamond: pipelineApps.filter((a) => a.category === 'diamond').length,
        gold: pipelineApps.filter((a) => a.category === 'gold').length,
        silver: pipelineApps.filter((a) => a.category === 'silver').length,
      };

      const districtCounts: Record<string, number> = {};
      scopedApplications.forEach(app => {
        districtCounts[app.district] = (districtCounts[app.district] || 0) + 1;
      });

      const approvedApps = scopedApplications.filter(a => a.status === 'approved' && a.submittedAt && a.stateReviewDate);
      const processingTimes = approvedApps.map(app => {
        const submitted = new Date(app.submittedAt!).getTime();
        const approved = new Date(app.stateReviewDate!).getTime();
        return Math.floor((approved - submitted) / (1000 * 60 * 60 * 24));
      });
      const avgProcessingTime = processingTimes.length > 0
        ? Math.round(processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length)
        : 0;

      // Calculate Median Form Completion Time (in seconds) based on scoped applications
      // Apply 240-minute (14400 sec) threshold to exclude outliers (e.g., forms left open overnight)
      const FORM_TIME_THRESHOLD_SECONDS = 240 * 60; // 240 minutes = 14400 seconds
      const completionTimes = scopedApplications
        .map(app => app.formCompletionTimeSeconds)
        .filter((t): t is number => typeof t === 'number' && t > 0 && t <= FORM_TIME_THRESHOLD_SECONDS)
        .sort((a, b) => a - b);

      // Use median for a more representative "typical" fill time
      const avgFormTimeSeconds = completionTimes.length > 0
        ? Math.round(
          completionTimes.length % 2 === 0
            ? (completionTimes[completionTimes.length / 2 - 1] + completionTimes[completionTimes.length / 2]) / 2
            : completionTimes[Math.floor(completionTimes.length / 2)]
        )
        : 0;

      const recentApplications = [...scopedApplications]
        .sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 10);

      res.json({
        overview: {
          total,
          newApplications,
          byStatus,
          byCategory,
          avgProcessingTime,
          avgFormTimeSeconds, // Exposed for UI
          totalOwners: scopedOwners.length,
          existingRC: existingRCCount,
        },
        districts: districtCounts,
        recentApplications,
      });
    } catch (error) {
      routeLog.error('Analytics error:', error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Dev Console Routes (Development Only)
  // Admin seed endpoint - creates full test dataset
  // Use this to populate your database with demo data
  app.post("/admin/seed-database", async (req, res) => {
    try {
      // Check if seed data already exists
      const existingUser = await storage.getUserByMobile("9999999991");
      if (existingUser) {
        return res.json({
          message: "Seed data already exists",
          users: 3,
          properties: 5,
          note: "Database already has test accounts. Use /api/dev/clear-all first if you want to re-seed."
        });
      }

      // Create the 3 standard test users (matching seed-mock-data.ts)
      const owner = await storage.createUser({
        fullName: "Property Owner Demo",
        mobile: "9999999991",
        email: "owner@hptourism.com",
        password: "test123",
        role: "property_owner",
        district: "Shimla",
        aadhaarNumber: "123456789001",
      });

      const districtOfficer = await storage.createUser({
        fullName: "District Officer Shimla",
        mobile: "9999999992",
        email: "district@hptourism.gov.in",
        password: "test123",
        role: "district_officer",
        district: "Shimla",
        aadhaarNumber: "123456789002",
      });

      const stateOfficer = await storage.createUser({
        fullName: "State Tourism Officer",
        mobile: "9999999993",
        email: "state@hptourism.gov.in",
        password: "test123",
        role: "state_officer",
        district: "Shimla",
        aadhaarNumber: "123456789003",
      });

      // Create 5 mock homestay properties (matching seed-mock-data.ts)

      // 1. Mountain View Retreat - Diamond - Approved
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Mountain View Retreat",
        category: "diamond",
        totalRooms: 8,
        address: "Naldehra Road, Near Golf Course, Shimla",
        district: "Shimla",
        pincode: "171002",
        latitude: "31.0850",
        longitude: "77.1734",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true,
        },
        rooms: [
          { roomType: "Deluxe", size: 300, count: 4 },
          { roomType: "Suite", size: 450, count: 4 },
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2340.00",
        totalFee: "15340.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(),
        districtNotes: "Excellent property, meets all Diamond category standards",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(),
        stateNotes: "Approved. Exemplary homestay facility",
        certificateNumber: `HP-CERT-2025-${Date.now()}`,
        certificateIssuedDate: new Date(),
        certificateExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
      } as any, { trusted: true });

      // 2. Pine Valley Homestay - Gold - State Review
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Pine Valley Homestay",
        category: "gold",
        totalRooms: 5,
        address: "Kufri Road, Near Himalayan Nature Park, Shimla",
        district: "Shimla",
        pincode: "171012",
        latitude: "31.1048",
        longitude: "77.2659",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          mountainView: true,
          garden: true,
        },
        rooms: [
          { roomType: "Standard", size: 200, count: 3 },
          { roomType: "Deluxe", size: 280, count: 2 },
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1260.00",
        totalFee: "8260.00",
        status: "state_review",
        currentStage: "state",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(),
        districtNotes: "Good property, forwarded to state level",
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 3. Cedar Wood Cottage - Silver - District Review
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Cedar Wood Cottage",
        category: "silver",
        totalRooms: 3,
        address: "Mashobra Village, Near Reserve Forest, Shimla",
        district: "Shimla",
        pincode: "171007",
        latitude: "31.1207",
        longitude: "77.2291",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          garden: true,
        },
        rooms: [
          { roomType: "Standard", size: 180, count: 3 },
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "720.00",
        totalFee: "4720.00",
        status: "district_review",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 4. Himalayan Heritage Home - Gold - Approved
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Himalayan Heritage Home",
        category: "gold",
        totalRooms: 6,
        address: "The Mall Road, Near Christ Church, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1048",
        longitude: "77.1734",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          laundry: true,
          roomService: true,
        },
        rooms: [
          { roomType: "Standard", size: 220, count: 4 },
          { roomType: "Deluxe", size: 300, count: 2 },
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1440.00",
        totalFee: "9440.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        districtNotes: "Heritage property, well maintained",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(),
        stateNotes: "Approved for Gold category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 1}`,
        certificateIssuedDate: new Date(),
        certificateExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
      } as any, { trusted: true });

      // 5. Snowfall Cottage - Silver - Submitted
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Snowfall Cottage",
        category: "silver",
        totalRooms: 4,
        address: "Chharabra Village, Near Wildflower Hall, Shimla",
        district: "Shimla",
        pincode: "171012",
        latitude: "31.1207",
        longitude: "77.2659",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          mountainView: true,
          petFriendly: true,
        },
        rooms: [
          { roomType: "Standard", size: 190, count: 4 },
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "900.00",
        totalFee: "5900.00",
        status: "submitted",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 6. Devdar Manor - Diamond - Approved
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Devdar Manor",
        category: "diamond",
        totalRooms: 10,
        address: "Near Ridge, Scandal Point, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1041",
        longitude: "77.1732",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true,
          ac: true,
        },
        rooms: [
          { roomType: "Deluxe", size: 350, count: 6 },
          { roomType: "Suite", size: 500, count: 4 },
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2700.00",
        totalFee: "17700.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        districtNotes: "Premium property with excellent facilities",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        stateNotes: "Outstanding property. Highly recommended",
        certificateNumber: `HP-CERT-2025-${Date.now() + 2}`,
        certificateIssuedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        certificateExpiryDate: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 7. Maple Tree Homestay - Gold - Approved
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Maple Tree Homestay",
        category: "gold",
        totalRooms: 7,
        address: "Summer Hill, Near Himachal Pradesh University, Shimla",
        district: "Shimla",
        pincode: "171005",
        latitude: "31.0897",
        longitude: "77.1516",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          garden: true,
          mountainView: true,
        },
        rooms: [
          { roomType: "Standard", size: 240, count: 4 },
          { roomType: "Deluxe", size: 320, count: 3 },
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1620.00",
        totalFee: "10620.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        districtNotes: "Well-maintained property in scenic location",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        stateNotes: "Approved for Gold category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 3}`,
        certificateIssuedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        certificateExpiryDate: new Date(Date.now() + 358 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 8. Oak Ridge Villa - Silver - Approved
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Oak Ridge Villa",
        category: "silver",
        totalRooms: 5,
        address: "Sanjauli, Near State Museum, Shimla",
        district: "Shimla",
        pincode: "171006",
        latitude: "31.1125",
        longitude: "77.1914",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          tv: true,
          garden: true,
        },
        rooms: [
          { roomType: "Standard", size: 200, count: 5 },
        ],
        baseFee: "2000.00",
        perRoomFee: "600.00",
        gstAmount: "900.00",
        totalFee: "5900.00",
        status: "approved",
        currentStage: "final",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        districtNotes: "Clean and comfortable property",
        stateOfficerId: stateOfficer.id,
        stateReviewDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        stateNotes: "Approved for Silver category",
        certificateNumber: `HP-CERT-2025-${Date.now() + 4}`,
        certificateIssuedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        certificateExpiryDate: new Date(Date.now() + 359 * 24 * 60 * 60 * 1000),
        submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 9. Riverside Haven - Gold - District Review
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Riverside Haven",
        category: "gold",
        totalRooms: 6,
        address: "Tara Devi, Near Temple Road, Shimla",
        district: "Shimla",
        pincode: "171009",
        latitude: "31.0383",
        longitude: "77.1291",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          hotWater: true,
          restaurant: true,
          mountainView: true,
          tv: true,
        },
        rooms: [
          { roomType: "Standard", size: 250, count: 4 },
          { roomType: "Deluxe", size: 320, count: 2 },
        ],
        baseFee: "3000.00",
        perRoomFee: "800.00",
        gstAmount: "1440.00",
        totalFee: "9440.00",
        status: "district_review",
        currentStage: "district",
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      // 10. Alpine Chalet - Diamond - State Review
      await storage.createApplication({
        userId: owner.id,
        propertyName: "Alpine Chalet",
        category: "diamond",
        totalRooms: 9,
        address: "Lakkar Bazaar, Near Ice Skating Rink, Shimla",
        district: "Shimla",
        pincode: "171001",
        latitude: "31.1023",
        longitude: "77.1691",
        ownerName: "Property Owner Demo",
        ownerMobile: "9999999991",
        ownerEmail: "owner@hptourism.com",
        ownerAadhaar: "123456789001",
        amenities: {
          wifi: true,
          parking: true,
          restaurant: true,
          hotWater: true,
          mountainView: true,
          garden: true,
          tv: true,
          ac: true,
        },
        rooms: [
          { roomType: "Deluxe", size: 330, count: 5 },
          { roomType: "Suite", size: 480, count: 4 },
        ],
        baseFee: "5000.00",
        perRoomFee: "1000.00",
        gstAmount: "2520.00",
        totalFee: "16520.00",
        status: "state_review",
        currentStage: "state",
        districtOfficerId: districtOfficer.id,
        districtReviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        districtNotes: "Luxury property with all modern amenities. Forwarded to state",
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      } as any, { trusted: true });

      res.json({
        success: true,
        message: "✅ Database seeded successfully with 10 properties!",
        users: 3,
        properties: 10,
        approved: 5,
        inReview: 5,
        testAccounts: {
          propertyOwner: { mobile: "9999999991", password: "test123" },
          districtOfficer: { mobile: "9999999992", password: "test123" },
          stateOfficer: { mobile: "9999999993", password: "test123" }
        }
      });
    } catch (error: any) {
      routeLog.error("Seed error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to seed database",
        error: error.message
      });
    }
  });

  if (process.env.NODE_ENV === "development") {
    // Get storage stats
    app.get("/api/dev/stats", async (req, res) => {
      const stats = await storage.getStats();
      res.json(stats);
    });

    // Get all users (for testing)
    app.get("/api/dev/users", async (req, res) => {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    });

    // Clear all data
    app.post("/api/dev/clear-all", async (req, res) => {
      await storage.clearAll();
      res.json({ message: "All data cleared successfully" });
    });

    // Seed sample data (old endpoint for backward compatibility)
    app.post("/api/dev/seed", async (req, res) => {
      try {
        // Create sample users
        const owner = await storage.createUser({
          fullName: "Demo Property Owner",
          mobile: "9876543210",
          password: "test123",
          role: "property_owner",
          district: "Shimla",
        });

        const districtOfficer = await storage.createUser({
          fullName: "District Officer Shimla",
          mobile: "9876543211",
          password: "test123",
          role: "district_officer",
          district: "Shimla",
        });

        const stateOfficer = await storage.createUser({
          fullName: "State Tourism Officer",
          mobile: "9876543212",
          password: "test123",
          role: "state_officer",
        });

        // Create sample applications (trusted server code can set status)
        const app1 = await storage.createApplication({
          userId: owner.id,
          propertyName: "Mountain View Homestay",
          address: "Near Mall Road, Shimla",
          district: "Shimla",
          pincode: "171001",
          ownerName: owner.fullName,
          ownerMobile: owner.mobile,
          ownerEmail: `demo${Date.now()}@example.com`,
          ownerAadhaar: "123456789012",
          totalRooms: 5,
          category: "gold",
          baseFee: "3000",
          perRoomFee: "300",
          gstAmount: "1080",
          totalFee: "7080",
          status: "approved",
          submittedAt: new Date(),
          districtOfficerId: districtOfficer.id,
          districtReviewDate: new Date(),
          districtNotes: "Excellent property. All criteria met.",
          stateOfficerId: stateOfficer.id,
          stateReviewDate: new Date(),
          stateNotes: "Approved for tourism operations.",
          certificateNumber: "HP-HM-2025-001",
        } as any, { trusted: true });

        const app2 = await storage.createApplication({
          userId: owner.id,
          propertyName: "Valley Retreat",
          address: "Lower Bazaar, Shimla",
          district: "Shimla",
          pincode: "171003",
          ownerName: owner.fullName,
          ownerMobile: owner.mobile,
          ownerEmail: `demo${Date.now() + 1}@example.com`,
          ownerAadhaar: "123456789012",
          totalRooms: 3,
          category: "silver",
          baseFee: "2000",
          perRoomFee: "200",
          gstAmount: "792",
          totalFee: "3392",
          amenities: {
            wifi: true,
            parking: true,
            mountainView: true,
            hotWater: true,
          },
          status: "approved",
          submittedAt: new Date(),
          districtOfficerId: districtOfficer.id,
          districtReviewDate: new Date(),
          districtNotes: "Good property. Meets all requirements.",
          stateOfficerId: stateOfficer.id,
          stateReviewDate: new Date(),
          stateNotes: "Approved for tourism operations.",
          certificateNumber: "HP-HM-2025-002",
        } as any, { trusted: true });

        res.json({
          message: "Sample data created",
          users: 3,
          applications: 2,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to seed data" });
      }
    });
  }

  // HimKosh Payment Gateway Routes
  app.use("/api/himkosh", himkoshRoutes);
  routeLog.info('[himkosh] Payment gateway routes registered');

  // Kotak Mahindra (CCAvenue) Payment Gateway Routes (Phase 2)
  const { default: ccavenueRouter } = await import("./routes/ccavenue");
  app.use("/api/ccavenue", ccavenueRouter);
  routeLog.info('[ccavenue] Payment gateway routes registered');

  // Start production stats scraper (runs on boot and hourly)
  startScraperScheduler();
  routeLog.info('[scraper] Production stats scraper initialized');

  // Settings Routes
  app.use(createSettingsRouter());

  const httpServer = createServer(app);
  return httpServer;
}
