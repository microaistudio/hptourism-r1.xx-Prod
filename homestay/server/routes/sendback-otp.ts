/**
 * OTP verification routes for DA send-back actions
 * Requires DTDO approval via OTP before DA can send back applications
 */
import express from "express";
import { z } from "zod";
import { storage } from "../storage";
import { requireAuth, requireRole } from "./core/middleware";
import { sendSms } from "../services/sms";
import { createLogger } from "../logger";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { lookupDtdoByDistrictLabel } from "@shared/districtStaffManifest";
import { getProcessingOffice } from "@shared/districtRouting";
import {
    MAX_REVERT_COUNT_SETTING_KEY,
    DEFAULT_MAX_REVERT_COUNT,
} from "@shared/appSettings";
import { systemSettings } from "@shared/schema";

const log = createLogger("sendback-otp");

// In-memory OTP store (for production, use Redis)
const otpStore = new Map<string, { otp: string; dtdoPhone: string; expiresAt: number; applicationId: string }>();

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const requestOtpSchema = z.object({
    applicationId: z.string().uuid(),
    reason: z.string().min(10, "Reason must be at least 10 characters"),
});

const verifyOtpSchema = z.object({
    applicationId: z.string().uuid(),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export function createSendbackOtpRouter() {
    const router = express.Router();

    /**
     * Request OTP for send-back action
     * DA initiates, OTP is sent to DTDO's registered mobile
     */
    router.post("/request", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
        try {
            const { applicationId, reason } = requestOtpSchema.parse(req.body);

            // Get application
            const application = await storage.getApplication(applicationId);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            // Fetch max revert count
            const [maxRevertSetting] = await db
                .select()
                .from(systemSettings)
                .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
                .limit(1);
            const maxReverts = maxRevertSetting ? Number(maxRevertSetting.settingValue) : DEFAULT_MAX_REVERT_COUNT;

            // Check revert count
            if ((application.revertCount ?? 0) >= maxReverts) {
                return res.status(400).json({
                    message: `Application has already been sent back ${maxReverts} time(s). Another send-back will result in automatic rejection.`,
                    willAutoReject: true,
                    revertCount: application.revertCount,
                });
            }

            // Find DTDO for this district from Database (to support updated profiles)
            // Use getProcessingOffice() to resolve merged districts:
            // - Bilaspur applications → Mandi DTDO
            // - Una applications → Hamirpur DTDO

            const processingDistrict = getProcessingOffice(application.district, application.tehsil);
            if (!processingDistrict) {
                return res.status(400).json({ message: `Cannot determine processing office for district: ${application.district}` });
            }

            log.info({
                applicationDistrict: application.district,
                processingDistrict
            }, "Resolved processing office for OTP");

            // Look up DTDO user in the processing district
            const [dtdoUser] = await db.select()
                .from(users)
                .where(and(
                    eq(users.role, 'district_tourism_officer'),
                    ilike(users.district, `%${processingDistrict}%`),
                    eq(users.isActive, true)
                ))
                .orderBy(desc(users.updatedAt))
                .limit(1);

            let dtdoMobile = dtdoUser?.mobile;

            // If not found, try the manifest lookup as fallback (using processing district)
            if (!dtdoMobile) {
                const manifestDtdo = lookupDtdoByDistrictLabel(processingDistrict);
                if (manifestDtdo) {
                    dtdoMobile = manifestDtdo.mobile;
                    log.info({ processingDistrict, manifestMobile: dtdoMobile }, "DTDO not found in DB, using manifest fallback");
                }
            }

            if (!dtdoMobile) {
                return res.status(400).json({ message: `No DTDO found for processing office: ${processingDistrict}` });
            }

            // Generate OTP
            const otp = generateOtp();
            const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

            // Store OTP
            otpStore.set(applicationId, {
                otp,
                dtdoPhone: dtdoMobile,
                expiresAt,
                applicationId,
            });

            // Send SMS to DTDO
            // Send SMS to DTDO
            // MUST match DLT Template ID configured in system settings
            // Template: "{{OTP}} is your OTP for Himachal Tourism e-services portal login. - HP Tourism E-services"
            const smsMessage = `${otp} is your OTP for Himachal Tourism e-services portal login. - HP Tourism E-services`;

            try {
                await sendSms(dtdoMobile, smsMessage);
                log.info({ applicationId, dtdoPhone: dtdoMobile.slice(-4) }, "OTP sent to DTDO");
            } catch (smsError) {
                log.error({ err: smsError }, "Failed to send OTP SMS");
                // For development, log the OTP
                log.warn({ otp }, "DEV: OTP for testing");
            }

            res.json({
                message: "OTP sent to DTDO's registered mobile",
                expiresIn: 300, // seconds
                dtdoPhoneLast4: dtdoMobile.slice(-4),
                maskedMobile: dtdoMobile.length > 4 ? "xxxxxx" + dtdoMobile.slice(-4) : dtdoMobile,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors[0].message });
            }
            log.error({ err: error }, "Failed to request OTP");
            res.status(500).json({ message: "Failed to request OTP" });
        }
    });

    /**
     * Verify OTP and complete send-back action
     */
    router.post("/verify", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
        try {
            const { applicationId, otp } = verifyOtpSchema.parse(req.body);

            // Check stored OTP
            const stored = otpStore.get(applicationId);
            if (!stored) {
                return res.status(400).json({ message: "No OTP request found. Please request a new OTP." });
            }

            if (Date.now() > stored.expiresAt) {
                otpStore.delete(applicationId);
                return res.status(400).json({ message: "OTP has expired. Please request a new one." });
            }

            if (stored.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
            }

            // OTP verified successfully
            otpStore.delete(applicationId);

            res.json({
                verified: true,
                message: "OTP verified successfully. You can now proceed with send-back.",
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors[0].message });
            }
            log.error({ err: error }, "Failed to verify OTP");
            res.status(500).json({ message: "Failed to verify OTP" });
        }
    });

    /**
     * Check if auto-reject will happen
     */
    router.get("/check/:applicationId", requireAuth, requireRole("dealing_assistant"), async (req, res) => {
        try {
            const { applicationId } = req.params;

            const application = await storage.getApplication(applicationId);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            // Fetch max revert count
            const [maxRevertSetting] = await db
                .select()
                .from(systemSettings)
                .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
                .limit(1);
            const maxReverts = maxRevertSetting ? Number(maxRevertSetting.settingValue) : DEFAULT_MAX_REVERT_COUNT;

            const revertCount = application.revertCount ?? 0;
            const willAutoReject = revertCount >= maxReverts;

            res.json({
                revertCount,
                willAutoReject,
                message: willAutoReject
                    ? `This application has already been sent back ${revertCount} times. Another send-back will automatically REJECT the application.`
                    : "This is a valid send-back request. OTP verification from DTDO is required.",
            });
        } catch (error) {
            log.error({ err: error }, "Failed to check revert status");
            res.status(500).json({ message: "Failed to check revert status" });
        }
    });

    return router;
}
