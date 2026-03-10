/**
 * Payment Reconciliation Engine
 * 
 * 3-Layer approach:
 *   Layer 1 (Cron):      Background job that periodically checks stale transactions
 *   Layer 2 (Page-load): On-demand check when owner views their application
 *   Layer 3 (Manual):    Already implemented — "Confirm Payment Found" in Super Console
 * 
 * All parameters are configurable via system_settings table:
 *   - reconciliation_cron_interval_minutes   (default 15)
 *   - reconciliation_stale_threshold_minutes (default 30)
 *   - reconciliation_max_batch_size          (default 10)
 *   - reconciliation_enabled                 (default true)
 *   - reconciliation_page_load_enabled       (default true)
 * 
 * When the firewall blocks server→HimKosh, these will gracefully fail
 * and log warnings without affecting the application.
 */

import { db } from '../db';
import {
    himkoshTransactions,
    homestayApplications,
    systemSettings,
} from '@shared/schema';
import { eq, and, inArray, lte, desc, sql } from 'drizzle-orm';
import { verifyChallanViaSearch, type SearchChallanResult } from './crypto';
import { resolveHimkoshGatewayConfig } from './gatewayConfig';
import { logger } from '../logger';

const reconLog = logger.child({ module: 'payment-reconciliation' });

export interface ReconLogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    details?: any;
}

const recentLogs: ReconLogEntry[] = [];
const MAX_LOGS = 200;

export function getRecentReconLogs(): ReconLogEntry[] {
    return [...recentLogs];
}

function logEvent(level: 'info' | 'warn' | 'error' | 'debug', msg: string, details?: any) {
    // 1. Send to standard logger map
    if (details) {
        reconLog[level](details, msg);
    } else {
        reconLog[level](msg);
    }

    // 2. Save to rolling memory array for the UI
    const entry: ReconLogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message: msg,
        details,
    };
    recentLogs.unshift(entry);
    if (recentLogs.length > MAX_LOGS) {
        recentLogs.pop();
    }
}

// ─── Settings Cache ──────────────────────────────────────────────────────────

interface ReconciliationSettings {
    cronIntervalMinutes: number;
    staleThresholdMinutes: number;
    maxBatchSize: number;
    enabled: boolean;
    pageLoadEnabled: boolean;
}

const DEFAULTS: ReconciliationSettings = {
    cronIntervalMinutes: 15,
    staleThresholdMinutes: 30,
    maxBatchSize: 10,
    enabled: true,
    pageLoadEnabled: true,
};

let cachedSettings: ReconciliationSettings | null = null;
let settingsLoadedAt = 0;
const SETTINGS_CACHE_TTL_MS = 60_000; // Re-read from DB every 60s

/**
 * Load reconciliation settings from system_settings table.
 * Falls back to defaults if not configured.
 */
export async function getReconciliationSettings(): Promise<ReconciliationSettings> {
    const now = Date.now();
    if (cachedSettings && now - settingsLoadedAt < SETTINGS_CACHE_TTL_MS) {
        return cachedSettings;
    }

    try {
        const [row] = await db
            .select({ settingValue: systemSettings.settingValue })
            .from(systemSettings)
            .where(eq(systemSettings.settingKey, 'reconciliation_config'))
            .limit(1);

        if (row?.settingValue && typeof row.settingValue === 'object') {
            const val = row.settingValue as Record<string, unknown>;
            cachedSettings = {
                cronIntervalMinutes: Number(val.cronIntervalMinutes) || DEFAULTS.cronIntervalMinutes,
                staleThresholdMinutes: Number(val.staleThresholdMinutes) || DEFAULTS.staleThresholdMinutes,
                maxBatchSize: Number(val.maxBatchSize) || DEFAULTS.maxBatchSize,
                enabled: val.enabled !== false,
                pageLoadEnabled: val.pageLoadEnabled !== false,
            };
        } else {
            cachedSettings = { ...DEFAULTS };
        }
    } catch (err) {
        logEvent('warn', 'Failed to load reconciliation settings, using defaults', { err });
        cachedSettings = { ...DEFAULTS };
    }

    settingsLoadedAt = now;
    return cachedSettings;
}

// ─── Core Verification Logic (shared by Layer 1 & 2) ────────────────────────

interface ReconcileResult {
    appRefNo: string;
    action: 'verified' | 'not_found' | 'error' | 'skipped';
    grn?: string;
    error?: string;
}

/**
 * Attempt to verify a single transaction via HimKosh SearchChallan.
 * If verified, updates transaction + application records.
 * 
 * This is the CORE function used by both cron and page-load.
 */
