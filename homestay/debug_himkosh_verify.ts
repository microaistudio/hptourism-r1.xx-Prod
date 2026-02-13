/**
 * Debug: Test verification of the BROKEN transaction (no echTxnId)
 * This simulates what the API route will do for HPT1770781846794gbHG
 */
import { verifyChallanViaSearch } from './server/himkosh/crypto';
import { getHimKoshConfig } from './server/himkosh/config';

async function testBrokenTxn() {
    const config = await getHimKoshConfig();

    const searchUrl = config.searchChallanUrl
        ?? 'https://himkosh.hp.nic.in/eChallan/SearchChallan.aspx';

    console.log('=== Verifying BROKEN Transaction (no echTxnId) ===');
    console.log('AppRefNo: HPT1770781846794gbHG');
    console.log('TenderBy: Test Payment');
    console.log('echTxnId: UNKNOWN (empty string for fallback search)');

    const result = await verifyChallanViaSearch({
        searchUrl,
        tenderBy: 'Test Payment',
        fromDate: '10-02-2026',
        toDate: '12-02-2026',
        echTxnId: '',  // Empty! Will use appRefNo-based matching
        appRefNo: 'HPT1770781846794gbHG',
    });

    console.log('\n=== Verification Result ===');
    console.log(JSON.stringify(result, null, 2));

    if (result.found && result.isSuccess) {
        console.log('\n✅ BROKEN TRANSACTION VERIFIED & RECOVERED!');
        console.log(`  Recovered echTxnId: ${result.transId}`);
        console.log(`  Status: ${result.status}`);
        console.log(`  Amount: ₹${result.amount}`);
        console.log(`  Receipt: ${result.receiptNo}`);
        console.log(`  Receipt Date: ${result.receiptDate}`);
        console.log('\n  → In production, this will:');
        console.log('    1. Set echTxnId on the transaction record');
        console.log('    2. Mark as double-verified');
        console.log('    3. Update application status (draft → submitted)');
    } else if (result.found) {
        console.log('\n⚠️ Transaction found but NOT successful');
        console.log(`  Status: ${result.status}`);
    } else {
        console.log('\n❌ Transaction not found');
    }

    process.exit(0);
}
testBrokenTxn();
