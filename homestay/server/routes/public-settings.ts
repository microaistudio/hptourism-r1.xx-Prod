import express from "express";
import { getSystemSettingRecord } from "../services/systemSettings";
import {
    ENABLE_LEGACY_REGISTRATION_SETTING_KEY,
    PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
    SHOW_INCOMPLETE_APPLICATIONS_SETTING_KEY,
    FORM_TIME_THRESHOLD_SETTING_KEY,
    DEFAULT_FORM_TIME_THRESHOLD_MINUTES,
    normalizePaymentPipelinePauseSetting,
    getPaymentPauseMessage,
    normalizeMaintenanceModeSetting,
    getMaintenanceMessage,
    normalizeBooleanSetting,
} from "@shared/appSettings";
import { logger } from "../logger";

const log = logger.child({ module: "public-settings-router" });

export function createPublicSettingsRouter() {
    const router = express.Router();

    // GET /api/settings/public
    // Returns configuration that the frontend needs before generic auth actions or for general UI
    router.get("/public", async (req, res) => {
        try {
            const [visibilitySetting, inspectionSetting, maintenanceSetting, registrationSetting, paymentPauseSetting, incompleteAppsSetting, formThresholdSetting] = await Promise.all([
                getSystemSettingRecord("service_visibility_config"),
                getSystemSettingRecord("inspection_config"),
                getSystemSettingRecord("maintenance_mode_config"),
                getSystemSettingRecord(ENABLE_LEGACY_REGISTRATION_SETTING_KEY),
                getSystemSettingRecord(PAYMENT_PIPELINE_PAUSE_SETTING_KEY),
                getSystemSettingRecord(SHOW_INCOMPLETE_APPLICATIONS_SETTING_KEY),
                getSystemSettingRecord(FORM_TIME_THRESHOLD_SETTING_KEY)
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

            // Safe default: Disabled — use full normalizer for new fields
            const maintenance = normalizeMaintenanceModeSetting(maintenanceSetting?.settingValue);

            // Payment Pipeline Pause
            const paymentPause = normalizePaymentPipelinePauseSetting(paymentPauseSetting?.settingValue);

            // Check for bypass
            const bypassKey = req.query.access_key as string;
            // Allow bypass if key matches (even if maintenance is enabled)
            const isBypassed = maintenance.enabled && bypassKey && bypassKey === maintenance.accessKey;

            const maintenanceEnabled = isBypassed ? false : !!maintenance.enabled;

            res.json({
                serviceVisibility: visibility,
                inspectionConfig: inspection,
                maintenanceMode: {
                    enabled: maintenanceEnabled,
                    message: maintenanceEnabled ? getMaintenanceMessage(maintenance) : null,
                    // Individually controlled: ETA and downtime visibility
                    ...(maintenanceEnabled && maintenance.showEtaToPublic && maintenance.estimatedRestoreAt ? {
                        estimatedRestoreAt: maintenance.estimatedRestoreAt,
                    } : {}),
                    ...(maintenanceEnabled && maintenance.showDowntimeToPublic && maintenance.startedAt ? {
                        startedAt: maintenance.startedAt,
                    } : {}),
                },
                enableLegacyRegistrations: registrationSetting?.settingValue !== false, // Default true if null/undefined
                paymentPipelinePause: {
                    enabled: paymentPause.enabled,
                    message: paymentPause.enabled ? getPaymentPauseMessage(paymentPause) : null,
                    // Individually controlled: ETA and downtime visibility
                    ...(paymentPause.enabled && paymentPause.showEtaToPublic && paymentPause.estimatedRestoreAt ? {
                        estimatedRestoreAt: paymentPause.estimatedRestoreAt,
                    } : {}),
                    ...(paymentPause.enabled && paymentPause.showDowntimeToPublic && paymentPause.pausedAt ? {
                        startedAt: paymentPause.pausedAt,
                    } : {}),
                },
                showIncompleteApplications: normalizeBooleanSetting(incompleteAppsSetting?.settingValue, false),
                formTimeThresholdMinutes: (() => {
                    const raw = formThresholdSetting?.settingValue;
                    if (typeof raw === 'number' && raw > 0) return raw;
                    if (typeof raw === 'object' && raw !== null && 'minutes' in (raw as any)) {
                        const m = (raw as any).minutes;
                        if (typeof m === 'number' && m > 0) return m;
                    }
                    if (typeof raw === 'string') {
                        const parsed = parseInt(raw, 10);
                        if (!isNaN(parsed) && parsed > 0) return parsed;
                    }
                    return DEFAULT_FORM_TIME_THRESHOLD_MINUTES;
                })(),
            });
        } catch (error) {
            log.error({ err: error }, "Failed to fetch public settings");
            res.status(500).json({ message: "Failed to fetch public settings" });
        }
    });

    return router;
}
