import express from "express";
import { db } from "../../db";
import {
    himkoshTransactions,
    homestayApplications,
    ddoCodes,
    users,
} from "@shared/schema";
import { requireRole } from "../core/middleware";
import { logger } from "../../logger";
import { eq, desc, and, or, isNull, sql, gte, lte, inArray } from "drizzle-orm";

import { getDistrictsCoveredBy } from "@shared/districtRouting";

const log = logger.child({ module: "admin-reports-router" });

/**
 * Get the district filter for a user based on their role
 * - DTDO/DA: their district AND covered districts (returns array)
 * - Supervisor/Admin: all districts (null = no filter)
 * 
 * Note: Administrators can override this by passing 'district' query param,
 * but only if this function returns null (meaning they are allowed to see all).
 */
const getDistrictFilter = async (userId: string): Promise<string[] | null> => {
    const [user] = await db
        .select({ role: users.role, district: users.district })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    if (!user) return null;

    // District-level officers see their district AND covered districts
    if (
        user.role === "district_tourism_officer" ||
        user.role === "district_officer" ||
        user.role === "dealing_assistant"
    ) {
        if (!user.district) return null;
        const coveredDistricts = getDistrictsCoveredBy(user.district);
        return coveredDistricts;
    }

    // State-level officers and admins see all
    return null;
};

/**
 * Build SQL condition for transaction type filter
 * - 'test': Application numbers starting with 'TEST-'
 * - 'real': Application numbers NOT starting with 'TEST-'
 * - 'all' or undefined: No filter
 */
const buildTransactionTypeCondition = (transactionType: string | undefined) => {
    if (transactionType === 'test') {
        return sql`${homestayApplications.applicationNumber} LIKE 'TEST-%'`;
    } else if (transactionType === 'real') {
        return sql`${homestayApplications.applicationNumber} NOT LIKE 'TEST-%'`;
    }
    return null;
};

