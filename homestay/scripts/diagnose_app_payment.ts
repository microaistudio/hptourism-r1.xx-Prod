
import { db } from "../server/db";
import { homestayApplications, himkoshTransactions, payments, applicationActions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

async function diagnoseApplication(appNumber: string) {
    console.log(`\n🔍 DIAGNOSING APPLICATION: ${appNumber}`);
    console.log("====================================================");

    // 1. Fetch Main Application Record
    const appResults = await db
        .select()
        .from(homestayApplications)
        .where(eq(homestayApplications.applicationNumber, appNumber))
        .limit(1);

    if (appResults.length === 0) {
        console.error("❌ ERROR: Application not found in database.");
        process.exit(1);
    }

    const app = appResults[0];
    console.log("--- [MAIN APPLICATION RECORD] ---");
    console.log(`ID: ${app.id}`);
    console.log(`Status: ${app.status}`);
    console.log(`Current Stage: ${app.currentStage}`);
    console.log(`Payment Status: ${app.paymentStatus}`);
    console.log(`Payment ID: ${app.paymentId || 'NONE'}`);
    console.log(`Total Fee: ₹${app.totalFee}`);
    console.log(`Category: ${app.category}`);
    console.log(`Submitted At: ${app.submittedAt?.toISOString() || 'NOT SUBMITTED'}`);
    console.log(`Created At: ${app.createdAt?.toISOString()}`);

    // 2. Fetch Himkosh Transactions
    const hkResults = await db
        .select()
        .from(himkoshTransactions)
        .where(eq(himkoshTransactions.applicationId, app.id))
        .orderBy(desc(himkoshTransactions.createdAt));

    console.log("\n--- [HIMKOSH TRANSACTIONS] ---");
    if (hkResults.length === 0) {
        console.log("No Himkosh transactions found.");
    } else {
        hkResults.forEach((tx, idx) => {
            console.log(`TX #${idx + 1}:`);
            console.log(`  App Ref No (Our TX ID): ${tx.appRefNo}`);
            console.log(`  Himkosh TX ID (GRN): ${tx.echTxnId || 'PENDING'}`);
            console.log(`  Amount: ₹${tx.totalAmount}`);
            console.log(`  Status (Literal): ${tx.status || 'NULL'}`);
            console.log(`  Status Code: ${tx.statusCd === '1' ? 'SUCCESS (1)' : 'FAILURE/PENDING (0)'}`);
            console.log(`  Transaction Status (Internal): ${tx.transactionStatus}`);
            console.log(`  Is Double Verified: ${tx.isDoubleVerified ? 'YES' : 'NO'}`);
            console.log(`  Initiated At: ${tx.initiatedAt?.toISOString()}`);
            console.log(`  Responded At: ${tx.respondedAt?.toISOString() || 'N/A'}`);
        });
    }

    // 3. Fetch Generic Payments Table
    const pResults = await db
        .select()
        .from(payments)
        .where(eq(payments.applicationId, app.id));

    console.log("\n--- [PAYMENTS TABLE RECORDS] ---");
    if (pResults.length === 0) {
        console.log("No records in payments table.");
    } else {
        pResults.forEach((p, idx) => {
            console.log(`Record #${idx + 1}:`);
            console.log(`  Gateway: ${p.paymentGateway}`);
            console.log(`  Gateway TX ID: ${p.gatewayTransactionId}`);
            console.log(`  Status: ${p.paymentStatus}`);
            console.log(`  Amount: ₹${p.amount}`);
            console.log(`  Completed At: ${p.completedAt?.toISOString() || 'N/A'}`);
        });
    }

    // 4. Checking Action History
    const actions = await db
        .select()
        .from(applicationActions)
        .where(eq(applicationActions.applicationId, app.id))
        .orderBy(desc(applicationActions.createdAt))
        .limit(10);

    console.log("\n--- [RECENT WORKFLOW ACTIONS] ---");
    if (actions.length === 0) {
        console.log("No history found.");
    } else {
        actions.forEach(a => {
            console.log(`- [${a.createdAt?.toISOString()}] ${a.action}: ${a.previousStatus} -> ${a.newStatus}`);
            if (a.feedback) console.log(`  Feedback: ${a.feedback}`);
        });
    }

    // 5. Check for common anomalies
    console.log("\n--- [ANOMALY DETECTION] ---");
    let anomalies = 0;
    
    const successfulHk = hkResults.find(tx => tx.statusCd === '1' || tx.transactionStatus === 'verified' || tx.transactionStatus === 'success');
    
    if (successfulHk && app.paymentStatus !== 'paid') {
        console.log("🚨 ANOMALY: Found successful Himkosh transaction, but application.paymentStatus is NOT 'paid'.");
        anomalies++;
    }
    
    if (app.paymentStatus === 'paid' && app.status === 'draft') {
        console.log("🚨 ANOMALY: Application is paid but still in 'draft' status. It should have been moved to 'submitted' or 'pending_verification'.");
        anomalies++;
    }

    if (successfulHk && !app.paymentId) {
        console.log("🚨 ANOMALY: Payment successful but application.paymentId (GRN) is not linked.");
        anomalies++;
    }

    if (anomalies === 0) {
        console.log("✅ No common database anomalies detected.");
    }

    console.log("====================================================\n");
    process.exit(0);
}

const appToDiagnose = process.argv[2] || "HP-HS-2026-CHM-000313";
diagnoseApplication(appToDiagnose).catch((err) => {
    console.error("FATAL ERROR during diagnosis:", err);
    process.exit(1);
});
