import { Router } from "express";
import { db } from "../db";
import { systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
    WOMAN_DISCOUNT_MODE_SETTING_KEY,
    DEFAULT_WOMAN_DISCOUNT_MODE,
    normalizeWomanDiscountMode,
    SINGLE_SESSION_SETTING_KEY,
    normalizeBooleanSetting,
    MAINTENANCE_MODE_SETTING_KEY,
    normalizeMaintenanceModeSetting,
    ENABLE_LEGACY_REGISTRATION_SETTING_KEY,
    PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
    normalizePaymentPipelinePauseSetting,
} from "@shared/appSettings";
import { requireRole } from "./core/middleware";

export function createSettingsRouter() {
    const router = Router();

    // Get Woman Discount Mode
    router.get("/api/settings/woman-discount-mode", async (req, res) => {
        try {
            const setting = await db.query.systemSettings.findFirst({
                where: eq(systemSettings.settingKey, WOMAN_DISCOUNT_MODE_SETTING_KEY)
            });

            const mode = normalizeWomanDiscountMode(setting?.settingValue);
            res.json({ mode });
        } catch (error) {
            console.error("Failed to fetch woman discount setting:", error);
            res.json({ mode: DEFAULT_WOMAN_DISCOUNT_MODE });
        }
    });

    // Update Woman Discount Mode (Admin Only)
    // using 'admin' role - make sure 'admin' is the correct role identifier
    router.post("/api/settings/woman-discount-mode", requireRole("admin"), async (req, res) => {
        // console.log("[DEBUG] POST /api/settings/woman-discount-mode called");
        // console.log("[DEBUG] Request body:", req.body);
        try {
            const { mode } = req.body;
            const validMode = normalizeWomanDiscountMode(mode);
            // console.log("[DEBUG] Normalized mode:", validMode);

            await db.insert(systemSettings).values({
                settingKey: WOMAN_DISCOUNT_MODE_SETTING_KEY,
                settingValue: { mode: validMode },
                description: "Configuration for woman owner discount calculation (Additive vs Sequential)",
                updatedBy: req.user?.id
            }).onConflictDoUpdate({
                target: systemSettings.settingKey,
                set: {
                    settingValue: { mode: validMode },
                    updatedBy: req.user?.id,
                    updatedAt: new Date()
                }
            });

            // console.log("[DEBUG] Settings saved to DB");

            res.json({ success: true, mode: validMode });
        } catch (error) {
            console.error("Failed to update woman discount setting:", error);
            res.status(500).json({ error: "Failed to update setting" });
        }
    });

    // Get Enforce Single Session setting
    router.get("/api/settings/enforce-single-session", async (req, res) => {
        try {
            const setting = await db.query.systemSettings.findFirst({
                where: eq(systemSettings.settingKey, SINGLE_SESSION_SETTING_KEY)
            });

            const enabled = normalizeBooleanSetting(setting?.settingValue, false);
            res.json({ enabled });
        } catch (error) {
            console.error("Failed to fetch single session setting:", error);
            res.json({ enabled: false });
        }
    });

    // Update Enforce Single Session (Super Admin Only)
    router.post("/api/settings/enforce-single-session", requireRole("super_admin"), async (req, res) => {
        try {
            const { enabled } = req.body;
            const boolValue = enabled === true || enabled === "true";

            await db.insert(systemSettings).values({
                settingKey: SINGLE_SESSION_SETTING_KEY,
                settingValue: boolValue,
                description: "Enforce single concurrent session per user (kicks old sessions on new login)",
                updatedBy: req.user?.id
            }).onConflictDoUpdate({
                target: systemSettings.settingKey,
                set: {
                    settingValue: boolValue,
                    updatedBy: req.user?.id,
                    updatedAt: new Date()
                }
            });

            res.json({ success: true, enabled: boolValue });
        } catch (error) {
            console.error("Failed to update single session setting:", error);
            res.status(500).json({ error: "Failed to update setting" });
        }
    });

    // Get Maintenance Mode setting
    router.get("/api/settings/maintenance-mode", async (req, res) => {
        try {
            const setting = await db.query.systemSettings.findFirst({
                where: eq(systemSettings.settingKey, MAINTENANCE_MODE_SETTING_KEY)
            });

            const config = normalizeMaintenanceModeSetting(setting?.settingValue);
            res.json(config);
        } catch (error) {
            console.error("Failed to fetch maintenance mode setting:", error);
            res.status(500).json({ error: "Failed to fetch setting" });
        }
    });

    // Update Maintenance Mode (Admin or Super Admin)
    router.post("/api/settings/maintenance-mode", requireRole("admin", "super_admin"), async (req, res) => {
        try {
            const { enabled, accessKey, messageType, customMessage } = req.body;
            const validConfig = normalizeMaintenanceModeSetting({ enabled, accessKey, messageType, customMessage });

            await db.insert(systemSettings).values({
                settingKey: MAINTENANCE_MODE_SETTING_KEY,
                settingValue: validConfig,
                description: "Global Maintenance Mode Configuration",
                updatedBy: req.user?.id
            }).onConflictDoUpdate({
                target: systemSettings.settingKey,
                set: {
                    settingValue: validConfig,
                    updatedBy: req.user?.id,
                    updatedAt: new Date()
                }
            });

            res.json({ success: true, config: validConfig });
        } catch (error) {
            console.error("Failed to update maintenance mode setting:", error);
            res.status(500).json({ error: "Failed to update setting" });
        }
    });

    // Get Enable Legacy Registrations setting
    router.get("/api/settings/enable-legacy-registrations", async (req, res) => {
        try {
            const setting = await db.query.systemSettings.findFirst({
                where: eq(systemSettings.settingKey, ENABLE_LEGACY_REGISTRATION_SETTING_KEY)
            });

            const enabled = normalizeBooleanSetting(setting?.settingValue, true); // Default true
            res.json({ enabled });
        } catch (error) {
            console.error("Failed to fetch legacy registration setting:", error);
            res.json({ enabled: true });
        }
    });

    // Update Enable Legacy Registrations (Admin or Super Admin)
    router.post("/api/settings/enable-legacy-registrations", requireRole("admin", "super_admin"), async (req, res) => {
        try {
            const { enabled } = req.body;
            const boolValue = enabled === true || enabled === "true";

            await db.insert(systemSettings).values({
                settingKey: ENABLE_LEGACY_REGISTRATION_SETTING_KEY,
                settingValue: boolValue,
                description: "Allow existing owners to register (Legacy/RC flow)",
                updatedBy: req.user?.id
            }).onConflictDoUpdate({
                target: systemSettings.settingKey,
                set: {
                    settingValue: boolValue,
                    updatedBy: req.user?.id,
                    updatedAt: new Date()
                }
            });

            res.json({ success: true, enabled: boolValue });
        } catch (error) {
            console.error("Failed to update legacy registration setting:", error);
            res.status(500).json({ error: "Failed to update setting" });
        }
    });

    // Get Payment Pipeline Pause setting
    router.get("/api/settings/payment-pipeline-pause", async (req, res) => {
        try {
            const setting = await db.query.systemSettings.findFirst({
                where: eq(systemSettings.settingKey, PAYMENT_PIPELINE_PAUSE_SETTING_KEY)
            });

            const config = normalizePaymentPipelinePauseSetting(setting?.settingValue);
            res.json(config);
        } catch (error) {
            console.error("Failed to fetch payment pipeline pause setting:", error);
            res.status(500).json({ error: "Failed to fetch setting" });
        }
    });

    // Update Payment Pipeline Pause (Super Admin Only - critical operation)
    router.post("/api/settings/payment-pipeline-pause", requireRole("super_admin"), async (req, res) => {
        try {
            const { enabled, messageType, customMessage } = req.body;
            const userId = req.user?.id || null;

            // Build the config with audit info
            const validConfig = normalizePaymentPipelinePauseSetting({
                enabled,
                messageType,
                customMessage,
                pausedAt: enabled ? new Date().toISOString() : null,
                pausedBy: enabled ? userId : null,
            });

            await db.insert(systemSettings).values({
                settingKey: PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
                settingValue: validConfig,
                description: "Payment Pipeline Pause Configuration",
                updatedBy: userId
            }).onConflictDoUpdate({
                target: systemSettings.settingKey,
                set: {
                    settingValue: validConfig,
                    updatedBy: userId,
                    updatedAt: new Date()
                }
            });

            console.log(`[CRITICAL] Payment Pipeline Pause updated: enabled=${enabled} by user=${userId}`);
            res.json({ success: true, config: validConfig });
        } catch (error) {
            console.error("Failed to update payment pipeline pause setting:", error);
            res.status(500).json({ error: "Failed to update setting" });
        }
    });

    return router;
}
