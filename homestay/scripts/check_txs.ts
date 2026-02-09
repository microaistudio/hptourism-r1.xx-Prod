import { db } from '../server/db';
import { himkoshTransactions } from '../shared/schema';
import { desc } from 'drizzle-orm';

async function checkTransactions() {
    const txs = await db.select()
        .from(himkoshTransactions)
        .orderBy(desc(himkoshTransactions.createdAt))
        .limit(5);

    console.log('Recent HimKosh Transactions in DB:');
    console.table(txs.map(t => ({
        id: t.id,
        appRefNo: t.appRefNo,
        status: t.transactionStatus,
        amount: t.totalAmount,
        service: t.serviceCode,
        ddo: t.ddo,
        head: t.head1,
        createdAt: t.createdAt
    })));
    process.exit(0);
}

checkTransactions().catch(err => {
    console.error(err);
    process.exit(1);
});
