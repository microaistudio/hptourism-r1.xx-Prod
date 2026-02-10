
import { Router } from "express";
import { db } from "../../db";
import { districtBaselineStats, users } from "../../../shared/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "../core/middleware";
import { z } from "zod";

const router = Router();

// Schema for updating baseline stats
const updateBaselineSchema = z.object({
    district: z.string().min(1),
    totalCount: z.coerce.number().int().min(0),
    approvedCount: z.coerce.number().int().min(0).optional(),
    rejectedCount: z.coerce.number().int().min(0).optional(),
    pendingCount: z.coerce.number().int().min(0).optional(),
    description: z.string().optional(),
});

// GET /api/admin/baseline-stats
// Get all baseline stats
router.get("/baseline-stats", requireRole("state_officer", "admin", "system_admin"), async (req, res) => {
    try {
        const stats = await db.select().from(districtBaselineStats);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching baseline stats:", error);
        res.status(500).json({ message: "Failed to fetch baseline stats" });
    }
});

// POST /api/admin/baseline-stats
// Create or Update baseline stats for a district
router.post("/baseline-stats", requireRole("state_officer", "admin", "system_admin"), async (req, res) => {
    try {
        console.log("Received baseline stats update:", req.body);
        const { district, totalCount, approvedCount, rejectedCount, pendingCount, description } = updateBaselineSchema.parse(req.body);
        console.log("Parsed data:", { district, totalCount, approvedCount, rejectedCount, pendingCount });

        const [existing] = await db
            .select()
            .from(districtBaselineStats)
            .where(eq(districtBaselineStats.district, district))
            .limit(1);

        if (existing) {
            const [updated] = await db
                .update(districtBaselineStats)
                .set({
                    totalCount,
                    approvedCount: approvedCount ?? existing.approvedCount,
                    rejectedCount: rejectedCount ?? existing.rejectedCount,
                    pendingCount: pendingCount ?? existing.pendingCount,
                    description: description ?? existing.description,
                    updatedBy: req.session.userId,
                    updatedAt: new Date(),
                })
                .where(eq(districtBaselineStats.id, existing.id))
                .returning();
            res.json(updated);
        } else {
            const [created] = await db
                .insert(districtBaselineStats)
                .values({
                    district,
                    totalCount,
                    approvedCount: approvedCount ?? 0,
                    rejectedCount: rejectedCount ?? 0,
                    pendingCount: pendingCount ?? 0,
                    description,
                    updatedBy: req.session.userId,
                })
                .returning();
            res.json(created);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid input", errors: error.errors });
        }
        console.error("Error updating baseline stats:", error);
        res.status(500).json({ message: "Failed to update baseline stats" });
    }
});

export default router;
