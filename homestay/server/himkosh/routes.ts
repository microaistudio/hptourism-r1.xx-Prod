import { Router, type Request } from 'express';
import { db } from '../db';
import { himkoshTransactions, homestayApplications, systemSettings, users } from '../../shared/schema';
import { HimKoshCrypto, buildRequestString, parseResponseString, buildVerificationString, verifyChallanViaSearch } from './crypto';
import { resolveHimkoshGatewayConfig } from './gatewayConfig';
import { and, desc, eq, sql, ilike, or, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { config as appConfig } from '@shared/config';
import { ensureDistrictCodeOnApplicationNumber, toHimkoshDeptRefNo } from '@shared/applicationNumber';
import { logApplicationAction } from '../audit';
import { deriveDistrictRoutingLabel } from '@shared/districtRouting';
import { logger, logPaymentTrace } from '../logger';
import { resolveDistrictDdo } from "./ddo";
import { getPaymentWorkflow, getUpfrontSubmitMode } from "../services/systemSettings";
import {
  PAYMENT_PIPELINE_PAUSE_SETTING_KEY,
  normalizePaymentPipelinePauseSetting,
  getPaymentPauseMessage
} from '@shared/appSettings';

const router = Router();
const himkoshLogger = logger.child({ module: "himkosh" });

let portalBaseColumnEnsured = false;
const ensurePortalBaseUrlColumn = async () => {
  if (portalBaseColumnEnsured) {
    return;
  }
  try {
    await db.execute(
      sql`ALTER TABLE "himkosh_transactions" ADD COLUMN IF NOT EXISTS "portal_base_url" text`,
    );
    portalBaseColumnEnsured = true;
    himkoshLogger.info("Ensured portal_base_url column exists on himkosh_transactions");
  } catch (error) {
    himkoshLogger.error({ err: error }, "Failed to ensure portal_base_url column");
  }
};

void ensurePortalBaseUrlColumn();

const crypto = new HimKoshCrypto();

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const sanitizeBaseUrl = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    const parsed = new URL(trimmed);
    return stripTrailingSlash(parsed.origin);
  } catch {
    try {
      const parsed = new URL(`https://${trimmed}`);
      return stripTrailingSlash(parsed.origin);
    } catch {
      return undefined;
    }
  }
};

const looksLocalHost = (host?: string | null) => {
  if (!host) return false;
  return /localhost|127\.|0\.0\.0\.0/i.test(host);
};

const deriveHostFromRequest = (req: Request) => {
  const hostHeader = req.get('x-forwarded-host') ?? req.get('host');
  if (!hostHeader) {
    return undefined;
  }
  const host = hostHeader.split(',')[0]?.trim();
  if (!host) {
    return undefined;
  }

  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  const rawProtocol = forwardedProto || req.protocol?.toLowerCase();
  const isLocal = looksLocalHost(host);
  let protocol: 'http' | 'https';

  if (rawProtocol === 'https') {
    protocol = 'https';
  } else if (rawProtocol === 'http') {
    protocol = isLocal ? 'http' : 'https';
  } else {
    protocol = isLocal ? 'http' : 'https';
  }

  return `${protocol}://${host}`;
};

const resolvePortalBaseUrl = (req: Request): string | undefined => {
  const bodyCandidate =
    typeof req.body === 'object' &&
      req.body !== null &&
      typeof (req.body as Record<string, unknown>).portalBaseUrl === 'string'
      ? ((req.body as Record<string, unknown>).portalBaseUrl as string)
      : undefined;

  const candidates = [
    bodyCandidate,
    req.get('origin'),
    deriveHostFromRequest(req),
    req.get('referer'),
    appConfig.frontend.baseUrl,
  ];

  for (const candidate of candidates) {
    const sanitized = sanitizeBaseUrl(candidate);
    if (sanitized) {
      return sanitized;
    }
  }

  return undefined;
};

const STATUS_META: Record<
  string,
  {
    title: string;
    description: string;
    tone: "success" | "pending" | "error";
    followUp: string;
    redirectState: "success" | "failed" | "pending";
  }
> = {
  "1": {
    title: "Payment Confirmed",
    description: "HimKosh has confirmed your payment. The HP Tourism portal will unlock your certificate momentarily.",
    tone: "success",
    followUp: "You may close this tab once the main window updates.",
    redirectState: "success",
  },
  "0": {
    title: "Payment Failed",
    description: "HimKosh reported a failure while processing the payment.",
    tone: "error",
    followUp: "If funds were deducted, note the GRN and contact support for reconciliation.",
    redirectState: "failed",
  },
  "2": {
    title: "Payment Pending",
    description: "The transaction is still being processed by HimKosh.",
    tone: "pending",
    followUp: "Keep this page open or refresh the HP Tourism portal shortly to view the latest status.",
    redirectState: "pending",
  },
};

