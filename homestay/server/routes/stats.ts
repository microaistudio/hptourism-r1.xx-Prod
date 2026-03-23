
import { Router } from "express";
import { db } from "../db";
import { homestayApplications, himkoshTransactions } from "../../shared/schema";
import { sql, eq, and, isNotNull, inArray, desc } from "drizzle-orm";

const router = Router();

// GET /api/stats/state
// Returns aggregated metrics for the "Him-Darshan" State Dashboard
router.get("/state", async (req, res) => {
    try {
        // 1. Hero Stats
        // ----------------------------------------------------------------
        const [heroData] = await db
            .select({
                totalApplications: sql<number>`count(*) filter (where ${homestayApplications.status} NOT IN ('draft', 'superseded', 'paid_pending_submit', 'legacy_rc_draft'))`,
                totalRevenue: sql<number>`coalesce((
                    SELECT sum(${himkoshTransactions.totalAmount})
                    FROM ${himkoshTransactions}
                    WHERE ${himkoshTransactions.transactionStatus} IN ('success', 'verified')
                      AND (${himkoshTransactions.isRefunded} IS NULL OR ${himkoshTransactions.isRefunded} = false)
                      AND ${himkoshTransactions.applicationId} IN (
                          SELECT ${homestayApplications.id} FROM ${homestayApplications}
                      )
                ), 0)`,
                pendingScrutiny: sql<number>`count(*) filter (where ${homestayApplications.status} in ('submitted', 'under_scrutiny', 'legacy_rc_review'))`,
                pendingDistrict: sql<number>`count(*) filter (where ${homestayApplications.status} in ('forwarded_to_dtdo', 'dtdo_review'))`,
                pendingInspection: sql<number>`count(*) filter (where ${homestayApplications.status} in ('inspection_scheduled', 'inspection_completed', 'inspection_under_review'))`,
                totalApproved: sql<number>`count(*) filter (where ${homestayApplications.status} = 'approved')`,
                avgClearanceDays: sql<number>`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400)`,
                existingRC: sql<number>`count(*) filter (where ${homestayApplications.applicationNumber} LIKE 'LG-HS-%')`,
            })
            .from(homestayApplications);

        // 2. Funnel Data (By Status)
        // ----------------------------------------------------------------
        const funnelRaw = await db
            .select({
                status: homestayApplications.status,
                count: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .groupBy(homestayApplications.status);

        // Normalize Funnel
        const funnelMap = new Map(funnelRaw.map(f => [f.status, Number(f.count)]));
        const funnelData = [
            { name: "Draft", value: (funnelMap.get("draft") || 0) + (funnelMap.get("legacy_rc_draft") || 0) + (funnelMap.get("paid_pending_submit") || 0), fill: "#94a3b8" },
            { name: "Submitted", value: funnelMap.get("submitted") || 0, fill: "#3b82f6" },
            { name: "DA Scrutiny", value: (funnelMap.get("under_scrutiny") || 0) + (funnelMap.get("legacy_rc_review") || 0), fill: "#f59e0b" },
            { name: "Inspection", value: (funnelMap.get("inspection_scheduled") || 0) + (funnelMap.get("inspection_completed") || 0) + (funnelMap.get("inspection_under_review") || 0), fill: "#8b5cf6" },
            { name: "Approved", value: funnelMap.get("approved") || 0, fill: "#22c55e" },
            { name: "Rejected", value: funnelMap.get("rejected") || 0, fill: "#ef4444" }
        ];

        // 3A. Heatmap Data (By Administrative Pipeline - 12 Distinct Units)
        // ----------------------------------------------------------------
        // We must group by the *Pipeline Label* logic, not just raw district
        const pipelineExpr = sql`
      CASE 
        -- Group B: Merged Districts
        WHEN lower(${homestayApplications.district}) = 'una' THEN 'Hamirpur (incl. Una)'
        WHEN lower(${homestayApplications.district}) = 'mandi' THEN 'Bilaspur (incl. Mandi)'
        WHEN lower(${homestayApplications.district}) = 'hamirpur' THEN 'Hamirpur (incl. Una)'
        WHEN lower(${homestayApplications.district}) = 'bilaspur' THEN 'Bilaspur (incl. Mandi)'

        -- Group C: Split Districts (Chamba)
        WHEN lower(${homestayApplications.district}) = 'chamba' AND lower(${homestayApplications.tehsil}) = 'pangi' THEN 'Pangi (Special)'
        WHEN lower(${homestayApplications.district}) = 'chamba' THEN 'Chamba (Main)'

        -- Group C: Split Districts (Lahaul-Spiti)
        WHEN (lower(${homestayApplications.district}) LIKE 'lahaul%') AND (lower(${homestayApplications.tehsil}) IN ('spiti', 'kaza')) THEN 'Spiti (Kaza)'
        WHEN (lower(${homestayApplications.district}) LIKE 'lahaul%') THEN 'Lahaul (Main)'

        -- Group A: Standard Districts
        ELSE ${homestayApplications.district} 
      END
    `;

        const districtRaw = await db
            .select({
                pipeline: pipelineExpr,
                count: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .groupBy(pipelineExpr);

        // Format for frontend
        const districtData = districtRaw.map(d => ({
            district: d.pipeline, // Mapped to "pipeline" name for UI
            applications: Number(d.count),
            status: Number(d.count) > 50 ? "high" : Number(d.count) > 20 ? "medium" : "low"
        })).sort((a, b) => b.applications - a.applications);


        // 4. District Performance Leaderboard (By Pipeline)
        const leaderboardRaw = await db
            .select({
                pipeline: pipelineExpr,
                processedCount: sql<number>`count(*)`,
                avgDays: sql<number>`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400)`
            })
            .from(homestayApplications)
            .where(isNotNull(homestayApplications.approvedAt))
            .groupBy(pipelineExpr)
            .orderBy(sql`avg(extract(epoch from (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) asc`);

        const leaderboard = leaderboardRaw.map(l => ({
            district: l.pipeline,
            avgDays: Number(l.avgDays || 0).toFixed(1),
            processed: Number(l.processedCount)
        }));

        // 5. Economic Impact (New for Dashboard 2.0)
        // ----------------------------------------------------------------
        // Only consider APPROVED applications for actual capacity
        const [economicData] = await db
            .select({
                totalBeds: sql<number>`sum(
                    (COALESCE(${homestayApplications.singleBedRooms}, 0) * COALESCE(${homestayApplications.singleBedBeds}, 1)) + 
                    (COALESCE(${homestayApplications.doubleBedRooms}, 0) * COALESCE(${homestayApplications.doubleBedBeds}, 2)) + 
                    (COALESCE(${homestayApplications.familySuites}, 0) * COALESCE(${homestayApplications.familySuiteBeds}, 4))
                )`,
                // Generic Revenue Projection: Avg Rate * Rooms * 365 days * 40% Occupancy
                projectedRevenue: sql<number>`sum(
                    COALESCE(${homestayApplications.averageRoomRate}, 2000) * 
                    ${homestayApplications.totalRooms} * 
                    365 * 0.40
                )`
            })
            .from(homestayApplications)
            .where(eq(homestayApplications.status, 'approved'));

        const categoryRaw = await db
            .select({
                category: homestayApplications.category,
                count: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .where(eq(homestayApplications.status, 'approved'))
            .groupBy(homestayApplications.category);

        const categoryData = categoryRaw.map(c => ({
            name: c.category || "Uncategorized",
            value: Number(c.count)
        }));

        // 6. Trend Data (Daily for last 30 days)
        // ----------------------------------------------------------------

        // Revenue Trend (Daily)
        const revenueTrendRaw = await db
            .select({
                date: sql<string>`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD')`,
                amount: sql<number>`sum(${himkoshTransactions.totalAmount})`
            })
            .from(himkoshTransactions)
            .where(
                and(
                    eq(himkoshTransactions.transactionStatus, 'success'),
                    sql`${himkoshTransactions.createdAt} > NOW() - INTERVAL '30 days'`
                )
            )
            .groupBy(sql`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD')`)
            .orderBy(sql`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM-DD') asc`);

        // Applications Trend (Daily)
        const appTrendRaw = await db
            .select({
                date: sql<string>`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD')`,
                count: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .where(
                and(
                    isNotNull(homestayApplications.submittedAt),
                    sql`${homestayApplications.submittedAt} > NOW() - INTERVAL '30 days'`
                )
            )
            .groupBy(sql`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD')`)
            .orderBy(sql`to_char(${homestayApplications.submittedAt}, 'YYYY-MM-DD') asc`);

        res.json({
            hero: {
                totalApplications: Number(heroData.totalApplications),
                totalRevenue: Number(heroData.totalRevenue || 0),
                pendingScrutiny: Number(heroData.pendingScrutiny),
                pendingDistrict: Number(heroData.pendingDistrict),
                pendingInspection: Number(heroData.pendingInspection),
                totalApproved: Number(heroData.totalApproved),
                avgClearanceDays: Number(heroData.avgClearanceDays || 0).toFixed(1),
                existingRC: Number(heroData.existingRC || 0),
            },
            trends: {
                revenue: revenueTrendRaw.map(r => ({ date: r.date, value: Number(r.amount) })),
                applications: appTrendRaw.map(r => ({ date: r.date, value: Number(r.count) }))
            },
            pipeline_counts: {
                draft: (funnelMap.get("draft") || 0) + (funnelMap.get("legacy_rc_draft") || 0) + (funnelMap.get("paid_pending_submit") || 0) + (funnelMap.get("superseded") || 0),
                submitted: funnelMap.get("submitted") || 0,
                scrutiny: (funnelMap.get("under_scrutiny") || 0) + (funnelMap.get("legacy_rc_review") || 0),
                district: (funnelMap.get("forwarded_to_dtdo") || 0) + (funnelMap.get("dtdo_review") || 0),
                inspection: (funnelMap.get("inspection_scheduled") || 0) + (funnelMap.get("inspection_completed") || 0) + (funnelMap.get("inspection_under_review") || 0),
                approved: funnelMap.get("approved") || 0,
                awaiting_applicant: (funnelMap.get("sent_back_for_corrections") || 0) + (funnelMap.get("reverted_to_applicant") || 0) + (funnelMap.get("reverted_by_dtdo") || 0),
                resubmitted_to_da: funnelMap.get("objection_raised") || 0,
                payment_pending: (funnelMap.get("payment_pending") || 0) + (funnelMap.get("verified_for_payment") || 0),
                rejected: funnelMap.get("rejected") || 0,
                existingRC: Number(heroData.existingRC || 0),
            },
            funnel: funnelData,
            heatmap: districtData,
            leaderboard: leaderboard,
            economic: {
                totalBeds: Number(economicData?.totalBeds || 0),
                projectedRevenue: Number(economicData?.projectedRevenue || 0),
                categorySplit: categoryData
            }
        });

    } catch (error) {
        console.error("[Stats API] Error fetching state stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
});

// GET /api/stats/locations
// Returns lightweight geo-data for the Map
router.get("/locations", async (req, res) => {
    try {
        const locations = await db
            .select({
                id: homestayApplications.id,
                name: homestayApplications.propertyName,
                lat: homestayApplications.latitude,
                lng: homestayApplications.longitude,
                status: homestayApplications.status,
                category: homestayApplications.category,
                district: homestayApplications.district
            })
            .from(homestayApplications)
            .where(
                and(
                    isNotNull(homestayApplications.latitude),
                    isNotNull(homestayApplications.longitude)
                )
            );

        res.json(locations);
    } catch (error) {
        console.error("[Stats API] Error fetching locations:", error);
        res.status(500).json({ message: "Failed to fetch locations" });
    }
});

// GET /api/stats/activity
// Returns recent application activity for the live feed
router.get("/activity", async (req, res) => {
    try {
        const recentActivity = await db
            .select({
                id: homestayApplications.id,
                applicationNumber: homestayApplications.applicationNumber,
                propertyName: homestayApplications.propertyName,
                status: homestayApplications.status,
                district: homestayApplications.district,
                ownerName: homestayApplications.ownerName,
                updatedAt: homestayApplications.updatedAt,
                submittedAt: homestayApplications.submittedAt,
                approvedAt: homestayApplications.approvedAt
            })
            .from(homestayApplications)
            .orderBy(sql`${homestayApplications.updatedAt} DESC NULLS LAST`)
            .limit(15);

        // Format for frontend
        const activities = recentActivity.map(app => {
            let action = "Updated";
            let timestamp = app.updatedAt;

            if (app.status === 'approved' && app.approvedAt) {
                action = "Approved";
                timestamp = app.approvedAt;
            } else if (app.status === 'rejected') {
                action = "Rejected";
            } else if (app.status === 'submitted' && app.submittedAt) {
                action = "Submitted";
                timestamp = app.submittedAt;
            } else if (app.status === 'draft') {
                action = "Draft Created";
            } else if (app.status?.includes('inspection')) {
                action = "Inspection Scheduled";
            } else if (app.status?.includes('verification')) {
                action = "Under Review";
            }

            return {
                id: app.id,
                applicationNumber: app.applicationNumber,
                propertyName: app.propertyName,
                action,
                district: app.district,
                ownerName: app.ownerName,
                timestamp
            };
        });

        res.json(activities);
    } catch (error) {
        console.error("[Stats API] Error fetching activity:", error);
        res.status(500).json({ message: "Failed to fetch activity" });
    }
});

// GET /api/stats/trends
// Returns trend calculations (current vs previous period)
router.get("/trends", async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Current period (last 30 days)
        const [currentPeriod] = await db
            .select({
                count: sql<number>`count(*)`,
                revenue: sql<number>`sum(${homestayApplications.totalFee})`
            })
            .from(homestayApplications)
            .where(sql`${homestayApplications.submittedAt} >= ${thirtyDaysAgo}`);

        // Previous period (30-60 days ago)
        const [previousPeriod] = await db
            .select({
                count: sql<number>`count(*)`,
                revenue: sql<number>`sum(${homestayApplications.totalFee})`
            })
            .from(homestayApplications)
            .where(sql`${homestayApplications.submittedAt} >= ${sixtyDaysAgo} AND ${homestayApplications.submittedAt} < ${thirtyDaysAgo}`);

        const currentCount = Number(currentPeriod?.count || 0);
        const previousCount = Number(previousPeriod?.count || 0);
        const currentRevenue = Number(currentPeriod?.revenue || 0);
        const previousRevenue = Number(previousPeriod?.revenue || 0);

        // Calculate percentage changes
        const countChange = previousCount > 0
            ? Math.round(((currentCount - previousCount) / previousCount) * 100)
            : (currentCount > 0 ? 100 : 0);

        const revenueChange = previousRevenue > 0
            ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
            : (currentRevenue > 0 ? 100 : 0);

        res.json({
            applications: {
                current: currentCount,
                previous: previousCount,
                change: countChange,
                trend: countChange >= 0 ? 'up' : 'down'
            },
            revenue: {
                current: currentRevenue,
                previous: previousRevenue,
                change: revenueChange,
                trend: revenueChange >= 0 ? 'up' : 'down'
            }
        });
    } catch (error) {
        console.error("[Stats API] Error fetching trends:", error);
        res.status(500).json({ message: "Failed to fetch trends" });
    }
});

// GET /api/stats/treasury-forecast
// Returns financial metrics for Treasury Forecasting page
// Uses REAL pipeline statuses from shared/status-groups.ts
router.get("/treasury-forecast", async (req, res) => {
    try {
        // Active pipeline statuses (applications currently being processed)
        const activePipelineStatuses = [
            'submitted', 'under_scrutiny', 'legacy_rc_review',
            'forwarded_to_dtdo', 'dtdo_review',
            'inspection_scheduled', 'inspection_completed', 'inspection_under_review',
            'verified_for_payment', 'payment_pending',
            'sent_back_for_corrections', 'reverted_to_applicant', 'reverted_by_dtdo',
            'objection_raised'
        ];

        // 1. Renewal Forecasting — use totalFee (full renewal cost, not baseFee)
        const upcomingRenewals = await db
            .select({
                expiryMonth: sql<string>`to_char(${homestayApplications.certificateExpiryDate}, 'YYYY-MM')`,
                revenue: sql<number>`coalesce(sum(${homestayApplications.totalFee}), 0)`,
                count: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .where(
                and(
                    eq(homestayApplications.status, 'approved'),
                    isNotNull(homestayApplications.certificateExpiryDate),
                    sql`${homestayApplications.certificateExpiryDate} >= NOW()`,
                    sql`${homestayApplications.certificateExpiryDate} <= NOW() + INTERVAL '1 year'`
                )
            )
            .groupBy(sql`to_char(${homestayApplications.certificateExpiryDate}, 'YYYY-MM')`)
            .orderBy(sql`to_char(${homestayApplications.certificateExpiryDate}, 'YYYY-MM') asc`);

        // 2. Pipeline Revenue — use REAL active statuses
        const [pipelineRevenue] = await db
            .select({
                expectedRevenue: sql<number>`coalesce(sum(${homestayApplications.totalFee}), 0)`,
                count: sql<number>`count(*)`,
                avgFee: sql<number>`coalesce(round(avg(${homestayApplications.totalFee})), 0)`
            })
            .from(homestayApplications)
            .where(inArray(homestayApplications.status, activePipelineStatuses));

        // 3. Collected Revenue — actual money received via Himkosh (all time)
        const [collectedRevenue] = await db
            .select({
                totalCollected: sql<number>`coalesce(sum(${himkoshTransactions.totalAmount}), 0)`,
                transactionCount: sql<number>`count(*)`
            })
            .from(himkoshTransactions)
            .where(eq(himkoshTransactions.transactionStatus, 'success'));

        // 4. Discount Impact Tracking (How much subsidy given)
        const [discountTotals] = await db
            .select({
                femaleOwnerSubsidy: sql<number>`coalesce(sum(${homestayApplications.femaleOwnerDiscount}), 0)`,
                pangiSubsidy: sql<number>`coalesce(sum(${homestayApplications.pangiDiscount}), 0)`,
                validitySubsidy: sql<number>`coalesce(sum(${homestayApplications.validityDiscount}), 0)`,
                totalSubsidized: sql<number>`coalesce(sum(${homestayApplications.totalDiscount}), 0)`,
                beneficiaryCount: sql<number>`count(*)`
            })
            .from(homestayApplications)
            .where(
                and(
                    isNotNull(homestayApplications.totalDiscount),
                    sql`${homestayApplications.totalDiscount} > 0`
                )
            );

        // 5. Monthly Actuals (last 12 months for better trend visibility)
        const pastRevenue = await db
            .select({
                month: sql<string>`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM')`,
                amount: sql<number>`coalesce(sum(${himkoshTransactions.totalAmount}), 0)`,
                txnCount: sql<number>`count(*)`
            })
            .from(himkoshTransactions)
            .where(
                and(
                    eq(himkoshTransactions.transactionStatus, 'success'),
                    sql`${himkoshTransactions.createdAt} >= NOW() - INTERVAL '12 months'`
                )
            )
            .groupBy(sql`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM')`)
            .orderBy(sql`to_char(${himkoshTransactions.createdAt}, 'YYYY-MM') asc`);

        // 6. Approved summary (for collection efficiency)
        const [approvedSummary] = await db
            .select({
                totalApproved: sql<number>`count(*)`,
                totalApprovedFees: sql<number>`coalesce(sum(${homestayApplications.totalFee}), 0)`
            })
            .from(homestayApplications)
            .where(eq(homestayApplications.status, 'approved'));

        res.json({
            renewals: upcomingRenewals.map(r => ({
                month: r.expiryMonth,
                projectedRevenue: Number(r.revenue || 0),
                propertiesCount: Number(r.count || 0)
            })),
            pipeline: {
                expectedRevenue: Number(pipelineRevenue?.expectedRevenue || 0),
                applicationsCount: Number(pipelineRevenue?.count || 0),
                avgFeePerApplication: Number(pipelineRevenue?.avgFee || 0)
            },
            collected: {
                totalCollected: Number(collectedRevenue?.totalCollected || 0),
                transactionCount: Number(collectedRevenue?.transactionCount || 0)
            },
            approved: {
                count: Number(approvedSummary?.totalApproved || 0),
                totalFees: Number(approvedSummary?.totalApprovedFees || 0)
            },
            subsidies: {
                femaleOwner: Number(discountTotals?.femaleOwnerSubsidy || 0),
                pangi: Number(discountTotals?.pangiSubsidy || 0),
                validity: Number(discountTotals?.validitySubsidy || 0),
                total: Number(discountTotals?.totalSubsidized || 0),
                beneficiaryCount: Number(discountTotals?.beneficiaryCount || 0)
            },
            historical: pastRevenue.map(r => ({
                month: r.month,
                actualRevenue: Number(r.amount || 0),
                transactionCount: Number(r.txnCount || 0)
            }))
        });

    } catch (error) {
        console.error("[Stats API] Error fetching treasury forecast:", error);
        res.status(500).json({ message: "Failed to fetch treasury forecast" });
    }
});

export default router;
