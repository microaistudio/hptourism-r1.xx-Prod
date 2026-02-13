
import { db } from "../server/db";
import { himkoshTransactions, homestayApplications } from "@shared/schema";
import { eq, or, desc } from "drizzle-orm";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
    console.log("\n🔍  Scanning for Pending / Incomplete Transactions...");

    try {
        // 1. Find pending transactions (initiated or redirected)
        const pendingTxns = await db
            .select({
                id: himkoshTransactions.id,
                appRefNo: himkoshTransactions.appRefNo,
                deptRefNo: himkoshTransactions.deptRefNo,
                amount: himkoshTransactions.totalAmount,
                status: himkoshTransactions.transactionStatus, // 'initiated' | 'redirected'
                createdAt: himkoshTransactions.createdAt,
                appId: himkoshTransactions.applicationId,
                appStatus: homestayApplications.status,
                ownerName: homestayApplications.ownerName,
                district: homestayApplications.district,
            })
            .from(himkoshTransactions)
            .leftJoin(homestayApplications, eq(himkoshTransactions.applicationId, homestayApplications.id))
            .where(
                or(
                    eq(himkoshTransactions.transactionStatus, "initiated"),
                    eq(himkoshTransactions.transactionStatus, "redirected")
                )
            )
            .orderBy(desc(himkoshTransactions.createdAt));

        if (pendingTxns.length === 0) {
            console.log("\n✅  No pending transactions found. System is clean.");
            rl.close();
            process.exit(0);
        }

        console.log(`\nFound ${pendingTxns.length} pending transactions:`);
        const displayData = pendingTxns.map(t => ({
            RefNo: t.appRefNo,
            Amount: `Rs. ${t.amount}`,
            Date: t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A',
            Owner: t.ownerName ? t.ownerName.substring(0, 20) : 'N/A',
            District: t.district || 'N/A',
            Status: t.status
        }));
        console.table(displayData);

        // 2. Ask for Action
        const answer = await askQuestion("\n👉 Enter the EXACT 'RefNo' from above to MARK AS SUCCESS (or type 'exit'): ");

        if (!answer || answer.trim().toLowerCase() === 'exit') {
            console.log("Exiting without changes.");
            rl.close();
            process.exit(0);
        }

        const inputRef = answer.trim();
        const target = pendingTxns.find(t => t.appRefNo === inputRef);

        if (!target) {
            console.error(`\n❌  RefNo '${inputRef}' not found in the pending list.`);
            rl.close();
            process.exit(1);
        }

        console.log(`\n⚠  WARNING: You are about to FORCE VERIFY transaction ${target.appRefNo}`);
        console.log(`   Amount: Rs. ${target.amount}`);
        console.log(`   Owner: ${target.ownerName}`);
        console.log(`   Current App Status: ${target.appStatus}`);

        const confirm = await askQuestion("\nType 'CONFIRM' to proceed with database update: ");
        if (confirm !== 'CONFIRM') {
            console.log("Operation cancelled.");
            rl.close();
            process.exit(0);
        }

        // 3. Perform Update
        console.log("\nUpdating database...");

        // Update Transaction to VERIFIED (Success)
        // We set statusCd to '0300' (Success) and bankName to 'Manual Resolution' for audit
        await db.update(himkoshTransactions)
            .set({
                transactionStatus: 'verified',
                status: 'Success',
                statusCd: '0300',
                bankName: 'Manual Resolution (Admin Action)',
                bankCIN: `MANUAL_RES_${Date.now()}`, // Generate a audit trail CIN
                isRefunded: false // ensure it's not marked refunded
            })
            .where(eq(himkoshTransactions.id, target.id));

        console.log("✅  Transaction marked as VERIFIED.");

        // Update Application IF it was stuck in pending_payment
        if (target.appStatus === 'pending_payment') {
            await db.update(homestayApplications)
                .set({
                    status: 'submitted',
                    submittedAt: new Date(),
                    paymentStatus: 'paid'
                })
                .where(eq(homestayApplications.id, target.appId!));
            console.log("✅  Application status updated from 'pending_payment' to 'submitted'.");
        } else {
            console.log(`ℹ️  Application status is '${target.appStatus}', leaving as is.`);
        }

        console.log("\nDone. Please run the script again to verify or process another.");
        rl.close();
        process.exit(0);

    } catch (error) {
        console.error("\n❌ Error:", error);
        rl.close();
        process.exit(1);
    }
}

main();