const buildCallbackPage = (options: {
  heading: string;
  description: string;
  followUp: string;
  tone: "success" | "pending" | "error";
  applicationNumber?: string | null;
  amount?: number | null;
  reference?: string | null;
  redirectUrl?: string;
}) => {
  const toneColor =
    options.tone === "success"
      ? "#0f766e"
      : options.tone === "pending"
        ? "#ca8a04"
        : "#b91c1c";

  const toneBg =
    options.tone === "success"
      ? "#ecfdf5"
      : options.tone === "pending"
        ? "#fef9c3"
        : "#fee2e2";

  const metaRefresh = options.redirectUrl
    ? `<meta http-equiv="refresh" content="4;url=${options.redirectUrl}" />`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${options.heading}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${metaRefresh}
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(160deg, #f6faff 0%, #f1f5f9 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        color: #0f172a;
      }
      .card {
        width: min(560px, 100%);
        background: #ffffff;
        border-radius: 20px;
        padding: 32px 36px;
        box-shadow: 0 24px 48px -16px rgba(15, 23, 42, 0.25);
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: ${toneBg};
        color: ${toneColor};
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 0.85rem;
        width: fit-content;
      }
      h1 {
        font-size: clamp(1.5rem, 2vw, 1.9rem);
        margin: 0;
      }
      p {
        margin: 0;
        line-height: 1.55;
        color: #334155;
      }
      .summary {
        margin-top: 8px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
      }
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }
      .summary-item span:first-child {
        color: #475569;
      }
      .cta {
        margin-top: 18px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .cta a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 999px;
        text-decoration: none;
        background: #0f172a;
        color: #fff;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .cta small {
        color: #64748b;
        font-size: 0.8rem;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="badge">${options.heading}</span>
      <div>
        <p>${options.description}</p>
        <p>${options.followUp}</p>
      </div>
      <div class="summary">
        ${options.applicationNumber ? `<div class="summary-item"><span>Application #</span><span>${options.applicationNumber}</span></div>` : ""}
        ${options.reference ? `<div class="summary-item"><span>HimKosh Reference</span><span>${options.reference}</span></div>` : ""}
        ${options.amount !== undefined && options.amount !== null ? `<div class="summary-item"><span>Amount</span><span>₹${Number(options.amount).toLocaleString("en-IN")}</span></div>` : ""}
      </div>
      ${options.redirectUrl ? `<div class="cta">
        <a href="${options.redirectUrl}">Return to HP Tourism Portal</a>
        <small>You will be redirected automatically in a few seconds.</small>
      </div>` : ""}
    </div>
  </body>
</html>`;
};

/**
 * POST /api/himkosh/initiate
 * Initiate HimKosh payment for an application
 */
router.post('/initiate', async (req, res) => {
  try {
    const { applicationId } = req.body;

    // CRITICAL: Check Payment Pipeline Pause Setting
    const [pauseSetting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, PAYMENT_PIPELINE_PAUSE_SETTING_KEY))
      .limit(1);

    const pauseConfig = normalizePaymentPipelinePauseSetting(pauseSetting?.settingValue);

    if (pauseConfig.enabled) {
      const message = getPaymentPauseMessage(pauseConfig);
      himkoshLogger.warn({ applicationId, message }, "[himkosh] Payment blocked by pipeline pause");
      return res.status(503).json({
        error: "Payment Service Unavailable",
        message: message,
        isPaused: true
      });
    }

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    // Fetch application details
    const [application] = await db
      .select()
      .from(homestayApplications)
      .where(eq(homestayApplications.id, applicationId))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify application is ready for payment
    // 2025 Workflow: Check system setting for "Upfront Payment" mode
    const paymentWorkflow = await getPaymentWorkflow();

    // Standard statuses allowed for payment (Post-Approval)
    const isStandardPaymentStatus =
      application.status === 'payment_pending' ||
      application.status === 'verified_for_payment';

    // Draft status allowed ONLY if workflow is 'upfront'
    const isDraftPaymentAllowed =
      paymentWorkflow === 'upfront' &&
      application.status === 'draft';

    if (!isStandardPaymentStatus && !isDraftPaymentAllowed) {
      return res.status(400).json({
        error: 'Application is not ready for payment',
        currentStatus: application.status,
        workflow: paymentWorkflow
      });
    }

    // For Draft "Pay & Submit" flow: Validate that required documents are uploaded
    if (isDraftPaymentAllowed) {
      const documentsArray = application.documents;
      const hasDocuments = Array.isArray(documentsArray) && documentsArray.length > 0;

      if (!hasDocuments) {
        return res.status(400).json({
          error: 'Please upload required documents before submitting payment',
          hint: 'Go to the Documents step in your application and upload the required files.',
          currentStatus: application.status,
        });
      }
    }

    const { config } = await resolveHimkoshGatewayConfig();

    // Look up DDO code based on application's district/tehsil routing
    let ddoCode = config.ddo; // Default/fallback DDO
    let head1 = config.heads.head1; // Default/fallback Head1

    const routedDistrict =
      deriveDistrictRoutingLabel(application.district, application.tehsil) ?? application.district;
    if (routedDistrict) {
      const ddoMapping = await resolveDistrictDdo(routedDistrict, application.tehsil);

      if (ddoMapping) {
        ddoCode = ddoMapping.ddoCode;
        if (ddoMapping.head1) {
          head1 = ddoMapping.head1;
        }

        himkoshLogger.info(
          {
            ddoCode,
            head1,
            routedDistrict,
            originalDistrict: application.district,
            applicationId: application.id,
          },
          "[himkosh] Using district-specific DDO and Head",
        );
      } else {
        himkoshLogger.info(
          { routedDistrict, fallbackDdo: config.ddo, applicationId: application.id },
          "[himkosh] No DDO mapping found; using fallback",
        );
      }
    }

    // Generate unique transaction reference
    const appRefNo = `HPT${Date.now()}${nanoid(6)}`.substring(0, 20);

    // CRITICAL FIX #2: Amounts must be integers only (no decimals like 100.00)
    // DLL expects whole rupees, decimals trigger ASP.NET FormatException
    if (!application.totalFee) {
      return res.status(400).json({ error: 'Total fee not calculated for this application' });
    }
    // Determine actual amount to send
    // v1.3.0: For supplementary payments (category/term correction), send only the delta
    const rawTotalFee = Math.round(parseFloat(application.totalFee.toString()));
    const previousFee = application.previousTotalFee
      ? Math.round(parseFloat(application.previousTotalFee.toString()))
      : 0;
    const isSupplementaryPayment = previousFee > 0 && rawTotalFee > previousFee;
    let actualAmount = isSupplementaryPayment ? rawTotalFee - previousFee : rawTotalFee;

    if (isSupplementaryPayment) {
      himkoshLogger.info({
        applicationId: application.id,
        rawTotalFee,
        previousFee,
        supplementaryAmount: actualAmount,
      }, "[himkosh] Supplementary payment: charging delta only");
    }

    // Check if test payment mode is enabled
    const [testModeSetting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, 'payment_test_mode'))
      .limit(1);

    // Determine actual amount to send
    // In Test Mode, use configurable amount (default ₹1)
    const envTestOverride =
      typeof appConfig.himkosh.forceTestMode === "boolean"
        ? appConfig.himkosh.forceTestMode
        : appConfig.himkosh.testMode;

    const isTestMode =
      envTestOverride !== undefined
        ? envTestOverride
        : testModeSetting
          ? (testModeSetting.settingValue as { enabled: boolean }).enabled
          : false;

    if (isTestMode) {
      actualAmount = appConfig.himkosh.testAmount || 1; // Use configured test amount
      himkoshLogger.info({ actualAmount, isTestMode }, "[himkosh] Test mode active: Overriding amount");
    }

    // Ensure amount is integer
    actualAmount = Math.round(actualAmount);

    if (actualAmount <= 0) {
      himkoshLogger.warn({ actualAmount }, "[himkosh] Warning: Amount is 0 or negative");
      // Force to 1 if 0 to prevent failure? Or let it fail?
      // Let's force 1 if it's 0 to be safe in test mode context
      if (isTestMode && actualAmount === 0) actualAmount = 1;
    }
    // Use ₹1 for gateway if test mode is enabled, otherwise use actual amount
    const gatewayAmount = isTestMode ? 1 : actualAmount;

    if (isTestMode) {
      himkoshLogger.info(
        { applicationId: application.id, actualAmount },
        "[himkosh] Test payment mode active - overriding amount to ₹1",
      );
    }

    // Get current date in DD-MM-YYYY format (as per HP Government code)
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatDDMMYYYY = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;

    const periodFrom = formatDDMMYYYY(now);

    // Calculate periodTo based on certificateValidityYears
    // Default to 1 year if not specified
    const validityYears = application.certificateValidityYears || 1;

    // Calculate end date: Start Date + N Years - 1 Day
    // Example: 01-01-2025 + 1 Year = 01-01-2026. Minus 1 day = 31-12-2025.
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + validityYears);
    endDate.setDate(endDate.getDate() - 1);

    const periodTo = formatDDMMYYYY(endDate);

    himkoshLogger.info(
      {
        applicationId: application.id,
        validityYears,
        periodFrom,
        periodTo
      },
      "[himkosh] Calculated payment period"
    );

    const resolvedPortalBase = resolvePortalBaseUrl(req);
    const trimmedPortalBase = resolvedPortalBase ? stripTrailingSlash(resolvedPortalBase) : undefined;
    const fallbackPortalBase =
      sanitizeBaseUrl(appConfig.frontend.baseUrl) ||
      sanitizeBaseUrl(config.returnUrl) ||
      sanitizeBaseUrl(deriveHostFromRequest(req));

    const portalBaseForStorage = trimmedPortalBase || fallbackPortalBase;

    let callbackUrl = config.returnUrl;
    if (trimmedPortalBase) {
      callbackUrl = `${trimmedPortalBase}/api/himkosh/callback`;
    } else if (!callbackUrl && portalBaseForStorage) {
      callbackUrl = `${portalBaseForStorage}/api/himkosh/callback`;
    }

    if (trimmedPortalBase) {
      himkoshLogger.info({ callbackUrl }, "[himkosh] Using dynamic callback URL derived from request");
    } else if (callbackUrl) {
      himkoshLogger.info({ callbackUrl }, "[himkosh] Using configured callback URL");
    } else {
      himkoshLogger.warn(
        { applicationId: application.id },
        "[himkosh] No callback URL resolved; HimKosh response redirects may fail",
      );
    }

    // Build request parameters
    // CRITICAL: Government code ALWAYS includes Head2/Amount2 (even if 0)
    const deptRefNo = toHimkoshDeptRefNo(
      ensureDistrictCodeOnApplicationNumber(
        application.applicationNumber,
        application.district,
      )
    );

    const requestParams: {
      deptId: string;
      deptRefNo: string;
      totalAmount: number;
      tenderBy: string;
      appRefNo: string;
      head1: string;
      amount1: number;
      ddo: string;
      periodFrom: string;
      periodTo: string;
      head2?: string;
      amount2?: number;
      serviceCode?: string;
      returnUrl?: string;
    } = {
      deptId: config.deptId,
      deptRefNo,
      totalAmount: gatewayAmount, // Use gateway amount (₹1 in test mode)
      tenderBy: application.ownerName,
      appRefNo,
      head1: config.heads.registrationFee,
      amount1: gatewayAmount, // Use gateway amount (₹1 in test mode)
      ddo: ddoCode,
      periodFrom: periodFrom,
      periodTo: periodTo,
      serviceCode: config.serviceCode,
      returnUrl: callbackUrl,
    };

    // Optional secondary head support – only include when configured with a positive amount.
    const secondaryHead = config.heads.secondaryHead;
    const secondaryAmountRaw = Number(config.heads.secondaryHeadAmount ?? 0);
    if (secondaryHead && secondaryAmountRaw > 0) {
      requestParams.head2 = secondaryHead;
      requestParams.amount2 = Math.round(secondaryAmountRaw);

      // CRITICAL FIX: Add secondary amount to TotalAmount to prevent mismatch
      // Even in test mode, the Gateway expects Total = Sum(Heads)
      requestParams.totalAmount += requestParams.amount2;
    }

    // Build request strings (core for checksum, full for encryption)
    const { coreString, fullString } = buildRequestString(requestParams);

    // CRITICAL FIX: Calculate checksum ONLY on core string (excludes Service_code and return_url)
    // Per NIC-HP: checksum calculated before appending Service_code/return_url
    const checksum = HimKoshCrypto.generateChecksum(coreString);

    // Append checksum to FULL string (includes Service_code and return_url)
    const requestStringWithChecksum = `${fullString}|checkSum=${checksum}`;

    // Encrypt the ENTIRE string including Service_code, return_url, and checksum
    const encryptedData = await crypto.encrypt(requestStringWithChecksum);

    // Debug: Log values to identify which field is too long
    logPaymentTrace("[himkosh] Transaction values", {
      merchantCode: config.merchantCode,
      merchantCodeLen: config.merchantCode?.length,
      deptId: config.deptId,
      deptIdLen: config.deptId?.length,
      serviceCode: config.serviceCode,
      serviceCodeLen: config.serviceCode?.length,
      ddo: ddoCode,
      ddoLen: ddoCode?.length,
      head1: config.heads.registrationFee,
      head1Len: config.heads.registrationFee?.length,
    });

    // Debug: Log encryption details
    logPaymentTrace("[himkosh-encryption] Payload preview", {
      coreString,
      fullString,
      checksum,
      requestStringWithChecksum,
      requestStringLength: requestStringWithChecksum.length,
      encryptedLength: encryptedData.length,
    });

    // Save transaction to database (store gateway amount that was actually sent)
    await ensurePortalBaseUrlColumn();
    await db.insert(himkoshTransactions).values({
      applicationId,
      deptRefNo,
      appRefNo,
      totalAmount: gatewayAmount, // Store what was sent to gateway
      tenderBy: application.ownerName,
      merchantCode: config.merchantCode,
      deptId: config.deptId,
      serviceCode: config.serviceCode,
      ddo: ddoCode,
      head1: config.heads.registrationFee,
      amount1: gatewayAmount, // Store what was sent to gateway
      head2: requestParams.head2,
      amount2: requestParams.amount2,
      periodFrom: periodFrom,
      periodTo: periodTo,
      encryptedRequest: encryptedData,
      requestChecksum: checksum,
      portalBaseUrl: portalBaseForStorage ?? null,
      transactionStatus: 'initiated',
    });

    // Return payment initiation data
    const response = {
      success: true,
      paymentUrl: config.paymentUrl,
      merchantCode: config.merchantCode,
      encdata: encryptedData,
      checksum: checksum, // CRITICAL: Send checksum separately (NOT encrypted)
      appRefNo,
      totalAmount: gatewayAmount, // Gateway amount (₹1 in test mode)
      actualAmount, // Actual calculated fee (for display purposes)
      isTestMode, // Flag to indicate test mode
      isConfigured: config.isConfigured,
      configStatus: (config as any).configStatus || 'production',
      message: isTestMode
        ? `🧪 Test mode active: Gateway receives ₹${gatewayAmount.toLocaleString('en-IN')}`
        : 'Payment initiated successfully.',
    };

    logPaymentTrace("[himkosh] Response metadata", {
      isConfigured: config.isConfigured,
      isTestMode,
      appRefNo,
    });
    res.json(response);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "HimKosh initiation error");
    res.status(500).json({
      error: 'Failed to initiate payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/himkosh/callback
 * HimKosh occasionally performs a GET redirect before POSTing the encrypted payload.
 * Respond with a friendly holding page so users do not see a 404.
 */
router.get('/callback', (_req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>HimKosh Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f5f7fb; margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; color:#0f172a; }
          .card { background:#fff; border-radius:16px; padding:32px; box-shadow:0 20px 45px rgba(15,23,42,0.12); max-width:420px; text-align:center; }
          h1 { font-size:1.5rem; margin-bottom:0.5rem; }
          p { margin:0.25rem 0; color:#334155; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Processing Payment</h1>
          <p>HimKosh is completing your transaction and will return you to the HP Tourism portal automatically.</p>
          <p>You can safely close this tab once the confirmation appears in the main window.</p>
        </div>
      </body>
    </html>
  `);
});