export async function reconcileTransaction(
    transactionId: string,
    source: 'cron' | 'page_load' | 'api',
): Promise<ReconcileResult> {
    const [txn] = await db
        .select()
        .from(himkoshTransactions)
        .where(eq(himkoshTransactions.id, transactionId))
        .limit(1);

    if (!txn) {
        return { appRefNo: '', action: 'skipped', error: 'Transaction not found' };
    }

    // Skip if already resolved
    if (['success', 'verified', 'failed'].includes(txn.transactionStatus ?? '')) {
        return { appRefNo: txn.appRefNo ?? '', action: 'skipped' };
    }

    try {
        const { config } = await resolveHimkoshGatewayConfig();
        const searchUrl = config.searchChallanUrl
            ?? 'https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx';

        // Determine date range (transaction date ± 1 day)
        const txnDate = txn.respondedAt ?? txn.initiatedAt ?? txn.createdAt;
        const dateObj = txnDate ? new Date(txnDate) : new Date();
        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        };
        const dayBefore = new Date(dateObj);
        dayBefore.setDate(dayBefore.getDate() - 1);
        const dayAfter = new Date(dateObj);
        dayAfter.setDate(dayAfter.getDate() + 1);

        logEvent('info', 'Attempting auto-reconciliation via SearchChallan', { appRefNo: txn.appRefNo, source, txnId: transactionId });

        let result: SearchChallanResult;
        try {
            result = await verifyChallanViaSearch({
                searchUrl,
                tenderBy: txn.tenderBy ?? '',
                fromDate: formatDate(dayBefore),
                toDate: formatDate(dayAfter),
                echTxnId: txn.echTxnId ?? '',
                appRefNo: txn.appRefNo ?? '',
            });
        } catch (fetchErr: any) {
            // Network/firewall error — expected on PROD until firewall is opened
            logEvent('warn', 'SearchChallan unreachable (likely firewall). Auto-reconciliation skipped.', { appRefNo: txn.appRefNo, err: fetchErr.message, source });
            return {
                appRefNo: txn.appRefNo ?? '',
                action: 'error',
                error: `SearchChallan unreachable: ${fetchErr.message}`,
            };
        }

        if (!result.found || !result.isSuccess) {
            logEvent('info', 'Transaction not found as successful on HimKosh', { appRefNo: txn.appRefNo, found: result.found, isSuccess: result.isSuccess, source });
            return { appRefNo: txn.appRefNo ?? '', action: 'not_found' };
        }

        // ✅ HimKosh confirmed payment! Update transaction record
        logEvent('info', '🎉 Auto-reconciliation SUCCESS — payment verified via SearchChallan', { appRefNo: txn.appRefNo, grn: result.transId, source });

        await db
            .update(himkoshTransactions)
            .set({
                transactionStatus: 'success',
                statusCd: '1',
                echTxnId: result.transId || txn.echTxnId,
                bankCIN: result.receiptNo || txn.bankCIN,
                bankName: `Auto-${source}`, // Distinguish from manual: "Auto-cron" or "Auto-page_load"
                respondedAt: new Date(),
            })
            .where(eq(himkoshTransactions.id, transactionId));

        // Also update the application's payment status
        if (txn.applicationId) {
            await db
                .update(homestayApplications)
                .set({
                    paymentStatus: 'paid',
                    paymentId: result.transId || txn.echTxnId,
                    paymentDate: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(homestayApplications.id, txn.applicationId));
        }

        return {
            appRefNo: txn.appRefNo ?? '',
            action: 'verified',
            grn: result.transId,
        };
    } catch (err: any) {
        logEvent('error', 'Auto-reconciliation failed with unexpected error', { appRefNo: txn.appRefNo, err: err.message, source });
        return {
            appRefNo: txn.appRefNo ?? '',
            action: 'error',
            error: err.message,
        };
    }
}

// ─── Layer 1: Cron Job ───────────────────────────────────────────────────────

let cronIntervalHandle: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

/**
 * Run one cron cycle: find stale transactions and attempt verification.
 */
