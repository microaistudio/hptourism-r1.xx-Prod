import express from "express";
import { eq } from "drizzle-orm";
import { requireRole } from "../core/middleware";
import { logger } from "../../logger";
import { db } from "../../db";
import { systemSettings, users, documents, payments, homestayApplications } from "@shared/schema";
import { getSystemSettingRecord } from "../../services/systemSettings";
import { trimOptionalString } from "../helpers/format";
import { CAPTCHA_SETTING_KEY, getCaptchaSetting, updateCaptchaSettingCache } from "../core/captcha";
import {
  getMultiServiceHubEnabled,
  setMultiServiceHubEnabled,
  MULTI_SERVICE_HUB_KEY
} from "../core/multi-service";

const log = logger.child({ module: "admin-settings-router" });

export function createAdminSettingsRouter() {
  const router = express.Router();

  router.get("/settings/payment/test-mode", async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord("payment_test_mode");
      const enabled = Boolean((existing?.settingValue as any)?.enabled);
      res.json({ enabled, source: existing ? "database" : "default" });
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch payment test mode");
      res.status(500).json({ message: "Failed to fetch payment test mode" });
    }
  });

  router.post("/settings/payment/test-mode/toggle", async (req, res) => {
    try {
      const enabled = Boolean(req.body?.enabled);
      const userId = req.session?.userId ?? null;

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, "payment_test_mode"))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: { enabled },
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, "payment_test_mode"))
          .returning();

        log.info({ userId, enabled }, "[admin] Test payment mode updated");
        res.json(updated);
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: "payment_test_mode",
            settingValue: { enabled },
            description: "When enabled, payment requests send ₹1 to gateway instead of actual amount (for testing)",
            category: "payment",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, enabled }, "[admin] Test payment mode created");
        res.json(created);
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to toggle test payment mode");
      res.status(500).json({ message: "Failed to toggle test payment mode" });
    }
  });

  router.get("/settings/auth/captcha", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const enabled = await getCaptchaSetting();
      res.json({ enabled });
    } catch (error) {
      log.error("[admin] Failed to fetch captcha setting:", error);
      res.status(500).json({ message: "Failed to fetch captcha setting" });
    }
  });

  router.post("/settings/auth/captcha/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }

      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(CAPTCHA_SETTING_KEY);
      if (existing) {
        await db
          .update(systemSettings)
          .set({
            settingValue: { enabled },
            description: "Toggle captcha requirement",
            category: "auth",
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, CAPTCHA_SETTING_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: CAPTCHA_SETTING_KEY,
          settingValue: { enabled },
          description: "Toggle captcha requirement",
          category: "auth",
          updatedBy: userId,
        });
      }

      await updateCaptchaSettingCache(enabled);
      res.json({ enabled });
    } catch (error) {
      log.error("[admin] Failed to toggle captcha:", error);
      res.status(500).json({ message: "Failed to toggle captcha" });
    }
  });

  // Multi-Service Hub Toggle
  // When enabled, users see service selection page after login
  // When disabled, users go directly to homestay dashboard
  router.get("/settings/portal/multi-service", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const enabled = await getMultiServiceHubEnabled();
      res.json({ enabled });
    } catch (error) {
      log.error("[admin] Failed to fetch multi-service hub setting:", error);
      res.status(500).json({ message: "Failed to fetch multi-service hub setting" });
    }
  });

  router.post("/settings/portal/multi-service/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }

      const userId = req.session.userId || undefined;
      await setMultiServiceHubEnabled(enabled, userId);
      res.json({ enabled });
    } catch (error) {
      log.error("[admin] Failed to toggle multi-service hub:", error);
      res.status(500).json({ message: "Failed to toggle multi-service hub" });
    }
  });

  router.get("/settings/super-console", requireRole("super_admin"), async (_req, res) => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, "admin_super_console_enabled"))
        .limit(1);

      let enabled = false;
      if (setting) {
        const value = setting.settingValue as any;
        if (typeof value === "boolean") {
          enabled = value;
        } else if (value && typeof value === "object" && "enabled" in value) {
          enabled = Boolean(value.enabled);
        } else if (typeof value === "string") {
          enabled = value === "true";
        }
      }

      res.json({ enabled, environment: process.env.NODE_ENV || "development" });
    } catch (error) {
      log.error("[admin] Failed to fetch super console setting:", error);
      res.status(500).json({ message: "Failed to fetch super console setting" });
    }
  });

  router.post("/settings/super-console/toggle", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled } = req.body;
      const userId = req.session.userId || null;

      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }

      const [existingSetting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, "admin_super_console_enabled"))
        .limit(1);

      if (existingSetting) {
        await db
          .update(systemSettings)
          .set({
            settingValue: { enabled },
            description: "Enable/disable super console",
            category: "admin",
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, "admin_super_console_enabled"));
      } else {
        await db.insert(systemSettings).values({
          settingKey: "admin_super_console_enabled",
          settingValue: { enabled },
          description: "Enable/disable super console",
          category: "admin",
          updatedBy: userId,
        });
      }

      res.json({ success: true, enabled });
    } catch (error) {
      log.error("[admin] Failed to toggle super console:", error);
      res.status(500).json({ message: "Failed to toggle super console" });
    }
  });

  router.get("/settings/:key", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const key = trimOptionalString(req.params.key);
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      const record = await getSystemSettingRecord(key);
      res.json(record ?? null);
    } catch (error) {
      log.error("[admin] Failed to fetch setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  router.put("/settings/:key", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const key = trimOptionalString(req.params.key);
      if (!key) {
        return res.status(400).json({ message: "Key is required" });
      }
      const userId = req.session.userId || null;
      const existing = await getSystemSettingRecord(key);
      const value = req.body?.value ?? req.body;

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: value,
            updatedAt: new Date(),
            updatedBy: userId,
          })
          .where(eq(systemSettings.settingKey, key))
          .returning();
        res.json(updated);
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: key,
            settingValue: value,
            updatedBy: userId,
          })
          .returning();
        res.json(created);
      }
    } catch (error) {
      log.error("[admin] Failed to update setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });


  // Payment Workflow Setting (upfront vs on_approval)
  // + Upfront Submit Mode (auto vs manual)
  const PAYMENT_WORKFLOW_SETTING_KEY = "payment_workflow";

  router.get("/settings/payment/workflow", requireRole("super_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(PAYMENT_WORKFLOW_SETTING_KEY);
      const settingValue = existing?.settingValue as any;
      const workflow = settingValue?.workflow ?? "on_approval"; // Default to legacy flow
      const upfrontSubmitMode = settingValue?.upfrontSubmitMode ?? "auto"; // Default to auto-submit
      res.json({ workflow, upfrontSubmitMode, source: existing ? "database" : "default" });
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch payment workflow setting");
      res.status(500).json({ message: "Failed to fetch payment workflow setting" });
    }
  });

  router.post("/settings/payment/workflow/toggle", requireRole("super_admin"), async (req, res) => {
    try {
      const workflow = req.body?.workflow;
      if (!workflow || !["upfront", "on_approval"].includes(workflow)) {
        return res.status(400).json({ message: "workflow must be 'upfront' or 'on_approval'" });
      }
      const userId = req.session?.userId ?? null;

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY))
        .limit(1);

      // Preserve existing upfrontSubmitMode when toggling workflow
      const currentValue = existing?.settingValue as any;
      const upfrontSubmitMode = currentValue?.upfrontSubmitMode ?? "auto";

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: { workflow, upfrontSubmitMode },
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY))
          .returning();

        log.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment workflow updated");
        res.json(updated);
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: PAYMENT_WORKFLOW_SETTING_KEY,
            settingValue: { workflow, upfrontSubmitMode },
            description: "Payment workflow: 'upfront' = pay before submission, 'on_approval' = pay after approval",
            category: "payment",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment workflow created");
        res.json(created);
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to toggle payment workflow");
      res.status(500).json({ message: "Failed to toggle payment workflow" });
    }
  });

  // Toggle upfront submit mode (auto vs manual) - only applies when workflow is "upfront"
  router.post("/settings/payment/workflow/submit-mode", requireRole("super_admin"), async (req, res) => {
    try {
      const upfrontSubmitMode = req.body?.upfrontSubmitMode;
      if (!upfrontSubmitMode || !["auto", "manual"].includes(upfrontSubmitMode)) {
        return res.status(400).json({ message: "upfrontSubmitMode must be 'auto' or 'manual'" });
      }
      const userId = req.session?.userId ?? null;

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY))
        .limit(1);

      // Preserve existing workflow when toggling submit mode
      const currentValue = existing?.settingValue as any;
      const workflow = currentValue?.workflow ?? "on_approval";

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: { workflow, upfrontSubmitMode },
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, PAYMENT_WORKFLOW_SETTING_KEY))
          .returning();

        log.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment submit mode updated");
        res.json(updated);
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: PAYMENT_WORKFLOW_SETTING_KEY,
            settingValue: { workflow, upfrontSubmitMode },
            description: "Payment workflow: 'upfront' = pay before submission, 'on_approval' = pay after approval",
            category: "payment",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, workflow, upfrontSubmitMode }, "[admin] Payment submit mode created");
        res.json(created);
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to toggle payment submit mode");
      res.status(500).json({ message: "Failed to toggle payment submit mode" });
    }
  });

  // Service Visibility Settings
  const SERVICE_VISIBILITY_KEY = "service_visibility_config";
  const INSPECTION_CONFIG_KEY = "inspection_config";

  router.get("/settings/portal/services", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const [visibilitySetting, inspectionSetting] = await Promise.all([
        getSystemSettingRecord(SERVICE_VISIBILITY_KEY),
        getSystemSettingRecord(INSPECTION_CONFIG_KEY)
      ]);

      res.json({
        visibility: visibilitySetting?.settingValue ?? {
          homestay: true, // Always active
          hotels: false,
          guest_houses: false,
          travel_agencies: false,
          adventure_tourism: true, // Currently active in code
          transport: false,
          restaurants: false,
          winter_sports: false
        },
        inspection: inspectionSetting?.settingValue ?? {
          optionalKinds: [] // e.g. ['delete_rooms', 'cancel_certificate']
        }
      });
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch service settings");
      res.status(500).json({ message: "Failed to fetch service settings" });
    }
  });

  router.post("/settings/portal/services/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { serviceId, enabled } = req.body;
      const userId = req.session?.userId ?? null;

      if (!serviceId) return res.status(400).json({ message: "Service ID required" });

      const setting = await getSystemSettingRecord(SERVICE_VISIBILITY_KEY);
      const currentConfig = (setting?.settingValue as Record<string, boolean>) ?? {
        homestay: true,
        hotels: false,
        guest_houses: false,
        travel_agencies: false,
        adventure_tourism: true,
        transport: false,
        restaurants: false,
        winter_sports: false
      };

      const newConfig = { ...currentConfig, [serviceId]: enabled };

      if (setting) {
        await db.update(systemSettings)
          .set({ settingValue: newConfig, updatedBy: userId, updatedAt: new Date() })
          .where(eq(systemSettings.settingKey, SERVICE_VISIBILITY_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: SERVICE_VISIBILITY_KEY,
          settingValue: newConfig,
          description: "Controls which services are visible on the portal",
          category: "portal",
          updatedBy: userId
        });
      }

      res.json(newConfig);
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to toggle service visibility");
      res.status(500).json({ message: "Failed to update service visibility" });
    }
  });

  router.post("/settings/inspection/toggle", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const { applicationKind, optional } = req.body;
      const userId = req.session?.userId ?? null;

      if (!applicationKind) return res.status(400).json({ message: "Application Kind required" });

      const setting = await getSystemSettingRecord(INSPECTION_CONFIG_KEY);
      const currentConfig = (setting?.settingValue as { optionalKinds: string[] }) ?? { optionalKinds: [] };

      const currentSet = new Set(currentConfig.optionalKinds || []);
      if (optional) {
        currentSet.add(applicationKind);
      } else {
        currentSet.delete(applicationKind);
      }

      const newConfig = { optionalKinds: Array.from(currentSet) };

      if (setting) {
        await db.update(systemSettings)
          .set({ settingValue: newConfig, updatedBy: userId, updatedAt: new Date() })
          .where(eq(systemSettings.settingKey, INSPECTION_CONFIG_KEY));
      } else {
        await db.insert(systemSettings).values({
          settingKey: INSPECTION_CONFIG_KEY,
          settingValue: newConfig,
          description: "Configuration for inspection workflows (e.g. optional inspections)",
          category: "workflow",
          updatedBy: userId
        });
      }

      res.json(newConfig);
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to toggle inspection config");
      res.status(500).json({ message: "Failed to update inspection config" });
    }
  });

  // Default Payment Gateway Setting (himkosh vs ccavenue)
  const DEFAULT_PAYMENT_GATEWAY_KEY = "default_payment_gateway";

  router.get("/settings/payment/gateway", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(DEFAULT_PAYMENT_GATEWAY_KEY);
      const gateway = (existing?.settingValue as any)?.gateway ?? "himkosh"; // Default to HimKosh
      res.json({
        gateway,
        source: existing ? "database" : "default",
        available: ["himkosh", "ccavenue"]
      });
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch default payment gateway");
      res.status(500).json({ message: "Failed to fetch default payment gateway" });
    }
  });

  router.post("/settings/payment/gateway", requireRole("admin", "super_admin", "system_admin"), async (req, res) => {
    try {
      const gateway = req.body?.gateway;
      if (!gateway || !["himkosh", "ccavenue"].includes(gateway)) {
        return res.status(400).json({ message: "gateway must be 'himkosh' or 'ccavenue'" });
      }
      const userId = req.session?.userId ?? null;

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, DEFAULT_PAYMENT_GATEWAY_KEY))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: { gateway },
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, DEFAULT_PAYMENT_GATEWAY_KEY))
          .returning();

        log.info({ userId, gateway }, "[admin] Default payment gateway updated");
        res.json(updated);
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: DEFAULT_PAYMENT_GATEWAY_KEY,
            settingValue: { gateway },
            description: "Default payment gateway: 'himkosh' or 'ccavenue' (Kotak Mahindra)",
            category: "payment",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, gateway }, "[admin] Default payment gateway created");
        res.json(created);
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to update default payment gateway");
      res.status(500).json({ message: "Failed to update default payment gateway" });
    }
  });

  // Rate Limit Configuration
  const RATE_LIMIT_SETTING_KEY = "rate_limit_configuration";

  // Default rate limit config (matches .env defaults)
  const DEFAULT_RATE_LIMIT_CONFIG = {
    enabled: true,
    global: { maxRequests: 1000, windowMinutes: 15 },
    auth: { maxRequests: 20, windowMinutes: 10 },
    upload: { maxRequests: 100, windowMinutes: 10 }
  };

  router.get("/settings/security/rate-limits", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const existing = await getSystemSettingRecord(RATE_LIMIT_SETTING_KEY);
      if (existing?.settingValue) {
        res.json({
          ...DEFAULT_RATE_LIMIT_CONFIG,
          ...(existing.settingValue as object),
          source: "database"
        });
      } else {
        res.json({ ...DEFAULT_RATE_LIMIT_CONFIG, source: "default" });
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch rate limit settings");
      res.status(500).json({ message: "Failed to fetch rate limit settings" });
    }
  });

  router.post("/settings/security/rate-limits", requireRole("super_admin"), async (req, res) => {
    try {
      const { enabled, global, auth, upload } = req.body;
      const userId = req.session?.userId ?? null;

      // Validate input
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }

      const newConfig = {
        enabled,
        global: {
          maxRequests: Math.max(1, Math.min(10000, parseInt(global?.maxRequests) || 1000)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(global?.windowMinutes) || 15))
        },
        auth: {
          maxRequests: Math.max(1, Math.min(100, parseInt(auth?.maxRequests) || 20)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(auth?.windowMinutes) || 10))
        },
        upload: {
          maxRequests: Math.max(1, Math.min(500, parseInt(upload?.maxRequests) || 100)),
          windowMinutes: Math.max(1, Math.min(60, parseInt(upload?.windowMinutes) || 10))
        }
      };

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: newConfig,
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, RATE_LIMIT_SETTING_KEY))
          .returning();

        log.info({ userId, config: newConfig }, "[admin] Rate limit configuration updated");
        res.json({ ...newConfig, source: "database" });
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: RATE_LIMIT_SETTING_KEY,
            settingValue: newConfig,
            description: "Rate limit configuration for API endpoints",
            category: "security",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, config: newConfig }, "[admin] Rate limit configuration created");
        res.json({ ...newConfig, source: "database" });
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to update rate limit settings");
      res.status(500).json({ message: "Failed to update rate limit settings" });
    }
  });

  // Max Revert Count Configuration
  const MAX_REVERT_COUNT_SETTING_KEY = "max_correction_attempts";

  router.get("/settings/workflow/max-reverts", requireRole("admin", "super_admin", "system_admin"), async (_req, res) => {
    try {
      const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
        .limit(1);

      const value = setting ? Number(setting.settingValue) : 1;
      res.json({ maxReverts: value, source: setting ? "database" : "default" });
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to fetch max revert count");
      res.status(500).json({ message: "Failed to fetch max revert count" });
    }
  });

  router.post("/settings/workflow/max-reverts", requireRole("super_admin"), async (req, res) => {
    try {
      const { maxReverts } = req.body;
      const userId = req.session?.userId ?? null;

      if (typeof maxReverts !== "number" || maxReverts < 1) {
        return res.status(400).json({ message: "maxReverts must be a number >= 1" });
      }

      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
        .limit(1);

      if (existing) {
        const [updated] = await db
          .update(systemSettings)
          .set({
            settingValue: maxReverts,
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
          .returning();

        log.info({ userId, maxReverts }, "[admin] Max revert count updated");
        res.json({ maxReverts: Number(updated.settingValue) });
      } else {
        const [created] = await db
          .insert(systemSettings)
          .values({
            settingKey: MAX_REVERT_COUNT_SETTING_KEY,
            settingValue: maxReverts,
            description: "Maximum number of times an application can be sent back for corrections",
            category: "workflow",
            updatedBy: userId,
          })
          .returning();

        log.info({ userId, maxReverts }, "[admin] Max revert count created");
        res.json({ maxReverts: Number(created.settingValue) });
      }
    } catch (error) {
      log.error({ err: error }, "[admin] Failed to update max revert count");
      res.status(500).json({ message: "Failed to update max revert count" });
    }
  });

  return router;
}
