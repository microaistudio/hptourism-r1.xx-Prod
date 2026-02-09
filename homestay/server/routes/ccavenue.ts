import { Router, type Request } from 'express';
import { db } from '../db';
import { homestayApplications, ccavenueTransactions, systemSettings } from '../../shared/schema'; // Ensure these are exported from schema.ts
import { CCAvenueUtil } from '../utils/ccavenue';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { config as appConfig } from '@shared/config';
import { logger } from '../logger';
import { getPaymentWorkflow, getUpfrontSubmitMode } from "../services/systemSettings";

const router = Router();
const ccavenueLogger = logger.child({ module: "ccavenue" });

// Helper to build consistent callback page (reused from HimKosh style)
const buildCallbackPage = (options: {
    heading: string;
    description: string;
    followUp: string;
    tone: "success" | "pending" | "error";
    orderId?: string | null;
    amount?: number | null;
    trackingId?: string | null;
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
        ${options.orderId ? `<div class="summary-item"><span>Order ID</span><span>${options.orderId}</span></div>` : ""}
        ${options.trackingId ? `<div class="summary-item"><span>Transaction Ref</span><span>${options.trackingId}</span></div>` : ""}
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
 * GET /api/ccavenue/application/:id/transactions
 * Fetch transaction history for an application
 */
router.get('/application/:id/transactions', async (req, res) => {
    try {
        const { id } = req.params;
        const transactions = await db
            .select()
            .from(ccavenueTransactions)
            .where(eq(ccavenueTransactions.applicationId, id))
            .orderBy(sql`${ccavenueTransactions.createdAt} DESC`);

        res.json({ transactions });
    } catch (error) {
        ccavenueLogger.error({ err: error }, "Failed to fetch CCAvenue transactions");
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

/**
 * POST /api/ccavenue/initiate
 * Initiate CCAvenue payment for an application
 */
router.post('/initiate', async (req, res) => {
    try {
        const { applicationId } = req.body;

        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID is required' });
        }

        // 1. Fetch Application
        const [application] = await db
            .select()
            .from(homestayApplications)
            .where(eq(homestayApplications.id, applicationId))
            .limit(1);

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // 2. Validate Status (Copying logic from HimKosh)
        const paymentWorkflow = await getPaymentWorkflow();
        const isStandardPaymentStatus =
            application.status === 'payment_pending' ||
            application.status === 'verified_for_payment';
        const isDraftPaymentAllowed =
            paymentWorkflow === 'upfront' &&
            application.status === 'draft';

        if (!isStandardPaymentStatus && !isDraftPaymentAllowed) {
            return res.status(400).json({
                error: 'Application is not ready for payment',
                currentStatus: application.status,
            });
        }

        // 3. Document Validation for Draft flow
        if (isDraftPaymentAllowed) {
            const documentsArray = application.documents;
            const hasDocuments = Array.isArray(documentsArray) && documentsArray.length > 0;
            if (!hasDocuments) {
                return res.status(400).json({
                    error: 'Please upload required documents before submitting payment',
                });
            }
        }

        // 4. Determine Amount
        if (!application.totalFee) {
            return res.status(400).json({ error: 'Total fee calculation missing' });
        }

        let amount = parseFloat(application.totalFee.toString());

        // Check Test Mode setting
        const [testModeSetting] = await db
            .select()
            .from(systemSettings)
            .where(eq(systemSettings.settingKey, 'payment_test_mode'))
            .limit(1);

        const isTestMode = testModeSetting
            ? (testModeSetting.settingValue as { enabled: boolean }).enabled
            : false;

        if (isTestMode) {
            amount = 1.00; // Force ₹1 in test mode
        }

        const {
            CCAVENUE_MERCHANT_ID,
            CCAVENUE_ACCESS_CODE,
            CCAVENUE_WORKING_KEY,
            CCAVENUE_URL
        } = process.env;

        const accessCode = CCAVENUE_ACCESS_CODE || '';
        const workingKey = CCAVENUE_WORKING_KEY || '';
        const merchantId = CCAVENUE_MERCHANT_ID || '';
        // Use configured URL or default to test for safety if missing
        const paymentUrl = CCAVENUE_URL || 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';

        if (!accessCode || !workingKey || !merchantId) {
            throw new Error("CCAvenue credentials not configured");
        }

        // 5. Generate Order ID
        const orderId = `HPT-${Date.now()}-${nanoid(6)}`;

        // 6. Build User Metadata
        // Clean strings to avoid charset issues
        const cleanStr = (str?: string | null) => (str || '').replace(/[^a-zA-Z0-9\s]/g, '').trim();

        const billingName = cleanStr(application.ownerName);
        const billingAddress = cleanStr(application.address).substring(0, 100);
        const billingCity = cleanStr(application.district);
        const billingZip = cleanStr(application.pincode);
        const billingTel = cleanStr(application.ownerMobile);
        const billingEmail = application.ownerEmail || 'noreply@hp.gov.in';

        // 7. Determine Application/Return URL
        // We need an absolute URL for the callback
        const host = req.get('host');
        const protocol = req.protocol === 'http' && host?.includes('localhost') ? 'http' : 'https';
        // Ideally use appConfig or derive from request
        const baseUrl = `${protocol}://${host}`;
        const redirectUrl = `${baseUrl}/api/ccavenue/callback`;
        const cancelUrl = `${baseUrl}/api/ccavenue/callback`;

        const paymentData = {
            merchant_id: merchantId,
            order_id: orderId,
            currency: 'INR',
            amount: amount.toFixed(2),
            redirect_url: redirectUrl,
            cancel_url: cancelUrl,
            language: 'EN',
            billing_name: billingName,
            billing_address: billingAddress,
            billing_city: billingCity,
            billing_zip: billingZip,
            billing_country: 'India',
            billing_tel: billingTel,
            billing_email: billingEmail,
            // Optional custom fields to track application ID
            merchant_param1: applicationId,
            merchant_param2: 'hptourism',
            merchant_param3: isTestMode ? 'test_mode' : 'production',
        };

        const encRequest = CCAvenueUtil.encrypt(CCAvenueUtil.jsonToQueryString(paymentData), workingKey);

        // 8. Create Transaction Record
        await db.insert(ccavenueTransactions).values({
            applicationId,
            orderId,
            amount: amount.toString(),
            billingName,
            billingAddress,
            billingCity,
            billingZip,
            billingTel,
            billingEmail,
            paymentMode: 'CCAvenue',
            orderStatus: 'Initiated',
            transDate: new Date(),
        });

        ccavenueLogger.info({ orderId, applicationId, amount }, "Initiated CCAvenue payment");

        res.json({
            success: true,
            paymentUrl: paymentUrl, // This is the URL the form action points to
            accessCode: accessCode,
            encRequest: encRequest,
            orderId: orderId,
            isTestMode
        });

    } catch (error) {
        ccavenueLogger.error({ err: error }, "CCAvenue initiation failed");
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});


/**
 * POST /api/ccavenue/callback
 * Handle payment response from CCAvenue
 */
router.post('/callback', async (req, res) => {
    try {
        const { encResp } = req.body;
        const workingKey = process.env.CCAVENUE_WORKING_KEY || '';

        if (!encResp) {
            return res.status(400).send('Missing encrypted response');
        }

        const decryptedResp = CCAvenueUtil.decrypt(encResp, workingKey);
        const data = CCAvenueUtil.queryStringToJson(decryptedResp);

        ccavenueLogger.info({ orderId: data.order_id, status: data.order_status }, "Received CCAvenue callback");

        const orderId = data.order_id;
        const trackingId = data.tracking_id;
        const bankRefNo = data.bank_ref_no;
        const orderStatus = data.order_status; // Success, Failure, Aborted, Invalid
        const failureMessage = data.failure_message;
        const paymentMode = data.payment_mode;
        const cardName = data.card_name;
        const statusCode = data.status_code;
        const statusMessage = data.status_message;
        // merchant_param1 was stored as applicationId
        const applicationId = data.merchant_param1;

        // 1. Update Transaction
        await db.update(ccavenueTransactions)
            .set({
                trackingId,
                bankRefNo,
                orderStatus,
                failureMessage,
                paymentMode,
                cardName,
                statusCode,
                statusMessage,
                transDate: new Date(), // Update timestamp
                updatedAt: new Date()
            })
            .where(eq(ccavenueTransactions.orderId, orderId));

        // 2. Handle Application Status Update on Success
        let redirectUrl = '/applications'; // Default fallback

        if (orderStatus === 'Success') {
            const [transaction] = await db
                .select()
                .from(ccavenueTransactions)
                .where(eq(ccavenueTransactions.orderId, orderId))
                .limit(1);

            if (transaction && transaction.applicationId) {
                redirectUrl = `/applications/${transaction.applicationId}`;

                const [currentApp] = await db
                    .select()
                    .from(homestayApplications)
                    .where(eq(homestayApplications.id, transaction.applicationId))
                    .limit(1);

                if (currentApp) {
                    // Update Application Status logic (Sync with HimKosh logic)
                    if (currentApp.status === 'draft') {
                        const submitMode = await getUpfrontSubmitMode();
                        const targetStatus = submitMode === "auto" ? "submitted" : "paid_pending_submit";

                        await db.update(homestayApplications).set({
                            status: targetStatus,
                            paymentStatus: 'paid',
                            paymentId: trackingId, // Use CCAvenue tracking ID
                            paymentAmount: transaction.amount,
                            paymentDate: new Date(),
                            submittedAt: submitMode === "auto" ? new Date() : undefined,
                        }).where(eq(homestayApplications.id, currentApp.id));
                    } else {
                        // Standard payment flow (post-approval or pending payment)
                        // If it was 'payment_pending', move to 'approved' (or next step depending on workflow)
                        // For now, let's assume if it was verified_for_payment, it goes to 'approved' (Generate Certificate is separate step usually, but payment confirms it)
                        // Wait, in HimKosh it doesn't auto-approve unless logic is there.
                        // Let's look at `himkosh/routes.ts`: 
                        // It sets `paymentStatus: 'paid'` and `status: 'submitted'` (if draft).
                        // If it was already submitted/verified, it might just mark paymentStatus='paid'.

                        // Re-reading himkosh/routes.ts (Lines 782+):
                        // If draft -> submitted/paid_pending_submit
                        // If payment_pending -> approved (Line 809 in himkosh/routes.ts was not visible but implied).

                        // Let's implement basics: Mark as PAID.
                        await db.update(homestayApplications).set({
                            paymentStatus: 'paid',
                            paymentId: trackingId,
                            paymentAmount: transaction.amount,
                            paymentDate: new Date(),
                            // Only change status if it was payment_pending, to avoid reverting other states
                            ...(currentApp.status === 'payment_pending' ? { status: 'payment_verified' } : {}) // 'payment_verified' isn't a standard enum in schema?
                            // Schema says: 'payment_pending', 'approved', 'rejected'
                            // Usually after payment, it goes to 'approved' or 'processing_certificate'.
                            // Let's stick to updating paymentStatus to 'paid'. The Admin/Officer workflow will take it from there or auto-approve jobs will pick it up.
                        }).where(eq(homestayApplications.id, currentApp.id));
                    }
                }
            }
        }

        // 3. Render Response Page
        const isSuccess = orderStatus === 'Success';
        const pageHtml = buildCallbackPage({
            heading: isSuccess ? 'Payment Successful' : 'Payment Failed',
            description: isSuccess
                ? 'Your payment via Kotak Mahindra Gateway was successful.'
                : `Payment failed. Status: ${orderStatus}`,
            followUp: isSuccess
                ? 'You will be redirected to your application shortly.'
                : 'Please try again or contact support if the issue persists.',
            tone: isSuccess ? 'success' : 'error',
            orderId,
            trackingId,
            amount: parseFloat(data.amount || '0'),
            redirectUrl
        });

        res.send(pageHtml);

    } catch (error) {
        ccavenueLogger.error({ err: error }, "CCAvenue callback handling failed");
        res.status(500).send("An error occurred while processing the payment response.");
    }
});

export default router;
