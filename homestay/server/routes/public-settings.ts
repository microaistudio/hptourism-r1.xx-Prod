import express from "express";
import { getSystemSettingRecord } from "../services/systemSettings";
import {
    ENABLE_LEGACY_REGISTRATION_SETTING_KEY,
    PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
    normalizePaymentPipelinePauseSetting,
    getPaymentPauseMessage
} from "@shared/appSettings";
import { logger } from "../logger";

const log = logger.child({ module: "public-settings-router" });

export function createPublicSettingsRouter() {
    const router = express.Router();

    // GET /api/settings/public
    // Returns configuration that the frontend needs before generic auth actions or for general UI
    router.get("/public", async (req, res) => {
        try {
            const [visibilitySetting, inspectionSetting, maintenanceSetting, registrationSetting, paymentPauseSetting] = await Promise.all([
                getSystemSettingRecord("service_visibility_config"),
                getSystemSettingRecord("inspection_config"),
                getSystemSettingRecord("maintenance_mode_config"), // MAINTENANCE_MODE_SETTING_KEY
                getSystemSettingRecord(ENABLE_LEGACY_REGISTRATION_SETTING_KEY),
                getSystemSettingRecord(PAYMENT_PIPELINE_PAUSE_SETTING_KEY)
            ]);

            const visibility = (visibilitySetting?.settingValue as Record<string, boolean>) ?? {
                homestay: true,
                hotels: false,
                guest_houses: false,
                travel_agencies: false,
                adventure_tourism: true,
                transport: false,
                restaurants: false,
                winter_sports: false
            };

            const inspection = (inspectionSetting?.settingValue as { optionalKinds: string[] }) ?? {
                optionalKinds: []
            };

            // Safe default: Disabled
            const maintenance = (maintenanceSetting?.settingValue as { enabled: boolean, accessKey: string }) ?? {
                enabled: false,
                accessKey: "launch2026"
            };

            // Payment Pipeline Pause
            const paymentPause = normalizePaymentPipelinePauseSetting(paymentPauseSetting?.settingValue);

            // Check for bypass
            const bypassKey = req.query.access_key as string;
            // Allow bypass if key matches (even if maintenance is enabled)
            const isBypassed = maintenance.enabled && bypassKey && bypassKey === maintenance.accessKey;

            res.json({
                serviceVisibility: visibility,
                inspectionConfig: inspection,
                maintenanceMode: {
                    enabled: isBypassed ? false : !!maintenance.enabled
                },
                enableLegacyRegistrations: registrationSetting?.settingValue !== false, // Default true if null/undefined
                paymentPipelinePause: {
                    enabled: paymentPause.enabled,
                    message: paymentPause.enabled ? getPaymentPauseMessage(paymentPause) : null
                }
            });
        } catch (error) {
            log.error({ err: error }, "Failed to fetch public settings");
            res.status(500).json({ message: "Failed to fetch public settings" });
        }
    });

    return router;
}