/**
 * POST /api/himkosh/callback
 * Handle payment response callback from CTP
 */
router.post('/callback', async (req, res) => {
  try {
    const { config } = await resolveHimkoshGatewayConfig();
    const { encdata } = req.body;

    if (!encdata) {
      return res.status(400).send('Missing payment response data');
    }

    // Decrypt response
    const decryptedData = await crypto.decrypt(encdata);

    const checksumMatch = decryptedData.match(/\|checksum=([0-9a-fA-F]+)/i);
    if (!checksumMatch || checksumMatch.index === undefined) {
      himkoshLogger.error(
        { decryptedData },
        "HimKosh callback: checksum token missing",
      );
      return res.status(400).send('Invalid checksum payload');
    }

    const dataWithoutChecksum = decryptedData.slice(0, checksumMatch.index);
    const receivedChecksum = checksumMatch[1];
    const isValid = HimKoshCrypto.verifyChecksum(dataWithoutChecksum, receivedChecksum);
    const parsedResponse = parseResponseString(decryptedData);

    if (!isValid) {
      himkoshLogger.error(
        { dataWithoutChecksum, receivedChecksum, parsedResponse },
        "HimKosh callback: Checksum verification failed",
      );
      return res.status(400).send('Invalid checksum');
    }

    // Find transaction
    const [transaction] = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.appRefNo, parsedResponse.appRefNo))
      .limit(1);

    if (!transaction) {
      himkoshLogger.error(
        { appRefNo: parsedResponse.appRefNo },
        "HimKosh callback: Transaction not found",
      );
      return res.status(404).send('Transaction not found');
    }

    // ── ATOMIC PAYMENT PROCESSING ──────────────────────────────────────────
    // Wrap transaction-record + application-record updates in a DB transaction.
    // This ensures both succeed or both roll back, preventing "orphaned" payments
    // where HimKosh shows success but the application has no paymentId link.
    //
    // ROOT CAUSE FIX: Previously these were two independent writes. If the server
    // died (restart, OOM, timeout) between them, the himkosh_transactions record
    // got statusCd='1' but homestay_applications.paymentId remained null.
    // ─────────────────────────────────────────────────────────────────────────

    // Helper to parse DDMMYYYYHHMMSS or DD-MM-YYYY format (defined outside transaction)
    const parsePaymentDate = (dateStr: string | null | undefined): Date => {
      if (!dateStr) return new Date();
      const cleaned = dateStr.trim();
      if (/^\d{14}$/.test(cleaned)) {
        const day = parseInt(cleaned.substring(0, 2), 10);
        const month = parseInt(cleaned.substring(2, 4), 10) - 1;
        const year = parseInt(cleaned.substring(4, 8), 10);
        const dt = new Date(year, month, day);
        return isNaN(dt.getTime()) ? new Date() : dt;
      }
      const parts = cleaned.split(/[-/]/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].substring(0, 4), 10);
        const dt = new Date(year, month, day);
        return isNaN(dt.getTime()) ? new Date() : dt;
      }
      return new Date();
    };

    await db.transaction(async (tx) => {
      // Step 1: Update transaction record with HimKosh response
      await tx
        .update(himkoshTransactions)
        .set({
          echTxnId: parsedResponse.echTxnId,
          bankCIN: parsedResponse.bankCIN,
          bankName: parsedResponse.bankName,
          paymentDate: parsedResponse.paymentDate || null,
          status: parsedResponse.status,
          statusCd: parsedResponse.statusCd,
          responseChecksum: parsedResponse.checksum,
          transactionStatus: parsedResponse.statusCd === '1' ? 'success' : 'failed',
          respondedAt: new Date(),
          challanPrintUrl: parsedResponse.statusCd === '1'
            ? `${config.challanPrintUrl}?reportName=PaidChallan&TransId=${parsedResponse.echTxnId}`
            : undefined,
        })
        .where(eq(himkoshTransactions.id, transaction.id));

      // Step 2: If payment successful, update application (SAME transaction)
      if (parsedResponse.statusCd === '1') {
        const [currentApplication] = await tx
          .select()
          .from(homestayApplications)
          .where(eq(homestayApplications.id, transaction.applicationId))
          .limit(1);

        // CASE 1: Pay & Submit (Draft -> Submitted) or Pay First -> await manual submit
        if (currentApplication?.status === 'draft') {
          const submitMode = await getUpfrontSubmitMode();
          const now = new Date();

          const targetStatus = submitMode === "auto" ? "submitted" : "paid_pending_submit";
          const feedbackMessage = submitMode === "auto"
            ? `Registration fee paid via HimKosh (CIN: ${parsedResponse.echTxnId ?? "N/A"}). Application submitted.`
            : `Registration fee paid via HimKosh (CIN: ${parsedResponse.echTxnId ?? "N/A"}). Awaiting manual submission.`;

          await tx
            .update(homestayApplications)
            .set({
              status: targetStatus,
              paymentStatus: 'paid',
              paymentId: parsedResponse.echTxnId,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: parsePaymentDate(parsedResponse.paymentDate),
              submittedAt: submitMode === "auto" ? now : null,
              updatedAt: now,
              formCompletionTimeSeconds: (() => {
                if (currentApplication.createdAt && submitMode === "auto") {
                  const createdMs = new Date(currentApplication.createdAt).getTime();
                  const nowMs = now.getTime();
                  const diff = Math.round((nowMs - createdMs) / 1000);
                  return (diff > 0 && diff < 2000000000) ? diff : 0;
                }
                return undefined;
              })(),
            })
            .where(eq(homestayApplications.id, transaction.applicationId));

          await logApplicationAction({
            applicationId: transaction.applicationId,
            actorId: currentApplication.userId,
            action: "payment_verified",
            previousStatus: "draft",
            newStatus: targetStatus,
            feedback: feedbackMessage,
          });

          // Sync documents (non-critical, outside the DB transaction boundary)
          if (targetStatus === "submitted") {
            // Defer doc sync to after transaction commits (best-effort)
            setTimeout(async () => {
              try {
                const { storage } = await import('../storage');
                if (storage.syncDocumentsFromJsonb) {
                  const syncCount = await storage.syncDocumentsFromJsonb(transaction.applicationId);
                  himkoshLogger.info(
                    { applicationId: transaction.applicationId, syncCount },
                    "Synced documents from JSONB to table on submission"
                  );
                }
              } catch (syncError) {
                himkoshLogger.error(
                  { err: syncError, applicationId: transaction.applicationId },
                  "Failed to sync documents from JSONB"
                );
              }
            }, 100);
          }

        } else if (currentApplication?.status === 'payment_pending') {
          // CASE 2: Supplementary Payment received for payment_pending application.
          // ──────────────────────────────────────────────────────────────────────
          // BUG FIX (v1.3.3): Previously this auto-approved ALL payment_pending
          // applications with a certificate. This caused new applications (HP-HS-*)
          // to skip DTDO inspection entirely when paying a supplementary fee
          // (e.g. 1-year → 3-year upgrade). Now we differentiate:
          //   • Legacy RC (LG-HS-*): Auto-approve + issue certificate (already
          //     inspected in real life, just paying digital onboarding fee)
          //   • New applications (HP-HS-*): Route back to dtdo_review so the
          //     DTDO can conduct inspection before approving
          // ──────────────────────────────────────────────────────────────────────
          const isLegacyRC = currentApplication.applicationNumber?.startsWith('LG-HS-');
          const now = new Date();

          const actorId =
            currentApplication?.dtdoId ??
            currentApplication?.daId ??
            currentApplication?.userId ??
            null;

          if (isLegacyRC) {
            // Legacy RC: Auto-approve with certificate (existing behavior)
            const year = now.getFullYear();
            const randomSuffix = Math.floor(10000 + Math.random() * 90000);
            const certificateNumber = `HP-HST-${year}-${randomSuffix}`;

            const issueDate = now;
            const expiryDate = new Date(issueDate);
            const validityYears = currentApplication.certificateValidityYears || 1;
            expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);
            const formatTimelineDate = (value: Date) =>
              value.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

            await tx
              .update(homestayApplications)
              .set({
                status: 'approved',
                paymentStatus: 'paid',
                paymentId: parsedResponse.echTxnId,
                paymentAmount: transaction.totalAmount?.toString(),
                paymentDate: parsePaymentDate(parsedResponse.paymentDate),
                certificateNumber,
                certificateIssuedDate: issueDate,
                certificateExpiryDate: expiryDate,
                approvedAt: issueDate,
                updatedAt: issueDate,
              })
              .where(eq(homestayApplications.id, transaction.applicationId));

            // Supersede parent app if this was a service request
            if (currentApplication.parentApplicationId) {
              await tx
                .update(homestayApplications)
                .set({
                  status: 'superseded',
                  districtNotes: `Superseded by application ${currentApplication.applicationNumber}`
                })
                .where(eq(homestayApplications.id, currentApplication.parentApplicationId));
            }

            if (actorId) {
              await logApplicationAction({
                applicationId: transaction.applicationId,
                actorId,
                action: "payment_verified",
                previousStatus: currentApplication?.status ?? null,
                newStatus: "approved",
                feedback: `HimKosh payment confirmed (CIN: ${parsedResponse.echTxnId ?? "N/A"})`,
              });
              await logApplicationAction({
                applicationId: transaction.applicationId,
                actorId,
                action: "certificate_issued",
                previousStatus: "approved",
                newStatus: "approved",
                feedback: `Certificate ${certificateNumber} issued on ${formatTimelineDate(issueDate)} (valid till ${formatTimelineDate(
                  expiryDate,
                )})`,
              });
            }
          } else {
            // New application (HP-HS-*): Route back to DTDO for inspection
            await tx
              .update(homestayApplications)
              .set({
                status: 'dtdo_review',
                paymentStatus: 'paid',
                paymentId: parsedResponse.echTxnId,
                paymentAmount: transaction.totalAmount?.toString(),
                paymentDate: parsePaymentDate(parsedResponse.paymentDate),
                updatedAt: now,
              })
              .where(eq(homestayApplications.id, transaction.applicationId));

            if (actorId) {
              await logApplicationAction({
                applicationId: transaction.applicationId,
                actorId,
                action: "payment_verified",
                previousStatus: currentApplication?.status ?? null,
                newStatus: "dtdo_review",
                feedback: `Supplementary HimKosh payment confirmed (CIN: ${parsedResponse.echTxnId ?? "N/A"}). Routed to DTDO for inspection.`,
              });
            }

            himkoshLogger.info(
              { appRefNo: parsedResponse.appRefNo, applicationId: transaction.applicationId, applicationNumber: currentApplication.applicationNumber },
              'New application supplementary payment received — routed to dtdo_review (not auto-approved)',
            );
          }
        } else {
          // CASE 3: App already in a forwarded state (submitted, under_scrutiny, etc.)
          // Still link the payment so dashboards show correct status
          const now = new Date();
          await tx
            .update(homestayApplications)
            .set({
              paymentStatus: 'paid',
              paymentId: parsedResponse.echTxnId,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: parsePaymentDate(parsedResponse.paymentDate),
              updatedAt: now,
            })
            .where(eq(homestayApplications.id, transaction.applicationId));

          himkoshLogger.info(
            { appRefNo: parsedResponse.appRefNo, applicationId: transaction.applicationId, currentStatus: currentApplication?.status, grn: parsedResponse.echTxnId },
            'Callback: App already in terminal state — paymentStatus set to paid (no status change)',
          );
        }
      }
    }); // END db.transaction

    const statusCode = parsedResponse.statusCd ?? parsedResponse.status ?? "";
    const meta = STATUS_META[statusCode] ?? {
      title: "Payment Status Received",
      description: parsedResponse.status
        ? `Gateway reported status: ${parsedResponse.status} `
        : "The payment response was received from HimKosh.",
      tone: statusCode === "1" ? "success" : statusCode === "2" ? "pending" : "error",
      followUp: "Review the details below and return to the portal.",
      redirectState: statusCode === "1" ? "success" : statusCode === "2" ? "pending" : "failed",
    };

    const portalBase =
      sanitizeBaseUrl(transaction.portalBaseUrl) ||
      resolvePortalBaseUrl(req) ||
      sanitizeBaseUrl(appConfig.frontend.baseUrl) ||
      sanitizeBaseUrl(config.returnUrl) ||
      sanitizeBaseUrl(`${req.protocol}://${req.get("host") ?? ""}`);
    const trimmedBase = portalBase ? stripTrailingSlash(portalBase) : undefined;

    const redirectPath =
      meta.redirectState === "success"
        ? `/dashboard?payment=${meta.redirectState}&application=${transaction.applicationId}&appNo=${transaction.deptRefNo ?? ""}&flow=himkosh_callback`
        : `/applications/${transaction.applicationId}?payment=${meta.redirectState}&himgrn=${parsedResponse.echTxnId ?? ""}`;

    const redirectUrl = trimmedBase ? `${trimmedBase}${redirectPath}` : undefined;

    const html = buildCallbackPage({
      heading: meta.title,
      description: meta.description,
      followUp: meta.followUp,
      tone: meta.tone,
      applicationNumber: transaction.deptRefNo,
      amount: transaction.totalAmount,
      reference: parsedResponse.echTxnId,
      redirectUrl,
    });

    res.status(200).send(html);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "HimKosh callback error");
    res.status(500).send(`Payment processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
});

/**
 * POST /api/himkosh/verify/:appRefNo
 * Double verification of transaction via SearchChallan scraping.
 * AppVerification.aspx is undocumented and returns "checksum mismatch" for all tested formats.
 * Instead, we use the public SearchChallan.aspx page to confirm the transaction status.
 */
router.post('/verify/:appRefNo', async (req, res) => {
  try {
    const { appRefNo } = req.params;
    const { config } = await resolveHimkoshGatewayConfig();

    // Find transaction in our DB
    const [transaction] = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.appRefNo, appRefNo))
      .limit(1);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Determine date range for search
    // Use the transaction's initiation date as the base
    const txnDate = transaction.respondedAt ?? transaction.initiatedAt ?? transaction.createdAt;
    const dateObj = txnDate ? new Date(txnDate) : new Date();
    const formatDate = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };
    // Search from 1 day before to 1 day after for safety
    const fromDate = new Date(dateObj);
    fromDate.setDate(fromDate.getDate() - 1);
    const toDate = new Date(dateObj);
    toDate.setDate(toDate.getDate() + 1);

    // Get TenderBy from the original request
    const tenderBy = transaction.tenderBy ?? 'Chamba Main';

    const searchUrl = config.searchChallanUrl
      ?? 'https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx';

    himkoshLogger.info(
      {
        appRefNo,
        echTxnId: transaction.echTxnId ?? 'UNKNOWN',
        tenderBy,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      },
      'Verifying transaction via SearchChallan',
    );

    const result = await verifyChallanViaSearch({
      searchUrl,
      tenderBy,
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      echTxnId: transaction.echTxnId ?? '', // empty string triggers appRefNo-based search
      appRefNo,
    });

    himkoshLogger.info({ appRefNo, result }, 'SearchChallan verification result');

    // Build verification data compatible with our existing schema
    const verificationData: Record<string, string> = {
      TXN_STAT: result.isSuccess ? '1' : '0',
      himgrn: result.transId,
      receipt_no: result.receiptNo,
      status: result.status,
      tender_by: result.tenderBy,
      service: result.service,
      amount: result.amount,
      receipt_date: result.receiptDate,
      verified_via: 'SearchChallan',
      dept_ref_no: result.deptRefNo,
      found: result.found ? 'true' : 'false',
    };

    // Update transaction — recover echTxnId if it was missing (broken mid-flow)
    const recoveredFields: Record<string, any> = {
      isDoubleVerified: true,
      doubleVerificationDate: new Date(),
      doubleVerificationData: verificationData,
      verifiedAt: new Date(),
    };
    if (result.isSuccess) {
      recoveredFields.transactionStatus = 'verified';
    }
    // If we didn't have an echTxnId before (broken transaction), recover it
    if (!transaction.echTxnId && result.transId) {
      recoveredFields.echTxnId = result.transId;
      recoveredFields.respondedAt = new Date();
      recoveredFields.transactionStatus = result.isSuccess ? 'success' : 'failed';
      recoveredFields.statusCd = result.isSuccess ? '1' : '0';
      himkoshLogger.info(
        { appRefNo, recoveredEchTxnId: result.transId },
        'Recovered missing echTxnId from SearchChallan (broken mid-flow transaction)',
      );
    }
    await db
      .update(himkoshTransactions)
      .set(recoveredFields)
      .where(eq(himkoshTransactions.id, transaction.id));

    // BRIDGE LOGIC: Update Application Status if Verified
    if (result.isSuccess) {
      const [app] = await db
        .select()
        .from(homestayApplications)
        .where(eq(homestayApplications.id, transaction.applicationId))
        .limit(1);

      if (app) {
        // CASE 1: Pay & Submit (Draft -> Submitted)
        if (app.status === 'draft') {
          const now = new Date();
          await db
            .update(homestayApplications)
            .set({
              status: 'submitted',
              paymentStatus: 'paid',
              paymentId: transaction.echTxnId ?? result.transId,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: now,
              submittedAt: now,
              updatedAt: now,
              formCompletionTimeSeconds: (() => {
                if (app.createdAt) {
                  const createdMs = new Date(app.createdAt).getTime();
                  const nowMs = now.getTime();
                  const diff = Math.round((nowMs - createdMs) / 1000);
                  return (diff > 0 && diff < 2000000000) ? diff : 0;
                }
                return undefined;
              })(),
            })
            .where(eq(homestayApplications.id, app.id));

          await logApplicationAction({
            applicationId: app.id,
            actorId: app.userId,
            action: "payment_verified",
            previousStatus: "draft",
            newStatus: "submitted",
            feedback: `Payment double-verified via HimKosh SearchChallan (HIMGRN: ${result.transId}).`,
          });

          // Sync documents
          try {
            const { storage } = await import('../storage');
            if (storage.syncDocumentsFromJsonb) {
              await storage.syncDocumentsFromJsonb(app.id);
            }
          } catch (e) { }
        }
        // CASE 2: Payment Pending — differentiate Legacy RC vs New Application (v1.3.3 fix)
        else if (app.status === 'payment_pending') {
          const now = new Date();
          const isLegacyRC = app.applicationNumber?.startsWith('LG-HS-');
          // New apps go to dtdo_review for inspection; Legacy RC goes to submitted
          const targetStatus = isLegacyRC ? 'submitted' : 'dtdo_review';

          await db
            .update(homestayApplications)
            .set({
              status: targetStatus,
              paymentStatus: 'paid',
              paymentId: transaction.echTxnId ?? result.transId,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: now,
              updatedAt: now,
            })
            .where(eq(homestayApplications.id, app.id));

          await logApplicationAction({
            applicationId: app.id,
            actorId: app.userId,
            action: "payment_verified",
            previousStatus: "payment_pending",
            newStatus: targetStatus,
            feedback: `Payment double-verified via HimKosh SearchChallan (HIMGRN: ${result.transId}).${isLegacyRC ? '' : ' Routed to DTDO for inspection.'}`,
          });
        }
        else {
          // App is already in a forwarded/terminal state (submitted, under_scrutiny, etc.)
          // Still update paymentStatus to 'paid' so dashboards stay in sync
          const now = new Date();
          await db
            .update(homestayApplications)
            .set({
              paymentStatus: 'paid',
              paymentId: transaction.echTxnId ?? result.transId,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: now,
              updatedAt: now,
            })
            .where(eq(homestayApplications.id, app.id));

          himkoshLogger.info(
            { appRefNo: transaction.appRefNo, applicationId: app.id, currentStatus: app.status, grn: result.transId, method: 'auto-verify' },
            'Auto-verify: App in terminal state — paymentStatus set to paid (no status change)',
          );
        }
      }
    }

    res.json({
      success: true,
      verified: result.isSuccess,
      found: result.found,
      data: verificationData,
    });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, appRefNo: req.params?.appRefNo }, "HimKosh verification error");
    res.status(500).json({
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/himkosh/verify/:appRefNo/manual
 * Manual (browser-based) verification of transaction.
 * Used when the server cannot reach HimKosh directly (e.g., no outbound internet on PROD).
 * The admin opens SearchChallan in their browser, finds the GRN, and enters it here.
 */
router.post('/verify/:appRefNo/manual', async (req, res) => {
  try {
    const { appRefNo } = req.params;
    const { echTxnId, receiptNo, status, verified } = req.body;
    const adminUserId = req.session?.userId ?? null;

    if (!appRefNo) {
      return res.status(400).json({ error: 'appRefNo is required' });
    }

    // Find transaction
    const [transaction] = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.appRefNo, appRefNo))
      .limit(1);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const isVerified = verified === true;
    const grn = (echTxnId || '').trim();

    // Build verification data
    const verificationData: Record<string, string> = {
      TXN_STAT: isVerified ? '1' : '0',
      himgrn: grn,
      receipt_no: (receiptNo || '').trim(),
      status: (status || (isVerified ? 'Success' : 'Not Found')).trim(),
      verified_via: 'ManualBrowserCheck',
      verified_by: adminUserId ?? 'unknown',
      verified_at: new Date().toISOString(),
    };

    // Update transaction
    const updateFields: Record<string, any> = {
      isDoubleVerified: true,
      doubleVerificationDate: new Date(),
      doubleVerificationData: verificationData,
      verifiedAt: new Date(),
    };

    if (isVerified && grn) {
      // Always ensure echTxnId, statusCd, AND transactionStatus are set correctly
      updateFields.echTxnId = grn;
      updateFields.respondedAt = new Date();
      updateFields.statusCd = '1';
      updateFields.transactionStatus = 'success';  // FIX: Was missing! Reports/Him-Darshan filter on this
      updateFields.bankName = 'Manual';  // Indicate manual verification in the bank field
      if (receiptNo) {
        updateFields.bankCIN = receiptNo;
      }

      himkoshLogger.info(
        { appRefNo, recoveredEchTxnId: grn, method: 'manual' },
        'Set echTxnId via manual browser verification',
      );
    } else {
      updateFields.transactionStatus = isVerified ? 'success' : 'failed';
    }

    await db
      .update(himkoshTransactions)
      .set(updateFields)
      .where(eq(himkoshTransactions.id, transaction.id));

    // BRIDGE LOGIC: Update Application Status if verified with GRN
    if (isVerified && grn) {
      const [app] = await db
        .select()
        .from(homestayApplications)
        .where(eq(homestayApplications.id, transaction.applicationId))
        .limit(1);

      if (app) {
        const now = new Date();
        const terminalStates = new Set(['approved', 'rejected', 'superseded', 'submitted']);

        // Only update if the app is NOT already in a terminal/forwarded state
        if (!terminalStates.has(app.status ?? '')) {
          // CASE 1: Pay & Submit (draft, or any pre-submission state -> Submitted)
          if (['draft', 'initiated', 'incomplete'].includes(app.status ?? '')) {
            await db
              .update(homestayApplications)
              .set({
                status: 'submitted',
                paymentStatus: 'paid',
                paymentId: grn,
                paymentAmount: transaction.totalAmount?.toString(),
                paymentDate: now,
                submittedAt: now,
                updatedAt: now,
              })
              .where(eq(homestayApplications.id, app.id));

            await logApplicationAction({
              applicationId: app.id,
              actorId: adminUserId ?? app.userId,
              action: "payment_verified",
              previousStatus: app.status ?? "draft",
              newStatus: "submitted",
              feedback: `Payment manually verified via browser (HIMGRN: ${grn}).`,
            });

            himkoshLogger.info(
              { appRefNo, applicationId: app.id, grn, previousStatus: app.status, method: 'manual' },
              'Manual verification: Application -> Submitted',
            );
          }

          // CASE 2: On-Approval Payment — differentiate Legacy RC vs New Application (v1.3.3 fix)
          if (app.status === 'payment_pending') {
            const isLegacyRC = app.applicationNumber?.startsWith('LG-HS-');
            // New apps go to dtdo_review for inspection; Legacy RC auto-approves
            const targetStatus = isLegacyRC ? 'approved' : 'dtdo_review';

            await db
              .update(homestayApplications)
              .set({
                status: targetStatus,
                paymentStatus: 'paid',
                paymentId: grn,
                paymentAmount: transaction.totalAmount?.toString(),
                paymentDate: now,
                ...(isLegacyRC ? { approvedAt: now } : {}),
                updatedAt: now,
              })
              .where(eq(homestayApplications.id, app.id));

            await logApplicationAction({
              applicationId: app.id,
              actorId: adminUserId ?? app.userId,
              action: "payment_verified",
              previousStatus: "payment_pending",
              newStatus: targetStatus,
              feedback: `Payment manually verified via browser (HIMGRN: ${grn}).${isLegacyRC ? '' : ' Routed to DTDO for inspection.'}`,
            });

            himkoshLogger.info(
              { appRefNo, applicationId: app.id, grn, isLegacyRC, targetStatus, method: 'manual' },
              `Manual verification: payment_pending -> ${targetStatus}`,
            );
          }
        } else {
          // App is already in a forwarded/terminal state (submitted, under_scrutiny, etc.)
          // Still update paymentStatus to 'paid' so dashboards stay in sync
          // This eliminates the need for a separate Step B script
          const now = new Date();
          await db
            .update(homestayApplications)
            .set({
              paymentStatus: 'paid',
              paymentId: grn,
              paymentAmount: transaction.totalAmount?.toString(),
              paymentDate: now,
              updatedAt: now,
            })
            .where(eq(homestayApplications.id, app.id));

          himkoshLogger.info(
            { appRefNo, applicationId: app.id, currentStatus: app.status, grn, method: 'manual' },
            'Manual verification: App in terminal state — paymentStatus set to paid (no status change)',
          );
        }
      }
    }

    himkoshLogger.info(
      { appRefNo, isVerified, grn, adminUserId, method: 'manual' },
      'Manual browser-based verification completed',
    );

    res.json({
      success: true,
      verified: isVerified,
      data: verificationData,
    });
  } catch (error) {
    // Handle duplicate GRN error gracefully
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errMsg.includes('unique') || errMsg.includes('duplicate')) {
      return res.status(409).json({
        error: 'GRN already exists',
        details: 'This GRN/HIMGRN is already assigned to another transaction. Please check you are verifying the correct transaction.',
      });
    }
    himkoshLogger.error({ err: error, route: req.path, appRefNo: req.params?.appRefNo }, "Manual verification error");
    res.status(500).json({
      error: 'Manual verification failed',
      details: errMsg,
    });
  }
});

/**
 * GET /api/himkosh/transactions
 * Get all HimKosh transactions (admin only)
 */
router.get('/transactions', async (req, res) => {
  try {
    const limitParam = parseInt(String(req.query?.limit ?? ""), 10);
    const offsetParam = parseInt(String(req.query?.offset ?? ""), 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
    const offset = Number.isFinite(offsetParam) ? Math.max(offsetParam, 0) : 0;

    // By default, exclude TEST- prefixed transactions (from Test Runner)
    const excludeTestParam = String(req.query?.excludeTest ?? "true").toLowerCase();
    const excludeTest = excludeTestParam !== "false";

    // DDO filter
    const ddoFilter = req.query?.ddo as string | undefined;

    // Status filter (e.g., 'initiated', 'redirected', 'success', 'failed', 'verified')
    const statusFilter = req.query?.status as string | undefined;

    // Build where conditions - join with applications to check REAL applicationNumber
    const conditions = [eq(himkoshTransactions.isArchived, false)];
    if (excludeTest) {
      // Filter by actual application number (TEST- prefix), not deptRefNo (which gets transformed)
      // With LEFT JOIN, applicationNumber could be NULL - those are also excluded (orphaned transactions)
      conditions.push(sql`(${homestayApplications.applicationNumber} IS NULL OR ${homestayApplications.applicationNumber} NOT LIKE 'TEST-%')`);
    }
    if (ddoFilter && ddoFilter !== 'all') {
      conditions.push(eq(himkoshTransactions.ddo, ddoFilter));
    }
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'missing_link') {
        conditions.push(
          sql`${and(
            or(
              eq(himkoshTransactions.transactionStatus, 'success'),
              eq(himkoshTransactions.transactionStatus, 'verified'),
              eq(himkoshTransactions.statusCd, '1')
            ),
            isNull(homestayApplications.paymentId)
          )}`
        );
      } else {
        conditions.push(eq(himkoshTransactions.transactionStatus, statusFilter));
      }
    }

    // Search filter across multiple fields
    const searchFilter = req.query?.search as string | undefined;
    if (searchFilter && searchFilter.trim()) {
      const searchTerm = `%${searchFilter.trim()}%`;
      conditions.push(
        sql`${or(
          ilike(himkoshTransactions.appRefNo, searchTerm),
          ilike(himkoshTransactions.deptRefNo, searchTerm),
          ilike(himkoshTransactions.echTxnId, searchTerm),
          ilike(himkoshTransactions.tenderBy, searchTerm),
          ilike(homestayApplications.propertyName, searchTerm),
          ilike(homestayApplications.ownerName, searchTerm),
          ilike(homestayApplications.applicationNumber, searchTerm)
        )}`
      );
    }

    const whereClause = and(...conditions);

    const [countResult] = await db
      .select({ count: sql<string>`count(*)` })
      .from(himkoshTransactions)
      .leftJoin(
        homestayApplications,
        eq(himkoshTransactions.applicationId, homestayApplications.id)
      )
      .where(whereClause);

    // Query transactions with left join to get district, then flatten the result
    const rawTransactions = await db
      .select()
      .from(himkoshTransactions)
      .leftJoin(
        homestayApplications,
        eq(himkoshTransactions.applicationId, homestayApplications.id)
      )
      .where(whereClause)
      .orderBy(desc(himkoshTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    // Flatten the join result to add applicationDistrict to each transaction
    const transactions = rawTransactions.map(row => ({
      ...row.himkosh_transactions,
      applicationDistrict: row.homestay_applications?.district ?? null,
      applicationNumber: row.homestay_applications?.applicationNumber ?? null,
      propertyName: row.homestay_applications?.propertyName ?? null,
    }));

    res.json({
      transactions,
      total: Number(countResult?.count ?? 0),
      limit,
      offset,
      excludeTest,
    });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, errorDetails: String(error) }, "Error fetching transactions");
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * POST /api/himkosh/transactions/clear
 * Clear or Delete logs (Super Admin Only)
 */
router.post('/transactions/clear', async (req, res) => {
  try {
    const sessionUserId = req.session?.userId;
    if (!sessionUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { hardDelete } = req.body;

    // Strict Super Admin Check
    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, sessionUserId))
      .limit(1);

    if (user[0]?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super Admin can clear logs' });
    }

    if (hardDelete) {
      // Hard Delete: Actually remove rows
      await db.delete(himkoshTransactions);
      himkoshLogger.warn({ userId: sessionUserId }, "HimKosh logs HARD deleted by Super Admin");
      res.json({ message: "All HimKosh transaction logs permanently deleted." });
    } else {
      // Soft Delete: Archive them (hide from UI)
      await db
        .update(himkoshTransactions)
        .set({ isArchived: true })
        .where(eq(himkoshTransactions.isArchived, false));
      himkoshLogger.info({ userId: sessionUserId }, "HimKosh logs archived (soft cleared) by Super Admin");
      res.json({ message: "Transaction list cleared (archived)." });
    }
  } catch (error) {
    himkoshLogger.error({ err: error }, "Failed to clear transactions");
    res.status(500).json({ error: 'Failed to clear transactions' });
  }
});

/**
 * GET /api/himkosh/transaction/:appRefNo
 * Get specific transaction details
 */
router.get('/transaction/:appRefNo', async (req, res) => {
  try {
    const { appRefNo } = req.params;

    const [transaction] = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.appRefNo, appRefNo))
      .limit(1);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, appRefNo: req.params?.appRefNo }, "Error fetching transaction");
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

/**
 * GET /api/himkosh/application/:applicationId/transactions
 * Fetch transactions for a specific application (newest first)
 */
router.get('/application/:applicationId/transactions', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const sessionUserId = req.session?.userId;

    if (!sessionUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [application] = await db
      .select({
        id: homestayApplications.id,
        ownerId: homestayApplications.userId,
      })
      .from(homestayApplications)
      .where(eq(homestayApplications.id, applicationId))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.ownerId !== sessionUserId) {
      const [actor] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, sessionUserId))
        .limit(1);

      const allowedOfficerRoles = new Set([
        'district_officer',
        'state_officer',
        'dealing_assistant',
        'district_tourism_officer',
        'super_admin',
        'admin',
        'payment_officer',
      ]);

      if (!actor || !allowedOfficerRoles.has(actor.role)) {
        return res.status(403).json({ error: 'Access denied for this application' });
      }
    }

    const transactions = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.applicationId, applicationId))
      .orderBy(desc(himkoshTransactions.createdAt));

    res.json({ transactions });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, applicationId: req.params?.applicationId }, "Error fetching application transactions");
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * POST /api/himkosh/application/:applicationId/reset
 * Allow applicant/officer to cancel an in-progress transaction so a fresh attempt can be initiated.
 */
router.post('/application/:applicationId/reset', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const sessionUserId = req.session?.userId;

    if (!sessionUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [application] = await db
      .select({
        id: homestayApplications.id,
        ownerId: homestayApplications.userId,
      })
      .from(homestayApplications)
      .where(eq(homestayApplications.id, applicationId))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.ownerId !== sessionUserId) {
      const [actor] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, sessionUserId))
        .limit(1);

      const allowedOfficerRoles = new Set([
        'district_officer',
        'state_officer',
        'dealing_assistant',
        'district_tourism_officer',
        'super_admin',
        'admin',
        'payment_officer',
      ]);

      if (!actor || !allowedOfficerRoles.has(actor.role)) {
        return res.status(403).json({ error: 'Access denied for this application' });
      }
    }

    const [latestTransaction] = await db
      .select()
      .from(himkoshTransactions)
      .where(eq(himkoshTransactions.applicationId, applicationId))
      .orderBy(desc(himkoshTransactions.createdAt))
      .limit(1);

    if (!latestTransaction) {
      return res.status(404).json({ error: 'No transactions found for this application' });
    }

    const finalStates = new Set(['success', 'failed', 'verified']);
    if (finalStates.has(latestTransaction.transactionStatus ?? '')) {
      return res.status(400).json({ error: 'Latest transaction is already complete' });
    }

    await db
      .update(himkoshTransactions)
      .set({
        transactionStatus: 'failed',
        status: 'Cancelled by applicant',
        statusCd: '0',
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(himkoshTransactions.id, latestTransaction.id));

    res.json({ success: true });
  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path, applicationId: req.params?.applicationId }, "Error resetting HimKosh transaction");
    res.status(500).json({ error: 'Failed to reset transaction' });
  }
});

/**
 * GET /api/himkosh/config/status
 * Check HimKosh configuration status
 */
router.get('/config/status', async (req, res) => {
  const { config } = await resolveHimkoshGatewayConfig();
  res.json({
    configured: config.isConfigured,
    merchantCode: config.merchantCode,
    deptId: config.deptId,
    serviceCode: config.serviceCode,
    returnUrl: config.returnUrl,
  });
});

/**
 * POST /api/himkosh/test-callback-url
 * Test if a specific callback URL makes the checksum pass
 */
router.post('/test-callback-url', async (req, res) => {
  try {
    const { callbackUrl, applicationId } = req.body;

    if (!callbackUrl || !applicationId) {
      return res.status(400).json({ error: 'callbackUrl and applicationId are required' });
    }

    // Fetch application details
    const [application] = await db
      .select()
      .from(homestayApplications)
      .where(eq(homestayApplications.id, applicationId))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const { config } = await resolveHimkoshGatewayConfig();

    // Look up DDO code
    let ddoCode = config.ddo;
    let head1 = config.heads.registrationFee; // Default head code
    if (application.district) {
      const routedDistrict =
        deriveDistrictRoutingLabel(application.district, application.tehsil) ?? application.district;
      const ddoMapping = await resolveDistrictDdo(routedDistrict);

      if (ddoMapping) {
        ddoCode = ddoMapping.ddoCode;
        if (ddoMapping.head1) {
          head1 = ddoMapping.head1; // Override if dynamic head code is found
        }
      }
    }

    const appRefNo = `HPT${Date.now()}${nanoid(6)}`.substring(0, 20);

    if (!application.totalFee) {
      return res.status(400).json({ error: 'Total fee not calculated for this application' });
    }
    const totalAmount = Math.round(parseFloat(application.totalFee.toString()));

    const now = new Date();
    const periodDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    const deptRefNo = toHimkoshDeptRefNo(
      ensureDistrictCodeOnApplicationNumber(
        application.applicationNumber,
        application.district,
      )
    );

    const requestParams = {
      deptId: config.deptId,
      deptRefNo,
      totalAmount: totalAmount,
      tenderBy: application.ownerName,
      appRefNo: appRefNo,
      head1: head1,
      amount1: totalAmount,
      head2: config.heads.registrationFee,
      amount2: 0,
      ddo: ddoCode,
      periodFrom: periodDate,
      periodTo: periodDate,
      serviceCode: config.serviceCode,
      returnUrl: callbackUrl, // Use the test callback URL
    };

    // Build request strings (core for checksum, full for encryption)
    const { coreString, fullString } = buildRequestString(requestParams);

    // CRITICAL FIX: Calculate checksum ONLY on core string (excludes Service_code and return_url)
    const checksumCalc = HimKoshCrypto.generateChecksum(coreString);

    // Build full string WITH checksum
    const fullStringWithChecksum = `${fullString}|checkSum=${checksumCalc}`;

    // Encrypt
    const encrypted = await crypto.encrypt(fullStringWithChecksum);

    logPaymentTrace("[himkosh-test] Callback dry-run", {
      callbackUrl,
      coreString,
      fullString,
      checksum: checksumCalc,
    });

    res.json({
      success: true,
      testUrl: callbackUrl,
      checksum: checksumCalc,
      coreString: coreString,
      fullString: fullString,
      fullStringWithChecksum: fullStringWithChecksum,
      encrypted: encrypted,
      paymentUrl: `${config.paymentUrl}?encdata=${encodeURIComponent(encrypted)}&merchant_code=${config.merchantCode}`,
      message: 'FIXED: Checksum now calculated on CORE string only (excluding Service_code/return_url)',
    });

  } catch (error) {
    himkoshLogger.error({ err: error, route: req.path }, "[himkosh-test] Error generating payload");
    res.status(500).json({ error: 'Failed to generate test data' });
  }
});

// ─── Layer 2: Page-Load Reconciliation Endpoint ─────────────────────────────

import {
  reconcileOnPageLoad,
  getReconciliationSettings,
  runCronCycle,
  getRecentReconLogs
} from './reconciliation';

/**
 * POST /api/himkosh/reconcile/:applicationId
 * Layer 2: Check if a pending transaction can be auto-verified.
 * Called when owner or officer views an application with stuck payment.
 * Runs in background — does NOT block the page from loading.
 */
router.post('/reconcile/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId is required' });
    }

    // Fire and return immediately — don't make the page wait
    const result = await reconcileOnPageLoad(applicationId);

    if (!result) {
      return res.json({
        attempted: false,
        message: 'No pending transaction to reconcile, or reconciliation disabled',
      });
    }

    res.json({
      attempted: true,
      action: result.action,
      appRefNo: result.appRefNo,
      grn: result.grn ?? null,
      error: result.error ?? null,
    });
  } catch (error: any) {
    himkoshLogger.error({ err: error }, '[reconcile] Page-load reconciliation error');
    res.status(500).json({ error: 'Reconciliation failed' });
  }
});

/**
 * GET /api/himkosh/reconciliation/settings
 * Get current reconciliation settings (for Super Admin UI)
 */
router.get('/reconciliation/settings', async (req, res) => {
  try {
    const settings = await getReconciliationSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

/**
 * PUT /api/himkosh/reconciliation/settings
 * Update reconciliation settings (Super Admin only)
 */
router.put('/reconciliation/settings', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check role
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return res.status(403).json({ error: 'Super Admin access required' });
    }

    const {
      cronIntervalMinutes,
      staleThresholdMinutes,
      maxBatchSize,
      enabled,
      pageLoadEnabled,
    } = req.body;

    const newSettings = {
      cronIntervalMinutes: Math.max(5, Math.min(1440, Number(cronIntervalMinutes) || 15)),
      staleThresholdMinutes: Math.max(5, Math.min(1440, Number(staleThresholdMinutes) || 30)),
      maxBatchSize: Math.max(1, Math.min(50, Number(maxBatchSize) || 10)),
      enabled: enabled !== false,
      pageLoadEnabled: pageLoadEnabled !== false,
    };

    // Upsert into system_settings
    const [existing] = await db
      .select({ id: systemSettings.id })
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, 'reconciliation_config'))
      .limit(1);

    if (existing) {
      await db
        .update(systemSettings)
        .set({
          settingValue: newSettings,
          updatedBy: userId,
          updatedAt: new Date(),
        })
        .where(eq(systemSettings.id, existing.id));
    } else {
      await db.insert(systemSettings).values({
        settingKey: 'reconciliation_config',
        settingValue: newSettings,
        description: 'Payment reconciliation engine configuration (Layer 1 cron + Layer 2 page-load)',
        category: 'payment',
        updatedBy: userId,
      });
    }

    himkoshLogger.info({ newSettings, updatedBy: userId }, 'Reconciliation settings updated');
    res.json({ message: 'Settings updated', settings: newSettings });
  } catch (error) {
    himkoshLogger.error({ err: error }, 'Failed to update reconciliation settings');
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

/**
 * POST /api/himkosh/reconciliation/run-now
 * Manually trigger a cron cycle (for testing / Super Admin)
 */
router.post('/reconciliation/run-now', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !['super_admin', 'admin', 'payment_officer'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    himkoshLogger.info({ triggeredBy: userId }, 'Manual reconciliation cycle triggered');

    // Run synchronously so the caller sees results
    await runCronCycle();

    res.json({ message: 'Reconciliation cycle completed' });
  } catch (error) {
    himkoshLogger.error({ err: error }, 'Manual reconciliation failed');
    res.status(500).json({ error: 'Reconciliation cycle failed' });
  }
});

/**
 * GET /api/himkosh/reconciliation/logs
 * Retrieve recent in-memory log buffer for the UI
 */
router.get('/reconciliation/logs', async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !['super_admin', 'admin', 'payment_officer'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const logs = getRecentReconLogs();
    res.json(logs);
  } catch (error) {
    himkoshLogger.error({ err: error }, 'Failed to fetch reconciliation logs');
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
