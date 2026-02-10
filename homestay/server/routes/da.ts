import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { logger } from "../logger";
import { logApplicationAction } from "../audit";
import { queueNotification } from "../services/notifications";
import { requireRole } from "./core/middleware";
import { buildDistrictWhereClause } from "./helpers/district";
import { getLegacyForwardEnabled } from "./helpers/legacy";
import { fetchApplicationWithOwner } from "./helpers/application";
import {
    homestayApplications,
    applicationActions,
    documents,
    systemSettings,
    type HomestayApplication,
    type User,
} from "@shared/schema";
import {
    DA_SEND_BACK_SETTING_KEY,
    normalizeBooleanSetting,
    MAX_REVERT_COUNT_SETTING_KEY,
    DEFAULT_MAX_REVERT_COUNT,
} from "@shared/appSettings";
import { isLegacyApplication as isLegacyApplicationRecord } from "@shared/legacy";
import { desc, eq, and, inArray, or, ne, ilike, isNull } from "drizzle-orm";

const routeLog = logger.child({ module: "routes/da" });

export function registerDaRoutes(router: Router) {
    // Get incomplete applications for DA (draft status)
    router.get("/api/da/applications/incomplete", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const userId = req.session.userId!;
            const user = await storage.getUser(userId);

            if (!user || !user.district) {
                return res.status(400).json({ message: "DA must be assigned to a district" });
            }

            // Custom Routing Logic for Group B (Merged) and Group C (Split) Pipelines
            let districtCondition;
            const districtLower = user.district.toLowerCase();

            if (districtLower.includes('pangi')) {
                // Group C: Pangi Pipeline (Chamba district, Pangi tehsil)
                districtCondition = and(
                    ilike(homestayApplications.district, '%chamba%'),
                    ilike(homestayApplications.tehsil, '%pangi%')
                );
            } else if (districtLower.includes('kaza')) {
                // Group C: Kaza Pipeline (Lahaul-Spiti district, Spiti tehsil)
                // Note: We check 'kaza' specifically. 'spiti' matches 'Lahaul and Spiti' district name.
                districtCondition = and(
                    ilike(homestayApplications.district, '%lahaul%'),
                    ilike(homestayApplications.tehsil, '%spiti%')
                );
            } else if (districtLower.includes('lahaul')) {
                // Group C: Lahaul Main Pipeline (Lahaul-Spiti district EXCLUDING Spiti)
                districtCondition = and(
                    ilike(homestayApplications.district, '%lahaul%'),
                    or(not(ilike(homestayApplications.tehsil, '%spiti%')), isNull(homestayApplications.tehsil)) // Exclude ANY match for Spiti
                );
            } else if (districtLower.includes('chamba')) {
                // Group C: Chamba Main Pipeline (Chamba district EXCLUDING Pangi)
                districtCondition = and(
                    ilike(homestayApplications.district, '%chamba%'),
                    or(not(ilike(homestayApplications.tehsil, '%pangi%')), isNull(homestayApplications.tehsil)) // Exclude ANY match for Pangi
                );
            } else if (districtLower.includes('hamirpur')) {
                // Group B: Hamirpur Pipeline (Hamirpur + Una)
                districtCondition = or(
                    ilike(homestayApplications.district, '%hamirpur%'),
                    ilike(homestayApplications.district, '%una%')
                );
            } else if (districtLower.includes('bilaspur') || districtLower.includes('mandi')) {
                // Group B: Bilaspur Pipeline (Bilaspur + Mandi)
                districtCondition = or(
                    ilike(homestayApplications.district, '%bilaspur%'),
                    ilike(homestayApplications.district, '%mandi%')
                );
            } else {
                // Group A: Standard Pipelines (Single District)
                districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
            }

            // Get all draft applications from this DA's district
            const incompleteApplications = await db
                .select()
                .from(homestayApplications)
                .where(
                    and(
                        districtCondition,
                        or(
                            eq(homestayApplications.status, 'draft'),
                            eq(homestayApplications.status, 'legacy_rc_draft')
                        )
                    )
                )
                .orderBy(desc(homestayApplications.updatedAt));

            // Enrich with owner information
            const applicationsWithOwner = await Promise.all(
                incompleteApplications.map(async (app) => {
                    const owner = await storage.getUser(app.userId);
                    return {
                        ...app,
                        ownerName: owner?.fullName || 'Unknown',
                        ownerMobile: owner?.mobile || 'N/A',
                        ownerEmail: owner?.email || 'N/A',
                    };
                })
            );

            res.json(applicationsWithOwner);
        } catch (error) {
            routeLog.error("[da] Failed to fetch incomplete applications:", error);
            res.status(500).json({ message: "Failed to fetch incomplete applications" });
        }
    });

    // Get applications for DA (district-specific)
    router.get("/api/da/applications", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const userId = req.session.userId!;
            const user = await storage.getUser(userId);

            if (!user || !user.district) {
                return res.status(400).json({ message: "DA must be assigned to a district" });
            }

            // Custom Routing Logic for Group B (Merged) and Group C (Split) Pipelines
            let districtCondition;
            const districtLower = user.district.toLowerCase();

            if (districtLower.includes('pangi')) {
                // Group C: Pangi Pipeline (Chamba district, Pangi tehsil)
                districtCondition = and(
                    ilike(homestayApplications.district, '%chamba%'),
                    ilike(homestayApplications.tehsil, '%pangi%')
                );
            } else if (districtLower.includes('kaza')) {
                // Group C: Kaza Pipeline (Lahaul-Spiti district, Spiti tehsil)
                // Note: We check 'kaza' specifically. 'spiti' matches 'Lahaul and Spiti' district name.
                districtCondition = and(
                    ilike(homestayApplications.district, '%lahaul%'),
                    ilike(homestayApplications.tehsil, '%spiti%')
                );
            } else if (districtLower.includes('lahaul')) {
                // Group C: Lahaul Main Pipeline (Lahaul-Spiti district EXCLUDING Spiti)
                districtCondition = and(
                    ilike(homestayApplications.district, '%lahaul%'),
                    or(not(ilike(homestayApplications.tehsil, '%spiti%')), isNull(homestayApplications.tehsil)) // Exclude ANY match for Spiti
                );
            } else if (districtLower.includes('chamba')) {
                // Group C: Chamba Main Pipeline (Chamba district EXCLUDING Pangi)
                districtCondition = and(
                    ilike(homestayApplications.district, '%chamba%'),
                    or(not(ilike(homestayApplications.tehsil, '%pangi%')), isNull(homestayApplications.tehsil))
                );
            } else if (districtLower.includes('hamirpur')) {
                // Group B: Hamirpur Pipeline (Hamirpur + Una)
                districtCondition = or(
                    ilike(homestayApplications.district, '%hamirpur%'),
                    ilike(homestayApplications.district, '%una%')
                );
            } else if (districtLower.includes('bilaspur') || districtLower.includes('mandi')) {
                // Group B: Bilaspur Pipeline (Bilaspur + Mandi)
                districtCondition = or(
                    ilike(homestayApplications.district, '%bilaspur%'),
                    ilike(homestayApplications.district, '%mandi%')
                );
            } else {
                // Group A: Standard Pipelines (Single District)
                districtCondition = buildDistrictWhereClause(homestayApplications.district, user.district);
            }

            // Get all applications from this DA's district ordered by most recent
            const allApplications = await db
                .select()
                .from(homestayApplications)
                .where(districtCondition)
                .orderBy(desc(homestayApplications.createdAt));

            // Enrich with owner information
            const applicationsWithOwner = await Promise.all(
                allApplications.map(async (app) => {
                    const owner = await storage.getUser(app.userId);
                    const [latestCorrection] = await db
                        .select({
                            createdAt: applicationActions.createdAt,
                            feedback: applicationActions.feedback,
                        })
                        .from(applicationActions)
                        .where(
                            and(
                                eq(applicationActions.applicationId, app.id),
                                eq(applicationActions.action, 'correction_resubmitted'),
                            ),
                        )
                        .orderBy(desc(applicationActions.createdAt))
                        .limit(1);
                    return {
                        ...app,
                        ownerName: owner?.fullName || 'Unknown',
                        ownerMobile: owner?.mobile || 'N/A',
                        latestCorrection,
                    };
                })
            );

            res.json(applicationsWithOwner);
        } catch (error) {
            routeLog.error("[da] Failed to fetch applications:", error);
            res.status(500).json({ message: "Failed to fetch applications" });
        }
    });

    // Get single application details for DA
    router.get("/api/da/applications/:id", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const detail = await fetchApplicationWithOwner(req.params.id);

            if (!detail?.application) {
                return res.status(404).json({ message: "Application not found" });
            }

            // Ensure documents are synced from JSONB to documents table
            // This handles cases where the sync didn't run during submission
            if (storage.syncDocumentsFromJsonb) {
                try {
                    await storage.syncDocumentsFromJsonb(req.params.id);
                } catch (syncErr) {
                    routeLog.warn({ err: syncErr, applicationId: req.params.id }, "[da] Document sync failed");
                }
            }

            const documents = await storage.getDocumentsByApplication(req.params.id);
            const [sendBackSetting] = await db
                .select()
                .from(systemSettings)
                .where(eq(systemSettings.settingKey, DA_SEND_BACK_SETTING_KEY))
                .limit(1);
            const sendBackEnabled = normalizeBooleanSetting(
                sendBackSetting?.settingValue,
                false,
            );
            const legacyForwardEnabled = await getLegacyForwardEnabled();

            const correctionHistory = await db
                .select({
                    id: applicationActions.id,
                    createdAt: applicationActions.createdAt,
                    feedback: applicationActions.feedback,
                })
                .from(applicationActions)
                .where(
                    and(
                        eq(applicationActions.applicationId, req.params.id),
                        eq(applicationActions.action, 'correction_resubmitted'),
                    ),
                )
                .orderBy(desc(applicationActions.createdAt));

            res.json({
                application: detail.application,
                owner: detail.owner,
                documents,
                sendBackEnabled,
                legacyForwardEnabled,
                correctionHistory,
            });
        } catch (error) {
            routeLog.error("[da] Failed to fetch application details:", error);
            res.status(500).json({ message: "Failed to fetch application details" });
        }
    });

    // Start scrutiny (change status to under_scrutiny)
    router.post("/api/da/applications/:id/start-scrutiny", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const userId = req.session.userId!;
            const application = await storage.getApplication(req.params.id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (application.status !== 'submitted') {
                return res.status(400).json({ message: "Only submitted applications can be put under scrutiny" });
            }

            await storage.updateApplication(req.params.id, { status: 'under_scrutiny' });
            await logApplicationAction({
                applicationId: req.params.id,
                actorId: userId,
                action: "start_scrutiny",
                previousStatus: application.status,
                newStatus: "under_scrutiny",
            });

            res.json({ message: "Application is now under scrutiny" });
        } catch (error) {
            routeLog.error("[da] Failed to start scrutiny:", error);
            res.status(500).json({ message: "Failed to start scrutiny" });
        }
    });

    // Save scrutiny progress (document verifications)
    router.post("/api/da/applications/:id/save-scrutiny", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const { verifications } = req.body;
            const userId = req.session.userId!;

            if (!verifications || !Array.isArray(verifications)) {
                return res.status(400).json({ message: "Invalid verification data" });
            }

            const targetApplication = await storage.getApplication(req.params.id);
            if (!targetApplication) {
                return res.status(404).json({ message: "Application not found" });
            }
            if (targetApplication.status !== 'under_scrutiny' && targetApplication.status !== 'legacy_rc_review') {
                return res.status(400).json({ message: "Document updates are locked once the application leaves scrutiny" });
            }

            // Update each document's verification status
            for (const verification of verifications) {
                await db.update(documents)
                    .set({
                        verificationStatus: verification.status,
                        verificationNotes: verification.notes || null,
                        isVerified: verification.status === 'verified',
                        verifiedBy: verification.status !== 'pending' ? userId : null,
                        verificationDate: verification.status !== 'pending' ? new Date() : null,
                    })
                    .where(eq(documents.id, verification.documentId));
            }

            res.json({ message: "Scrutiny progress saved successfully" });
        } catch (error) {
            routeLog.error("[da] Failed to save scrutiny progress:", error);
            res.status(500).json({ message: "Failed to save scrutiny progress" });
        }
    });

    // Forward to DTDO
    router.post("/api/da/applications/:id/forward-to-dtdo", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const { remarks } = req.body;
            const userId = req.session.userId!;
            const trimmedRemarks = typeof remarks === "string" ? remarks.trim() : "";
            if (!trimmedRemarks) {
                return res.status(400).json({ message: "Scrutiny remarks are required before forwarding." });
            }
            const application = await storage.getApplication(req.params.id);

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (application.status !== 'under_scrutiny' && application.status !== 'legacy_rc_review') {
                return res.status(400).json({ message: "Only applications under scrutiny can be forwarded" });
            }

            const legacyForwardEnabled = await getLegacyForwardEnabled();
            if (isLegacyApplicationRecord(application) && !legacyForwardEnabled) {
                return res.status(400).json({
                    message: "Legacy RC onboarding cases must be completed by the DA. DTDO escalation is currently disabled.",
                });
            }

            // For cancellation/deletion requests, documents are optional/not expected
            if (application.applicationKind !== 'cancel_certificate' && application.applicationKind !== 'delete_rooms') {
                const docs = await storage.getDocumentsByApplication(req.params.id);
                if (docs.length === 0) {
                    return res.status(400).json({ message: "Upload and verify required documents before forwarding" });
                }

                const pendingDoc = docs.find((doc) => !doc.verificationStatus || doc.verificationStatus === 'pending');
                if (pendingDoc) {
                    return res.status(400).json({ message: "Verify every document (mark Verified / Needs correction / Rejected) before forwarding" });
                }
            }

            await storage.updateApplication(req.params.id, {
                status: 'forwarded_to_dtdo',
                daId: userId,
                daReviewDate: new Date(),
                daForwardedDate: new Date(),
                daRemarks: trimmedRemarks || null,
            } as Partial<HomestayApplication>);
            await logApplicationAction({
                applicationId: req.params.id,
                actorId: userId,
                action: "forwarded_to_dtdo",
                previousStatus: application.status,
                newStatus: "forwarded_to_dtdo",
                feedback: trimmedRemarks || null,
            });
            const daOwner = await storage.getUser(application.userId);
            const forwardedApplication = {
                ...application,
                status: 'forwarded_to_dtdo',
            } as HomestayApplication;
            queueNotification("forwarded_to_dtdo", {
                application: forwardedApplication,
                owner: daOwner ?? null,
            });

            res.json({ message: "Application forwarded to DTDO successfully" });
        } catch (error) {
            routeLog.error("[da] Failed to forward to DTDO:", error);
            res.status(500).json({ message: "Failed to forward application" });
        }
    });

    // Send back to applicant (requires OTP verification from DTDO)
    // On second revert (revertCount >= 1), application is auto-rejected
    router.post("/api/da/applications/:id/send-back", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const { reason, otpVerified } = req.body;

            if (!reason || reason.trim().length === 0) {
                return res.status(400).json({ message: "Reason for sending back is required" });
            }

            const application = await storage.getApplication(req.params.id);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            if (application.status !== 'under_scrutiny' && application.status !== 'legacy_rc_review') {
                return res.status(400).json({ message: "Only applications under scrutiny can be sent back" });
            }

            const currentRevertCount = application.revertCount ?? 0;
            const sanitizedReason = reason.trim();

            // Fetch max revert count from settings
            const [maxRevertSetting] = await db
                .select()
                .from(systemSettings)
                .where(eq(systemSettings.settingKey, MAX_REVERT_COUNT_SETTING_KEY))
                .limit(1);

            const maxReverts = maxRevertSetting ? Number(maxRevertSetting.settingValue) : DEFAULT_MAX_REVERT_COUNT;

            // AUTO-REJECT: If application was already sent back enough times, reject it automatically
            if (currentRevertCount >= maxReverts) {
                routeLog.info({ applicationId: req.params.id, revertCount: currentRevertCount, maxReverts },
                    "Auto-rejecting application on send-back attempt exceeding limit");

                await storage.updateApplication(req.params.id, {
                    status: 'rejected',
                    rejectionReason: `APPLICATION AUTO-REJECTED: Application was sent back ${maxReverts + 1} times. Original reason: ${sanitizedReason}`,
                    revertCount: currentRevertCount + 1,
                } as Partial<HomestayApplication>);

                await logApplicationAction({
                    applicationId: req.params.id,
                    actorId: req.session.userId!,
                    action: "auto_rejected",
                    previousStatus: application.status,
                    newStatus: "rejected",
                    feedback: `Auto-rejected on 2nd send-back. Reason: ${sanitizedReason}`,
                });

                const owner = await storage.getUser(application.userId);
                queueNotification("application_rejected", {
                    application: { ...application, status: "rejected" } as HomestayApplication,
                    owner: owner ?? null,
                    extras: { REMARKS: `Application was automatically rejected after multiple correction attempts. Reason: ${sanitizedReason}` },
                });

                return res.json({
                    message: "Application has been automatically REJECTED due to multiple send-backs",
                    autoRejected: true,
                    newStatus: "rejected"
                });
            }

            // FIRST SEND-BACK: Require OTP verification from DTDO
            if (!otpVerified) {
                return res.status(400).json({
                    message: "OTP verification from DTDO is required before sending back",
                    requireOtp: true,
                    revertCount: currentRevertCount
                });
            }

            // Proceed with send-back
            const updatedByDa = await storage.updateApplication(req.params.id, {
                status: 'reverted_to_applicant',
                revertCount: currentRevertCount + 1,
            } as Partial<HomestayApplication>);

            await logApplicationAction({
                applicationId: req.params.id,
                actorId: req.session.userId!,
                action: "reverted_by_da",
                previousStatus: application.status,
                newStatus: "reverted_to_applicant",
                feedback: sanitizedReason,
            });

            const owner = await storage.getUser(application.userId);
            queueNotification("da_send_back", {
                application: updatedByDa ?? { ...application, status: "reverted_to_applicant" },
                owner: owner ?? null,
                extras: { REMARKS: sanitizedReason },
            });

            res.json({
                message: "Application sent back to applicant successfully",
                newRevertCount: currentRevertCount + 1,
                warning: "This application can only be sent back once more before automatic rejection."
            });
        } catch (error) {
            routeLog.error("[da] Failed to send back application:", error);
            res.status(500).json({ message: "Failed to send back application" });
        }
    });
    // Get DA personal performance stats
    router.get("/api/da/stats", requireRole('dealing_assistant'), async (req, res) => {
        try {
            const userId = req.session.userId!;
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            // 1. Applications Processed Today (Forwarded or Reverted)
            const [processedToday] = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(applicationActions)
                .where(
                    and(
                        eq(applicationActions.actorId, userId),
                        gte(applicationActions.createdAt, startOfDay),
                        inArray(applicationActions.action, ['forwarded_to_dtdo', 'reverted_by_da'])
                    )
                );

            // 2. Pending Scrutiny Count (Assigned to DA locally or just In District)
            // Ideally we filter by what's actually "in their queue"
            // For now, we reuse the logic of "Incomplete" or "Under Scrutiny" assigned to them?
            // Let's just count 'under_scrutiny' applications (since they take ownership via Start Scrutiny)
            // But 'under_scrutiny' doesn't technically assign to a specific DA ID in the schema until they forward it?
            // Wait, schema has `daId` column? check schema.
            // Start Scrutiny doesn't set daId in my previous code?
            // Checked: Start Scrutiny just updates status. Forward sets daId.
            // So we can count actions "start_scrutiny" for active apps?
            // Simpler: Just count how many they "started scrutiny" on that are still "under_scrutiny".

            // Actually, let's just count ALL 'under_scrutiny' in their district for now (Shared Queue Model)
            // Or better, count actions.

            // Let's stick to "Processed Today" as the main metric.
            // And "Avg Processing Time" (Last 30 days)

            // 3. Avg Processing Time (Time from 'start_scrutiny' to 'forwarded/reverted')
            // This is complex SQL. Let's keep it simple for v1.1.0 Phase 3.

            res.json({
                processedToday: processedToday.count,
                pendingScrutiny: 0, // Placeholder
                avgTime: "0 mins"   // Placeholder
            });

        } catch (error) {
            routeLog.error("[da] Failed to fetch stats:", error);
            res.status(500).json({ message: "Failed to fetch stats" });
        }
    });
}