export async function runCronCycle(): Promise<void> {
    if (isRunning) {
        logEvent('debug', 'Cron cycle already running, skipping');
        return;
    }

    isRunning = true;
    const cycleStart = Date.now();

    try {
        const settings = await getReconciliationSettings();
        if (!settings.enabled) {
            logEvent('debug', 'Reconciliation disabled via settings');
            return;
        }

        // Find stale transactions: initiated/redirected, older than threshold
        const cutoff = new Date(Date.now() - settings.staleThresholdMinutes * 60_000);

        const staleTxns = await db
            .select({
                id: himkoshTransactions.id,
                appRefNo: himkoshTransactions.appRefNo,
                createdAt: himkoshTransactions.createdAt,
            })
            .from(himkoshTransactions)
            .where(
                and(
                    inArray(himkoshTransactions.transactionStatus, ['initiated', 'redirected']),
                    lte(himkoshTransactions.createdAt, cutoff),
                ),
            )
            .orderBy(desc(himkoshTransactions.createdAt))
            .limit(settings.maxBatchSize);

        if (staleTxns.length === 0) {
            logEvent('debug', 'No stale transactions to reconcile');
            return;
        }

        logEvent('info', `Cron: Found ${staleTxns.length} stale transaction(s) to check`, { count: staleTxns.length, threshold: `${settings.staleThresholdMinutes}m` });

        const results: ReconcileResult[] = [];
        for (const txn of staleTxns) {
            const result = await reconcileTransaction(txn.id, 'cron');
            results.push(result);

            // If we hit a network error (firewall), stop the batch — no point hammering
            if (result.action === 'error' && result.error?.includes('unreachable')) {
                logEvent('warn', 'Firewall detected, stopping batch early');
                break;
            }

            // Small delay between calls to avoid overwhelming HimKosh (rate limiting)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const verified = results.filter(r => r.action === 'verified').length;
        const notFound = results.filter(r => r.action === 'not_found').length;
        const errors = results.filter(r => r.action === 'error').length;

        logEvent(
            'info',
            `Cron cycle complete: ${verified} verified, ${notFound} not found, ${errors} errors`,
            { total: staleTxns.length, verified, notFound, errors, durationMs: Date.now() - cycleStart }
        );
    } catch (err) {
        logEvent('error', 'Cron cycle crashed', { err });
    } finally {
        isRunning = false;
    }
}

/**
 * Start the reconciliation cron job. Called once at server startup.
 * Safe to call multiple times — will not create duplicate intervals.
 */
export async function startReconciliationCron(): Promise<void> {
    if (cronIntervalHandle) {
        logEvent('warn', 'Cron already running, ignoring duplicate start');
        return;
    }

    const settings = await getReconciliationSettings();
    const intervalMs = settings.cronIntervalMinutes * 60_000;

    logEvent('info', '🕐 Payment reconciliation cron started', {
        intervalMinutes: settings.cronIntervalMinutes,
        staleThresholdMinutes: settings.staleThresholdMinutes,
        maxBatchSize: settings.maxBatchSize,
        enabled: settings.enabled,
    });

    // Run first cycle after a 30-second delay (let server fully start)
    setTimeout(() => {
        runCronCycle().catch(err => logEvent('error', 'Initial cron cycle failed', { err }));
    }, 30_000);

    // Schedule recurring cycles
    cronIntervalHandle = setInterval(() => {
        runCronCycle().catch(err => logEvent('error', 'Cron cycle failed', { err }));
    }, intervalMs);
}

/**
 * Stop the reconciliation cron job. Called during graceful shutdown.
 */
export function stopReconciliationCron(): void {
    if (cronIntervalHandle) {
        clearInterval(cronIntervalHandle);
        cronIntervalHandle = null;
        logEvent('info', 'Payment reconciliation cron stopped');
    }
}

// ─── Layer 2: Page-Load Reconciliation ───────────────────────────────────────

/**
 * Check if a specific application has a pending transaction that can be
 * auto-reconciled. Called when owner views their application page.
 * 
 * Returns the result if reconciliation was attempted, null if skipped.
 */
export async function reconcileOnPageLoad(
    applicationId: string,
): Promise<ReconcileResult | null> {
    try {
        const settings = await getReconciliationSettings();
        if (!settings.pageLoadEnabled) {
            return null;
        }

        // Find the latest pending transaction for this application
        const [pendingTxn] = await db
            .select({
                id: himkoshTransactions.id,
                appRefNo: himkoshTransactions.appRefNo,
                transactionStatus: himkoshTransactions.transactionStatus,
                createdAt: himkoshTransactions.createdAt,
            })
            .from(himkoshTransactions)
            .where(
                and(
                    eq(himkoshTransactions.applicationId, applicationId),
                    inArray(himkoshTransactions.transactionStatus, ['initiated', 'redirected']),
                ),
            )
            .orderBy(desc(himkoshTransactions.createdAt))
            .limit(1);

        if (!pendingTxn) {
            return null; // No pending transaction — nothing to reconcile
        }

        // Only attempt if transaction is older than threshold (avoid checking fresh ones)
        const ageMs = Date.now() - new Date(pendingTxn.createdAt!).getTime();
        const thresholdMs = settings.staleThresholdMinutes * 60_000;
        if (ageMs < thresholdMs) {
            logEvent('debug', 'Transaction too fresh for page-load check', { appRefNo: pendingTxn.appRefNo, ageMinutes: Math.round(ageMs / 60_000) });
            return null;
        }

        return await reconcileTransaction(pendingTxn.id, 'page_load');
    } catch (err) {
        logEvent('error', 'Page-load reconciliation failed', { applicationId, err });
        return null;
    }
}
