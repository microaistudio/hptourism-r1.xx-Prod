
import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { homestayApplications, applicationActions, users, himkoshTransactions } from "@shared/schema";
import { requireRole } from "../core/middleware";
import { logger } from "../../logger";
import { districtsMatch } from "../helpers/district";
import { getDistrictsCoveredBy } from "@shared/districtRouting";

const routeLog = logger.child({ module: "admin-actions" });

const router = Router();

// Reactivate a rejected application
// Allowed for: Super Admin, DTDO, District Officer
router.post("/api/admin/applications/:id/reactivate", requireRole("super_admin", "district_tourism_officer", "district_officer"), async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { reason } = req.body;
        // Fix: req.user is not reliably populated, use req.session and fetch user
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const userRole = user.role;

        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({ message: "Reason for reactivation is required" });
        }



        const application = await db.query.homestayApplications.findFirst({
            where: eq(homestayApplications.id, applicationId),
        });



        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.status !== 'rejected') {
            return res.status(400).json({ message: "Only rejected applications can be reactivated" });
        }

        if (userRole !== 'super_admin') {
            const coveredDistricts = getDistrictsCoveredBy(user?.district);
            const isCovered = coveredDistricts.some(d => districtsMatch(d, application.district));

            if (user?.district && !isCovered) {
                return res.status(403).json({ message: "You can only reactivate applications from your district coverage area" });
            }
        }

        // Logic:
        // 1. Reset status to 'submitted' (so it goes to DA queue)
        // 2. Reset revertCount to 0 (gives a fresh start to avoid immediate auto-rejection if limit was hit)
        // 3. Clear rejectionReason

        const previousRevertCount = application.revertCount ?? 0;
        const newRevertCount = 0; // Reset to 0 to allow corrections

        await db.update(homestayApplications).set({
            status: 'submitted',
            revertCount: newRevertCount,
            updatedAt: new Date(),
            rejectionReason: null, // Clear current rejection reason
        }).where(eq(homestayApplications.id, applicationId));

        // Log to history (applicationActions)
        await db.insert(applicationActions).values({
            applicationId,
            officerId: userId,
            action: 'reactivated',
            previousStatus: 'rejected',
            newStatus: 'submitted',
            feedback: `Reactivated. Reason: ${reason}. Revert count reset from ${previousRevertCount} to 0.`,
        });

        routeLog.info({
            applicationId,
            action: 'reactivate',
            userId,
            role: userRole
        }, "Application reactivated");

        res.json({ message: "Application reactivated successfully" });

    } catch (error) {
        routeLog.error({ err: error }, "[admin] Reactivate application failed");
        res.status(500).json({ message: "Internal server error" });
    }
});

// Mark a transaction as refunded (Manual Tracking)
// Allowed for: Super Admin, DTDO, District Officer, State Officer
router.post("/api/admin/transactions/:id/mark-refunded", requireRole("super_admin", "district_tourism_officer", "district_officer", "state_officer"), async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.session.userId!;

        // Check if transaction exists
        const [transaction] = await db
            .select()
            .from(himkoshTransactions)
            .where(eq(himkoshTransactions.id, transactionId))
            .limit(1);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        if (transaction.isRefunded) {
            return res.status(400).json({ message: "Transaction is already marked as refunded" });
        }

        // Check permissions (district routing)
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (user!.role !== 'super_admin' && user!.role !== 'state_officer') {
            // Check if transaction belongs to user's covered district
            // Join with application to get district? Or fetch app manually?
            // Transaction has applicationId.
            const [app] = await db
                .select({ district: homestayApplications.district })
                .from(homestayApplications)
                .where(eq(homestayApplications.id, transaction.applicationId))
                .limit(1);

            if (app) {
                const coveredDistricts = getDistrictsCoveredBy(user!.district);
                const isCovered = coveredDistricts.some(d => districtsMatch(d, app.district));
                if (!isCovered) {
                    return res.status(403).json({ message: "You can only process refunds for your district coverage area" });
                }
            }
        }

        // Update transaction
        await db.update(himkoshTransactions).set({
            isRefunded: true,
            refundedAt: new Date(),
            refundedBy: userId,
            updatedAt: new Date(),
        }).where(eq(himkoshTransactions.id, transactionId));

        routeLog.info({ transactionId, userId, action: 'mark-refunded' }, "Transaction marked as refunded");

        res.json({ message: "Transaction marked as refunded successfully" });

    } catch (error: any) {
        routeLog.error({ err: error }, "[admin] Mark transaction refunded failed");
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;
