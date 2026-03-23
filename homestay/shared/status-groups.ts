/**
 * CANONICAL STATUS GROUPING - Single Source of Truth
 * 
 * Every dashboard, analytics page, and report MUST use these groupings.
 * If you need to change how statuses are grouped, change them HERE and
 * all pages will update automatically.
 * 
 * DB statuses (as of Mar 2026):
 *   submitted, under_scrutiny, legacy_rc_review, forwarded_to_dtdo,
 *   dtdo_review, inspection_scheduled, inspection_completed, 
 *   inspection_under_review, payment_pending, verified_for_payment,
 *   approved, rejected, reverted_by_dtdo, reverted_to_applicant,
 *   sent_back_for_corrections, objection_raised, draft,
 *   superseded, paid_pending_submit, legacy_rc_draft
 */

export interface StatusGroup {
  id: string;
  label: string;
  statuses: string[];
  /** Whether this group represents an active pipeline stage (not terminal, not draft) */
  isActive: boolean;
}

/**
 * Pipeline stage groupings - the definitive mapping from raw DB statuses
 * to visual pipeline stages. Used by Workflow Monitoring, Analytics,
 * Dashboard, and all reporting.
 */
export const PIPELINE_STAGES: StatusGroup[] = [
  {
    id: "submission",
    label: "Submitted",
    statuses: ["submitted"],
    isActive: true,
  },
  {
    id: "da_scrutiny",
    label: "DA Scrutiny",
    statuses: ["under_scrutiny", "legacy_rc_review"],
    isActive: true,
  },
  {
    id: "district_review",
    label: "District Review",
    statuses: ["forwarded_to_dtdo", "dtdo_review"],
    isActive: true,
  },
  {
    id: "inspection",
    label: "Inspection",
    statuses: ["inspection_scheduled", "inspection_completed", "inspection_under_review"],
    isActive: true,
  },
  {
    id: "payment_pending",
    label: "Payment Pending",
    statuses: ["verified_for_payment", "payment_pending"],
    isActive: true,
  },
  {
    id: "rc_issued",
    label: "RC Issued",
    statuses: ["approved"],
    isActive: false,
  },
  {
    id: "rejected",
    label: "Rejected / Refund",
    statuses: ["rejected"],
    isActive: false,
  },
];

/**
 * Secondary (non-pipeline) status groupings for objection/revert tracking.
 */
export const SECONDARY_STAGES: StatusGroup[] = [
  {
    id: "awaiting_applicant",
    label: "Awaiting Applicant",
    statuses: ["sent_back_for_corrections", "reverted_to_applicant", "reverted_by_dtdo"],
    isActive: true,
  },
  {
    id: "resubmitted_to_da",
    label: "Resubmitted to DA",
    statuses: ["objection_raised"],
    isActive: true,
  },
];

/**
 * Statuses that are excluded from pipeline counts entirely
 */
export const EXCLUDED_STATUSES = ["draft", "superseded", "paid_pending_submit", "legacy_rc_draft"];

/**
 * Helper: count applications by stage using the canonical groupings
 */
export function countByStage(
  applications: Array<{ status?: string | null }>,
  stages: StatusGroup[] = PIPELINE_STAGES
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const stage of stages) {
    counts[stage.id] = applications.filter(
      (app) => stage.statuses.includes((app.status ?? "").trim().toLowerCase())
    ).length;
  }
  return counts;
}

/**
 * Helper: count all active pipeline applications
 * (everything that is not draft, superseded, approved, or rejected)
 */
export function countActivePipeline(
  applications: Array<{ status?: string | null }>
): number {
  const allActiveStatuses = [
    ...PIPELINE_STAGES.filter(s => s.isActive),
    ...SECONDARY_STAGES,
  ].flatMap(s => s.statuses);
  
  return applications.filter(
    (app) => allActiveStatuses.includes((app.status ?? "").trim().toLowerCase())
  ).length;
}
