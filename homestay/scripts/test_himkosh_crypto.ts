import { buildRequestString } from '../server/himkosh/crypto';

const params = {
    deptId: '230',
    deptRefNo: 'TEST-001',
    totalAmount: 100,
    tenderBy: 'John Doe',
    appRefNo: 'APP-123',
    head1: '1452-00-800-01',
    amount1: 100,
    ddo: 'CTO00-068',
    periodFrom: '01-01-2026',
    periodTo: '01-01-2026',
    serviceCode: 'TSM',
    returnUrl: 'https://example.com/callback'
};

const result = buildRequestString(params);

console.log('Core String (for checksum):');
console.log(result.coreString);
console.log('\nFull String (for encryption):');
console.log(result.fullString);

if (result.coreString.includes('Service_code') || result.coreString.includes('return_url')) {
    console.error('\n❌ FAILED: Core string contains Service_code or return_url');
} else if (!result.fullString.includes('Service_code') || !result.fullString.includes('return_url')) {
    console.error('\n❌ FAILED: Full string missing Service_code or return_url');
} else {
    console.log('\n✅ PASSED: Core and Full strings are correctly separated.');
}

process.exit(0);