export function createAdminReportsRouter() {
    const router = express.Router();

    /**
     * GET /api/admin/reports/collections
     * Collection summary by DDO/District
     */
    router.get(
        "/reports/collections",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);

                log.info({
                    userId,
                    queryDistrict: req.query.district,
                    roleFilter,
                }, "Reports filter debug");;

                // Date range filters
                const fromDate = req.query.from ? new Date(req.query.from as string) : null;
                const toDate = req.query.to ? new Date(req.query.to as string) : null;
                const transactionType = req.query.transactionType as string | undefined;
                const ddoFilter = req.query.ddo as string | undefined;

                // Build query with filters
                let query = db
                    .select({
                        ddo: himkoshTransactions.ddo,
                        district: homestayApplications.district, // Use Application District
                        ddoDescription: ddoCodes.ddoDescription,
                        treasuryCode: ddoCodes.treasuryCode,
                        totalTransactions: sql<number>`count(*)::int`,
                        successfulTransactions: sql<number>`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} IN ('success', 'verified'))::int`,
                        totalAmount: sql<number>`coalesce(sum(${himkoshTransactions.totalAmount}) FILTER (WHERE ${himkoshTransactions.transactionStatus} IN ('success', 'verified')), 0)::int`,
                    })
                    .from(himkoshTransactions)
                    .innerJoin(
                        homestayApplications,
                        eq(himkoshTransactions.applicationId, homestayApplications.id)
                    )
                    // Join DDO codes strictly matching BOTH code and district to avoid cross-product duplication
                    .leftJoin(
                        ddoCodes,
                        and(
                            eq(himkoshTransactions.ddo, ddoCodes.ddoCode),
                            eq(homestayApplications.district, ddoCodes.district)
                        )
                    )
                    .groupBy(
                        himkoshTransactions.ddo,
                        homestayApplications.district,
                        ddoCodes.ddoDescription,
                        ddoCodes.treasuryCode
                    )
                    .orderBy(desc(sql`sum(${himkoshTransactions.totalAmount})`));

                // Apply filters
                const conditions = [];
                // roleFilter is an array of covered districts for DTDO/DA, or null for admins
                if (roleFilter && roleFilter.length > 0) {
                    conditions.push(inArray(homestayApplications.district, roleFilter));
                } else if (req.query.district && req.query.district !== "all") {
                    conditions.push(eq(homestayApplications.district, req.query.district as string));
                }
                if (fromDate) {
                    conditions.push(gte(himkoshTransactions.createdAt, fromDate));
                }
                if (toDate) {
                    conditions.push(lte(himkoshTransactions.createdAt, toDate));
                }
                const txnTypeCondition = buildTransactionTypeCondition(transactionType);
                if (txnTypeCondition) {
                    conditions.push(txnTypeCondition);
                }
                if (ddoFilter && ddoFilter !== 'all') {
                    conditions.push(eq(himkoshTransactions.ddo, ddoFilter));
                }

                if (conditions.length > 0) {
                    query = query.where(and(...conditions)) as typeof query;
                }

                const collections = await query;

                // Calculate totals
                const totals = collections.reduce(
                    (acc, row) => ({
                        totalTransactions: acc.totalTransactions + (row.totalTransactions || 0),
                        successfulTransactions: acc.successfulTransactions + (row.successfulTransactions || 0),
                        totalAmount: acc.totalAmount + (row.totalAmount || 0),
                    }),
                    { totalTransactions: 0, successfulTransactions: 0, totalAmount: 0 }
                );

                res.json({
                    collections,
                    totals,
                    filters: {
                        districts: roleFilter || (req.query.district ? [req.query.district as string] : null),
                        from: fromDate?.toISOString() || null,
                        to: toDate?.toISOString() || null,
                    },
                });
            } catch (error) {
                log.error({ err: error }, "[reports] Failed to fetch collection report");
                res.status(500).json({ message: "Failed to fetch collection report" });
            }
        }
    );

    /**
     * GET /api/admin/reports/payments
     * List of approved/successful payments
     */
    router.get(
        "/reports/payments",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "system_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);
                const page = Math.max(1, parseInt(req.query.page as string) || 1);
                const limit = Math.min(5000, Math.max(10, parseInt(req.query.limit as string) || 20));
                const offset = (page - 1) * limit;

                // Date range filters
                const fromDate = req.query.from ? new Date(req.query.from as string) : null;
                const toDate = req.query.to ? new Date(req.query.to as string) : null;
                const transactionType = req.query.transactionType as string | undefined;
                const ddoFilter = req.query.ddo as string | undefined;
                const statusFilter = req.query.status as string | undefined;

                // Default to success-only unless status=all is specified
                const conditions = [];
                if (statusFilter !== 'all') {
                    conditions.push(inArray(himkoshTransactions.transactionStatus, ["success", "verified"]));
                }

                // roleFilter is an array of covered districts for DTDO/DA
                // We'll apply this filter later in the WHERE clause

                if (fromDate) {
                    conditions.push(gte(himkoshTransactions.createdAt, fromDate));
                }
                if (toDate) {
                    conditions.push(lte(himkoshTransactions.createdAt, toDate));
                }
                const txnTypeCondition = buildTransactionTypeCondition(transactionType);
                if (txnTypeCondition) {
                    conditions.push(txnTypeCondition);
                }
                if (ddoFilter && ddoFilter !== 'all') {
                    conditions.push(eq(himkoshTransactions.ddo, ddoFilter));
                }

                // Add district condition to WHERE clause if filter exists
                const whereConditions = [...conditions];
                if (roleFilter && roleFilter.length > 0) {
                    whereConditions.push(inArray(homestayApplications.district, roleFilter));
                } else if (req.query.district && req.query.district !== "all") {
                    whereConditions.push(eq(homestayApplications.district, req.query.district as string));
                }

                const whereClause = and(...whereConditions);

                const [payments, countResult] = await Promise.all([
                    db
                        .select({
                            id: himkoshTransactions.id,
                            appRefNo: himkoshTransactions.appRefNo,
                            deptRefNo: himkoshTransactions.deptRefNo,
                            ddo: himkoshTransactions.ddo,
                            head1: himkoshTransactions.head1,
                            totalAmount: himkoshTransactions.totalAmount,
                            transactionStatus: himkoshTransactions.transactionStatus,
                            echTxnId: himkoshTransactions.echTxnId,
                            bankCIN: himkoshTransactions.bankCIN,
                            bankName: himkoshTransactions.bankName,
                            tenderBy: himkoshTransactions.tenderBy,
                            createdAt: himkoshTransactions.createdAt,
                            applicationId: himkoshTransactions.applicationId,
                            applicationDistrict: homestayApplications.district,
                        })
                        .from(himkoshTransactions)
                        .innerJoin(
                            homestayApplications,
                            eq(himkoshTransactions.applicationId, homestayApplications.id)
                        )
                        .where(whereClause)
                        .orderBy(desc(himkoshTransactions.createdAt))
                        .limit(limit)
                        .offset(offset),
                    db
                        .select({ count: sql<number>`count(*)::int` })
                        .from(himkoshTransactions)
                        .innerJoin(
                            homestayApplications,
                            eq(himkoshTransactions.applicationId, homestayApplications.id)
                        )
                        .where(whereClause),
                ]);

                const totalCount = countResult[0]?.count || 0;

                res.json({
                    payments,
                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages: Math.ceil(totalCount / limit),
                    },
                    filters: {
                        districts: roleFilter || (req.query.district ? [req.query.district as string] : null),
                        from: fromDate?.toISOString() || null,
                        to: toDate?.toISOString() || null,
                    },
                });
            } catch (error) {
                log.error({ err: error }, "[reports] Failed to fetch payments report");
                res.status(500).json({ message: "Failed to fetch payments report" });
            }
        }
    );

    /**
     * GET /api/admin/reports/refundable
     * Payments that may need refund (rejected after payment)
     */
    router.get(
        "/reports/refundable",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);
                const transactionType = req.query.transactionType as string | undefined;

                // Find applications that were rejected after payment AND NOT YET REFUNDED
                const refundableQuery = db
                    .select({
                        transactionId: himkoshTransactions.id,
                        applicationNumber: homestayApplications.applicationNumber,
                        echTxnId: himkoshTransactions.echTxnId,
                        bankCIN: himkoshTransactions.bankCIN,
                        tenderBy: himkoshTransactions.tenderBy,
                        paymentDate: himkoshTransactions.createdAt, // Use createdAt as paymentDate
                        totalAmount: himkoshTransactions.totalAmount,
                        propertyName: homestayApplications.propertyName,
                        ownerName: homestayApplications.ownerName,
                        district: homestayApplications.district,
                        deptRefNo: himkoshTransactions.deptRefNo,
                        appRefNo: himkoshTransactions.appRefNo,
                        ddo: himkoshTransactions.ddo,
                    })
                    .from(himkoshTransactions)
                    .innerJoin(
                        homestayApplications,
                        eq(himkoshTransactions.applicationId, homestayApplications.id)
                    )
                    .where(
                        and(
                            eq(homestayApplications.status, "rejected"),
                            inArray(himkoshTransactions.transactionStatus, ["success", "verified"]),
                            or(
                                isNull(himkoshTransactions.isRefunded),
                                eq(himkoshTransactions.isRefunded, false)
                            ),
                            ...(buildTransactionTypeCondition(transactionType) ? [buildTransactionTypeCondition(transactionType)!] : [])
                        )
                    )
                    .orderBy(desc(himkoshTransactions.createdAt));

                let refundable = await refundableQuery;
                console.log("[refundable] Raw query returned:", refundable.length, "rows");
                console.log("[refundable] roleFilter:", roleFilter, "district query:", req.query.district);
                if (refundable.length > 0) {
                    console.log("[refundable] First row:", JSON.stringify(refundable[0]));
                }

                // Apply district filter if needed
                // roleFilter is an array of covered districts for DTDO/DA, or null for admins
                // For admins, they can pass a single district as query param
                if (roleFilter && roleFilter.length > 0) {
                    // DTDO/DA: filter by covered districts (case-insensitive)
                    const coveredLower = roleFilter.map(d => d.toLowerCase());
                    refundable = refundable.filter(
                        (r) => r.district && coveredLower.includes(r.district.toLowerCase())
                    );
                } else if (req.query.district && req.query.district !== "all") {
                    // Admin with specific district filter
                    const qDistrict = (req.query.district as string).toLowerCase();
                    refundable = refundable.filter(
                        (r) => r.district?.toLowerCase() === qDistrict
                    );
                }

                const totalRefundAmount = refundable.reduce(
                    (sum, r) => sum + (r.totalAmount || 0),
                    0
                );

                res.json({
                    refundable,
                    summary: {
                        count: refundable.length,
                        totalAmount: totalRefundAmount,
                    },
                    filters: {
                        districts: roleFilter || (req.query.district ? [req.query.district as string] : null),
                    },
                });
            } catch (error) {
                log.error({ err: error }, "[reports] Failed to fetch refundable report");
                res.status(500).json({ message: "Failed to fetch refundable report" });
            }
        }
    );

    /**
     * GET /api/admin/reports/summary
     * Quick summary stats for dashboard
     */
    router.get(
        "/reports/summary",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);
                const transactionType = req.query.transactionType as string | undefined;
                const ddoFilter = req.query.ddo as string | undefined;

                // Build conditions
                const whereConditions = [];

                // roleFilter is an array of covered districts for DTDO/DA, or null for admins
                if (roleFilter && roleFilter.length > 0) {
                    whereConditions.push(inArray(homestayApplications.district, roleFilter));
                } else if (req.query.district && req.query.district !== "all") {
                    whereConditions.push(eq(homestayApplications.district, req.query.district as string));
                }
                const txnTypeCondition = buildTransactionTypeCondition(transactionType);
                if (txnTypeCondition) {
                    whereConditions.push(txnTypeCondition);
                }
                if (ddoFilter && ddoFilter !== 'all') {
                    whereConditions.push(eq(himkoshTransactions.ddo, ddoFilter));
                }

                const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

                const [stats] = await db
                    .select({
                        totalTransactions: sql<number>`count(*)::int`,
                        successfulTransactions: sql<number>`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} IN ('success', 'verified') AND (${himkoshTransactions.isRefunded} IS NULL OR ${himkoshTransactions.isRefunded} = false))::int`,
                        failedTransactions: sql<number>`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} = 'failed')::int`,
                        pendingTransactions: sql<number>`count(*) FILTER (WHERE ${himkoshTransactions.transactionStatus} IN ('initiated', 'redirected'))::int`,
                        refundedTransactions: sql<number>`count(*) FILTER (WHERE ${himkoshTransactions.isRefunded} = true)::int`,
                        // Total Collected = Gross - Refunded
                        // But wait! User wants "Total Collected" to be Net.
                        // I'll calculate Net Collection here.
                        totalCollected: sql<number>`coalesce(sum(${himkoshTransactions.totalAmount}) FILTER (WHERE ${himkoshTransactions.transactionStatus} IN ('success', 'verified') AND (${himkoshTransactions.isRefunded} IS NULL OR ${himkoshTransactions.isRefunded} = false)), 0)::int`,
                        totalRefunded: sql<number>`coalesce(sum(${himkoshTransactions.totalAmount}) FILTER (WHERE ${himkoshTransactions.isRefunded} = true), 0)::int`,
                    })
                    .from(himkoshTransactions)
                    .innerJoin(
                        homestayApplications,
                        eq(himkoshTransactions.applicationId, homestayApplications.id)
                    )
                    .where(whereClause);

                res.json({
                    ...stats,
                    district: roleFilter?.join(', ') || (req.query.district as string) || null,
                });
            } catch (error) {
                log.error({ err: error }, "[reports] Failed to fetch summary");
                res.status(500).json({ message: "Failed to fetch summary" });
            }
        }
    );

    /**
     * GET /api/admin/reports/ddo-codes
     * List of DDO codes for filter dropdown
     */
    router.get(
        "/reports/ddo-codes",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "system_admin"),
        async (req, res) => {
            try {
                const codes = await db
                    .select({
                        ddoCode: ddoCodes.ddoCode,
                        district: ddoCodes.district,
                        ddoDescription: ddoCodes.ddoDescription,
                    })
                    .from(ddoCodes)
                    .orderBy(ddoCodes.district);

                res.json({ ddoCodes: codes });
            } catch (error) {
                log.error({ err: error }, "[reports] Failed to fetch DDO codes");
                res.status(500).json({ message: "Failed to fetch DDO codes" });
            }
        }
    );

    /**
     * GET /api/admin/reports/operations
     * Operational metrics: processing times, form completion, correction rates
     */
    router.get(
        "/reports/operations",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "dealing_assistant"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);

                // Date range filters
                const fromDate = req.query.from ? new Date(req.query.from as string) : null;
                const toDate = req.query.to ? new Date(req.query.to as string) : null;

                // Build base conditions
                const conditions = [];
                // roleFilter is an array of covered districts for DTDO/DA, or null for admins
                if (roleFilter && roleFilter.length > 0) {
                    conditions.push(inArray(homestayApplications.district, roleFilter));
                } else if (req.query.district && req.query.district !== "all") {
                    conditions.push(eq(homestayApplications.district, req.query.district as string));
                }
                if (fromDate) {
                    conditions.push(gte(homestayApplications.submittedAt, fromDate));
                }
                if (toDate) {
                    conditions.push(lte(homestayApplications.submittedAt, toDate));
                }



                const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

                // Helper to apply where clause conditionally
                const applyWhere = <T extends any>(qb: T) => {
                    return whereClause ? qb.where(whereClause) : qb;
                };

                // 1. Processing Time Stats (submitted -> approved)
                const [processingStats] = await applyWhere(
                    db.select({
                        totalApproved: sql<number>`count(*) FILTER (WHERE ${homestayApplications.status} = 'approved')::int`,
                        avgProcessingDays: sql<number>`avg(EXTRACT(EPOCH FROM (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) FILTER (WHERE ${homestayApplications.status} = 'approved' AND ${homestayApplications.approvedAt} IS NOT NULL AND ${homestayApplications.submittedAt} IS NOT NULL)`,
                        minProcessingDays: sql<number>`min(EXTRACT(EPOCH FROM (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) FILTER (WHERE ${homestayApplications.status} = 'approved' AND ${homestayApplications.approvedAt} IS NOT NULL)`,
                        maxProcessingDays: sql<number>`max(EXTRACT(EPOCH FROM (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) FILTER (WHERE ${homestayApplications.status} = 'approved' AND ${homestayApplications.approvedAt} IS NOT NULL)`,
                    })
                        .from(homestayApplications)
                );

                // 2. Form Completion Time Stats
                const formMetric = (req.query.formMetric as string) || 'average';
                const formThresholdMinutes = parseInt(req.query.formThreshold as string) || 240; // Default 4 hours
                const formThresholdSeconds = formThresholdMinutes * 60;

                // Base filter: Must be > 0 AND <= Threshold
                const formTimeFilter = sql`${homestayApplications.formCompletionTimeSeconds} IS NOT NULL 
                    AND ${homestayApplications.formCompletionTimeSeconds} > 0
                    AND ${homestayApplications.formCompletionTimeSeconds} <= ${formThresholdSeconds}`;

                // Dynamic aggregation: AVG or MEDIAN
                // Postgres MEDIAN: percentile_cont(0.5) WITHIN GROUP (ORDER BY col)
                const metricSql = formMetric === 'median'
                    ? sql<number>`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${homestayApplications.formCompletionTimeSeconds}) FILTER (WHERE ${formTimeFilter})`
                    : sql<number>`avg(${homestayApplications.formCompletionTimeSeconds}) FILTER (WHERE ${formTimeFilter})`;

                const [formTimeStats] = await applyWhere(
                    db.select({
                        totalTracked: sql<number>`count(*) FILTER (WHERE ${formTimeFilter})::int`,
                        avgSeconds: metricSql,
                        minSeconds: sql<number>`min(${homestayApplications.formCompletionTimeSeconds}) FILTER (WHERE ${formTimeFilter})`,
                        maxSeconds: sql<number>`max(${homestayApplications.formCompletionTimeSeconds}) FILTER (WHERE ${formTimeFilter})`,
                    })
                        .from(homestayApplications)
                );

                // 3. Correction/Reversion Stats
                const [correctionStats] = await applyWhere(
                    db.select({
                        totalApplications: sql<number>`count(*) FILTER (WHERE ${homestayApplications.applicationNumber} NOT LIKE 'LG-HS-%')::int`,
                        totalWithCorrections: sql<number>`count(*) FILTER (WHERE ${homestayApplications.revertCount} > 0 AND ${homestayApplications.applicationNumber} NOT LIKE 'LG-HS-%')::int`,
                        avgReversionCount: sql<number>`avg(${homestayApplications.revertCount}) FILTER (WHERE ${homestayApplications.applicationNumber} NOT LIKE 'LG-HS-%')`,
                        maxReversionCount: sql<number>`max(${homestayApplications.revertCount}) FILTER (WHERE ${homestayApplications.applicationNumber} NOT LIKE 'LG-HS-%')::int`,
                        totalRejected: sql<number>`count(*) FILTER (WHERE ${homestayApplications.status} = 'rejected' AND ${homestayApplications.applicationNumber} NOT LIKE 'LG-HS-%')::int`,
                        existingRCCount: sql<number>`count(*) FILTER (WHERE ${homestayApplications.applicationNumber} LIKE 'LG-HS-%')::int`,
                    })
                        .from(homestayApplications)
                );

                // 4. Category Breakdown
                const categoryBreakdown = await applyWhere(
                    db.select({
                        category: homestayApplications.category,
                        count: sql<number>`count(*)::int`,
                        avgProcessingDays: sql<number>`avg(EXTRACT(EPOCH FROM (${homestayApplications.approvedAt} - ${homestayApplications.submittedAt})) / 86400) FILTER (WHERE ${homestayApplications.status} = 'approved' AND ${homestayApplications.approvedAt} IS NOT NULL)`,
                    })
                        .from(homestayApplications)
                ).groupBy(homestayApplications.category);

                // 5. Status Distribution
                const statusBreakdown = await applyWhere(
                    db.select({
                        status: homestayApplications.status,
                        count: sql<number>`count(*)::int`,
                    })
                        .from(homestayApplications)
                ).groupBy(homestayApplications.status);

                // Calculate pipeline metrics (excluding Existing RC)
                const draftCount = Number(statusBreakdown.find(s => s.status === 'draft')?.count || 0);
                const existingRCPipelineCount = Number(correctionStats?.existingRCCount || 0);
                const totalApps = Number(correctionStats?.totalApplications || 0);
                const submittedCount = totalApps - draftCount;
                const approvedCount = Number(processingStats?.totalApproved || 0);
                const rejectedCount = Number(correctionStats?.totalRejected || 0);
                // Pending = Submitted - Approved - Rejected
                const pendingCount = submittedCount - approvedCount - rejectedCount;

                res.json({
                    pipeline: {
                        total: totalApps,
                        drafts: draftCount,
                        submitted: submittedCount,
                        approved: approvedCount,
                        rejected: rejectedCount,
                        pending: pendingCount,
                        existingRC: existingRCPipelineCount,
                    },
                    processingTime: {
                        totalApproved: Number(processingStats?.totalApproved || 0),
                        avgDays: Number(processingStats?.avgProcessingDays || 0).toFixed(1),
                        minDays: Number(processingStats?.minProcessingDays || 0).toFixed(1),
                        maxDays: Number(processingStats?.maxProcessingDays || 0).toFixed(1),
                    },
                    formCompletionTime: {
                        totalTracked: Number(formTimeStats?.totalTracked || 0),
                        avgSeconds: Math.round(Number(formTimeStats?.avgSeconds || 0)),
                        minSeconds: Math.round(Number(formTimeStats?.minSeconds || 0)),
                        maxSeconds: Math.round(Number(formTimeStats?.maxSeconds || 0)),
                    },
                    corrections: {
                        totalApplications: Number(correctionStats?.totalApplications || 0),
                        totalWithCorrections: Number(correctionStats?.totalWithCorrections || 0),
                        correctionRate: correctionStats?.totalApplications
                            ? ((Number(correctionStats.totalWithCorrections) / Number(correctionStats.totalApplications)) * 100).toFixed(1)
                            : "0.0",
                        avgReversions: Number(correctionStats?.avgReversionCount || 0).toFixed(2),
                        maxReversions: Number(correctionStats?.maxReversionCount || 0),
                        rejectionRate: correctionStats?.totalApplications
                            ? ((Number(correctionStats.totalRejected) / Number(correctionStats.totalApplications)) * 100).toFixed(1)
                            : "0.0",
                        totalRejected: Number(correctionStats?.totalRejected || 0),
                    },
                    categoryBreakdown: categoryBreakdown.map(c => ({
                        category: c.category,
                        count: Number(c.count),
                        avgProcessingDays: Number(c.avgProcessingDays || 0).toFixed(1),
                    })),
                    statusBreakdown: statusBreakdown.map(s => ({
                        status: s.status,
                        count: Number(s.count),
                    })),
                    filters: {
                        district: roleFilter?.join(', ') || (req.query.district as string) || null,
                        from: fromDate?.toISOString() || null,
                        to: toDate?.toISOString() || null,
                    },
                });
            } catch (error: any) {
                log.error({ err: error, stack: error.stack }, "[reports] Failed to fetch operations data");
                res.status(500).json({ message: "Failed to fetch operations data", error: error.message });
            }
        }
    );
    /**
     * GET /api/admin/reports/applications
     * List applications with filters (e.g. for Drafts list)
     */
    router.get(
        "/reports/applications",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);
                const page = Math.max(1, parseInt(req.query.page as string) || 1);
                const limit = Math.min(100, Math.max(10, parseInt(req.query.limit as string) || 20));
                const offset = (page - 1) * limit;

                // Filters
                const statusFilter = req.query.status as string | undefined;
                const fromDate = req.query.from ? new Date(req.query.from as string) : null;
                const toDate = req.query.to ? new Date(req.query.to as string) : null;
                // Allow district override by admin if not role-locked
                const districtQuery = req.query.district as string | undefined;

                const conditions = [];

                if (statusFilter) {
                    conditions.push(eq(homestayApplications.status, statusFilter));
                }

                if (roleFilter && roleFilter.length > 0) {
                    conditions.push(inArray(homestayApplications.district, roleFilter));
                } else if (districtQuery && districtQuery !== "all") {
                    conditions.push(eq(homestayApplications.district, districtQuery));
                }

                if (fromDate) {
                    conditions.push(gte(homestayApplications.createdAt, fromDate));
                }
                if (toDate) {
                    conditions.push(lte(homestayApplications.createdAt, toDate));
                }

                const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

                const [apps, countResult] = await Promise.all([
                    db.select({
                        id: homestayApplications.id,
                        applicationNumber: homestayApplications.applicationNumber,
                        propertyName: homestayApplications.propertyName,
                        ownerName: homestayApplications.ownerName,
                        district: homestayApplications.district,
                        status: homestayApplications.status,
                        createdAt: homestayApplications.createdAt,
                        submittedAt: homestayApplications.submittedAt,
                        mobile: homestayApplications.ownerMobile,
                    })
                        .from(homestayApplications)
                        .where(whereClause)
                        .orderBy(desc(homestayApplications.createdAt))
                        .limit(limit)
                        .offset(offset),
                    db.select({ count: sql<number>`count(*)::int` })
                        .from(homestayApplications)
                        .where(whereClause)
                ]);

                res.json({
                    applications: apps,
                    pagination: {
                        page,
                        limit,
                        totalCount: countResult[0]?.count || 0,
                        totalPages: Math.ceil((countResult[0]?.count || 0) / limit),
                    }
                });
            } catch (error: any) {
                log.error({ err: error }, "[reports] Failed to list applications");
                res.status(500).json({ message: "Failed to list applications" });
            }
        }
    );

    /**
     * GET /api/admin/reports/district-performance
     * Performance metrics grouped by district (For State HQ)
     */
    router.get(
        "/reports/district-performance",
        requireRole("state_officer", "admin", "super_admin"),
        async (req, res) => {
            try {
                const results = await db
                    .select({
                        district: homestayApplications.district,
                        totalApplications: sql<number>`count(*)::int`,
                        // Only count time for non-drafts where time > 0
                        avgTimeSeconds: sql<number>`avg(${homestayApplications.formCompletionTimeSeconds}) FILTER (WHERE ${homestayApplications.formCompletionTimeSeconds} > 0)::int`,
                        approved: sql<number>`count(*) FILTER (WHERE ${homestayApplications.status} = 'approved')::int`,
                        rejected: sql<number>`count(*) FILTER (WHERE ${homestayApplications.status} = 'rejected')::int`,
                        pending: sql<number>`count(*) FILTER (WHERE ${homestayApplications.status} IN ('submitted', 'under_scrutiny', 'forwarded_to_dtdo', 'pending_payment'))::int`,
                    })
                    .from(homestayApplications)
                    .groupBy(homestayApplications.district)
                    .orderBy(desc(sql`count(*)`));

                res.json(results);
            } catch (error: any) {
                log.error({ err: error }, "[reports] Failed to fetch district performance");
                res.status(500).json({ message: "Failed to fetch district performance" });
            }
        }
    );

    // ─── Existing RC Applications List ───────────────────────────────────
    router.get(
        "/reports/existing-rc",
        requireRole("district_tourism_officer", "district_officer", "state_officer", "admin", "super_admin", "system_admin"),
        async (req, res) => {
            try {
                const userId = req.session.userId!;
                const roleFilter = await getDistrictFilter(userId);

                const conditions: any[] = [
                    sql`${homestayApplications.applicationNumber} LIKE 'LG-HS-%'`,
                ];
                if (roleFilter && roleFilter.length > 0) {
                    conditions.push(inArray(homestayApplications.district, roleFilter));
                }

                const results = await db
                    .select({
                        id: homestayApplications.id,
                        applicationNumber: homestayApplications.applicationNumber,
                        applicantName: homestayApplications.ownerName, // Fixed: Use ownerName
                        district: homestayApplications.district,
                        category: homestayApplications.category,
                        status: homestayApplications.status,
                        submittedAt: homestayApplications.submittedAt,
                        createdAt: homestayApplications.createdAt,
                        ownerName: homestayApplications.ownerName, // Use application owner name
                    })
                    .from(homestayApplications)
                    .leftJoin(users, eq(homestayApplications.userId, users.id))
                    .where(and(...conditions))
                    .orderBy(desc(homestayApplications.submittedAt));

                console.log(`[ExistingRC] Found ${results.length} applications`);
                res.json({ applications: results });
            } catch (error: any) {
                log.error({ err: error }, "[reports] Failed to fetch existing RC applications");
                res.status(500).json({ message: "Failed to fetch existing RC data" });
            }
        }
    );

    return router;
}
