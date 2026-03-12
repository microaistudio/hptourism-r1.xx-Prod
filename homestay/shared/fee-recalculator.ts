/**
 * v1.3.0 - Fee Recalculation Service
 * 
 * Used when a DTDO returns an application for category or payment term correction.
 * Calculates the fee delta between the old and new parameters, determining whether
 * the applicant needs to pay more or has overpaid (credit).
 */

import { calculateHomestayFee, type CategoryType, type LocationType, type FeeBreakdown } from './fee-calculator';

export interface FeeRecalculationInput {
    // Current application parameters (what was originally paid for)
    oldCategory: CategoryType;
    oldValidityYears: 1 | 3;
    oldTotalFee: number; // The actual amount paid via Himkosh

    // New parameters (what the applicant is changing to)
    newCategory: CategoryType;
    newValidityYears: 1 | 3;

    // Location type — supports changes (e.g. GP → TCP correction)
    // v1.3.3 fix: Use oldLocationType/newLocationType when location changes.
    // Falls back to locationType for backward compatibility.
    locationType: LocationType;
    oldLocationType?: LocationType; // If omitted, uses locationType
    newLocationType?: LocationType; // If omitted, uses locationType

    ownerGender: 'male' | 'female' | 'other';
    isPangiSubDivision: boolean;
    discountMode?: 'ADDITIVE' | 'SEQUENTIAL';
}

export interface FeeRecalculationResult {
    // Old fee breakdown
    oldFeeBreakdown: FeeBreakdown;
    oldTotalFee: number; // Actual amount paid (may differ from calculated if manually adjusted)

    // New fee breakdown
    newFeeBreakdown: FeeBreakdown;
    newTotalFee: number; // New calculated fee

    // Delta
    feeDelta: number; // newTotalFee - oldTotalFee (positive = applicant owes more, negative = overpaid)
    absoluteDelta: number; // Math.abs(feeDelta)

    // Action required
    isUpgrade: boolean; // true = applicant must pay more
    isDowngrade: boolean; // true = applicant overpaid (credit)
    isNoChange: boolean; // true = same fee

    // What changed
    categoryChanged: boolean;
    validityYearsChanged: boolean;

    // Supplementary payment details (only if isUpgrade)
    supplementaryPaymentRequired: number; // Amount applicant must pay (0 if no payment needed)

    // Credit details (only if isDowngrade)
    creditAmount: number; // Amount to record in credit ledger (0 if no credit)
}

/**
 * Recalculate fees when category or payment term is corrected.
 * 
 * This function computes the delta between the original fee and the new fee,
 * determining whether the applicant needs to make a supplementary payment
 * or has earned a credit for overpayment.
 */
export function recalculateFee(input: FeeRecalculationInput): FeeRecalculationResult {
    // v1.3.3 fix: Use separate location types for old vs new fee calculation
    // This correctly handles GP → TCP (or vice versa) corrections
    const effectiveOldLocationType = input.oldLocationType ?? input.locationType;
    const effectiveNewLocationType = input.newLocationType ?? input.locationType;

    // Calculate old fee using the fee calculator (with OLD location type)
    const oldFeeBreakdown = calculateHomestayFee({
        category: input.oldCategory,
        locationType: effectiveOldLocationType,
        validityYears: input.oldValidityYears,
        ownerGender: input.ownerGender,
        isPangiSubDivision: input.isPangiSubDivision,
        discountMode: input.discountMode,
    });

    // Calculate new fee (with NEW location type)
    const newFeeBreakdown = calculateHomestayFee({
        category: input.newCategory,
        locationType: effectiveNewLocationType,
        validityYears: input.newValidityYears,
        ownerGender: input.ownerGender,
        isPangiSubDivision: input.isPangiSubDivision,
        discountMode: input.discountMode,
    });

    // Use the actual paid amount for comparison (not calculated), to handle edge cases
    // where a manual adjustment was made or a historical rate was different
    const oldTotalFee = input.oldTotalFee > 0 ? input.oldTotalFee : oldFeeBreakdown.finalFee;
    const newTotalFee = newFeeBreakdown.finalFee;

    const feeDelta = newTotalFee - oldTotalFee;
    const absoluteDelta = Math.abs(feeDelta);

    const categoryChanged = input.oldCategory !== input.newCategory;
    const validityYearsChanged = input.oldValidityYears !== input.newValidityYears;

    const isUpgrade = feeDelta > 0;
    const isDowngrade = feeDelta < 0;
    const isNoChange = feeDelta === 0;

    return {
        oldFeeBreakdown,
        oldTotalFee: Math.round(oldTotalFee * 100) / 100,
        newFeeBreakdown,
        newTotalFee: Math.round(newTotalFee * 100) / 100,
        feeDelta: Math.round(feeDelta * 100) / 100,
        absoluteDelta: Math.round(absoluteDelta * 100) / 100,
        isUpgrade,
        isDowngrade,
        isNoChange,
        categoryChanged,
        validityYearsChanged,
        supplementaryPaymentRequired: isUpgrade ? Math.round(feeDelta * 100) / 100 : 0,
        creditAmount: isDowngrade ? Math.round(absoluteDelta * 100) / 100 : 0,
    };
}

/**
 * Determine the credit reason based on what changed
 */
export function getCreditReason(categoryChanged: boolean, validityYearsChanged: boolean): 'category_downgrade' | 'term_reduction' | 'manual_adjustment' {
    if (categoryChanged && !validityYearsChanged) return 'category_downgrade';
    if (!categoryChanged && validityYearsChanged) return 'term_reduction';
    // If both changed or neither, use manual_adjustment as a catch-all
    return 'manual_adjustment';
}

/**
 * Human-readable description of the fee change
 */
export function describeFeeChange(result: FeeRecalculationResult, input: FeeRecalculationInput): string {
    const parts: string[] = [];

    if (result.categoryChanged) {
        parts.push(`Category: ${capitalize(input.oldCategory)} → ${capitalize(input.newCategory)}`);
    }
    if (result.validityYearsChanged) {
        parts.push(`Term: ${input.oldValidityYears} year(s) → ${input.newValidityYears} year(s)`);
    }

    if (result.isUpgrade) {
        parts.push(`Additional payment required: ₹${result.supplementaryPaymentRequired.toLocaleString('en-IN')}`);
    } else if (result.isDowngrade) {
        parts.push(`Credit generated: ₹${result.creditAmount.toLocaleString('en-IN')}`);
    } else {
        parts.push('No fee change');
    }

    return parts.join(' • ');
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
