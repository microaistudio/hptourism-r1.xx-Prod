import { db } from './server/db';
import { himkoshTransactions } from './shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

async function check() {
    // Get ALL transactions to understand the data
    const txns = await db.select({
        id: himkoshTransactions.id,
        appRefNo: himkoshTransactions.appRefNo,
        deptRefNo: himkoshTransactions.deptRefNo,
        merchantCode: himkoshTransactions.merchantCode,
        serviceCode: himkoshTransactions.serviceCode,
        transactionStatus: himkoshTransactions.transactionStatus,
        statusCd: himkoshTransactions.statusCd,
        echTxnId: himkoshTransactions.echTxnId,
        requestChecksum: himkoshTransactions.requestChecksum,
        responseChecksum: himkoshTransactions.responseChecksum,
        isDoubleVerified: himkoshTransactions.isDoubleVerified,
        doubleVerificationData: himkoshTransactions.doubleVerificationData,
        createdAt: himkoshTransactions.createdAt,
    }).from(himkoshTransactions)
        .orderBy(desc(himkoshTransactions.createdAt))
        .limit(10);

    for (const txn of txns) {
        console.log('---');
        console.log('AppRefNo:', txn.appRefNo);
        console.log('DeptRefNo:', txn.deptRefNo);
        console.log('Status:', txn.transactionStatus, '| StatusCd:', txn.statusCd);
        console.log('EchTxnId:', txn.echTxnId);
        console.log('MerchantCode:', txn.merchantCode);
        console.log('ServiceCode:', txn.serviceCode);
        console.log('RequestChecksum:', txn.requestChecksum);
        console.log('ResponseChecksum:', txn.responseChecksum);
        console.log('DoubleVerified:', txn.isDoubleVerified);
        console.log('DoubleVerificationData:', JSON.stringify(txn.doubleVerificationData));
        console.log('Created:', txn.createdAt);
    }
    process.exit(0);
}
check();
