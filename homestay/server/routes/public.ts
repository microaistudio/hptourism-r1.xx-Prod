import express from "express";
import { db } from "../db";
import { storage } from "../storage";
import { homestayApplications, systemSettings } from "@shared/schema";
import { logger } from "../logger";
import { eq } from "drizzle-orm";

const log = logger.child({ module: "public-router" });

export function createPublicRouter() {
    const router = express.Router();

    /**
     * GET /api/public/stats
     * Returns combined statistics: Real-time DB counts + Configurable Legacy counts
     */
    router.get("/stats", async (_req, res) => {
        try {
            // 1. Fetch real-time counts from DB
            const allApplications = await db.select().from(homestayApplications);

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

            // 2. Fetch legacy stats from system settings
            const [legacySetting] = await db
                .select()
                .from(systemSettings)
                .where(eq(systemSettings.settingKey, "admin_legacy_stats"))
                .limit(1);

            const legacy = (legacySetting?.settingValue as any) || {
                total: 0,
                approved: 0,
                rejected: 0,
                pending: 0
            };

            // 3. Combine counts
            const combined = {
                total: realtime.total + (parseInt(legacy.total) || 0),
                approved: realtime.approved + (parseInt(legacy.approved) || 0),
                rejected: realtime.rejected + (parseInt(legacy.rejected) || 0),
                pending: realtime.pending + (parseInt(legacy.pending) || 0),
                realtime,
                legacy
            };

            res.json(combined);
        } catch (error) {
            log.error("[public] Failed to fetch public stats:", error);
            // Return zero stats instead of 500 to prevent UI crash
            res.json({
                total: 0,
                approved: 0,
                rejected: 0,
                pending: 0,
                error: "Failed to fetch stats"
            });
        }
    });

    return router;
}
