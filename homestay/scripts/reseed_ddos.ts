import { db } from '../server/db';
import { ddoCodes } from '../shared/schema';
import { eq } from 'drizzle-orm';

const ddoData = [
    { district: 'Chamba', ddoCode: 'CHM00-532', ddoDescription: 'D.T.D.O. CHAMBA', treasuryCode: 'CHM00' },
    { district: 'Bharmour', ddoCode: 'CHM01-001', ddoDescription: 'S.D.O.(CIVIL) BHARMOUR', treasuryCode: 'CHM01' },
    { district: 'Shimla (Central)', ddoCode: 'CTO00-068', ddoDescription: 'A.C. (TOURISM) SHIMLA', treasuryCode: 'CTO00' },
    { district: 'Hamirpur', ddoCode: 'HMR00-053', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', treasuryCode: 'HMR00' },
    { district: 'Una', ddoCode: 'HMR00-053', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE HAMIRPUR (UNA)', treasuryCode: 'HMR00' },
    { district: 'Kullu (Dhalpur)', ddoCode: 'KLU00-532', ddoDescription: 'DEPUTY DIRECTOR TOURISM AND CIVIL AVIATION KULLU DHALPUR', treasuryCode: 'KLU00' },
    { district: 'Kangra', ddoCode: 'KNG00-532', ddoDescription: 'DIV.TOURISM DEV.OFFICER(DTDO) DHARAMSALA', treasuryCode: 'KNG00' },
    { district: 'Kinnaur', ddoCode: 'KNR00-031', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICER KINNAUR AT RECKONG PEO', treasuryCode: 'KNR00' },
    { district: 'Lahaul-Spiti (Kaza)', ddoCode: 'KZA00-011', ddoDescription: 'PO ITDP KAZA', treasuryCode: 'KZA00' },
    { district: 'Lahaul', ddoCode: 'LHL00-017', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICER', treasuryCode: 'LHL00' },
    { district: 'Mandi', ddoCode: 'MDI00-532', ddoDescription: 'DIV. TOURISM DEV. OFFICER MANDI', treasuryCode: 'MDI00' },
    { district: 'Pangi', ddoCode: 'PNG00-003', ddoDescription: 'PROJECT OFFICER ITDP PANGI', treasuryCode: 'PNG00' },
    { district: 'Shimla', ddoCode: 'SML00-532', ddoDescription: 'DIVISIONAL TOURISM OFFICER SHIMLA', treasuryCode: 'SML00' },
    { district: 'Sirmour', ddoCode: 'SMR00-055', ddoDescription: 'DISTRICT TOURISM DEVELOPMENT OFFICE NAHAN', treasuryCode: 'SMR00' },
    { district: 'Solan', ddoCode: 'SOL00-046', ddoDescription: 'DTDO SOLAN', treasuryCode: 'SOL00' },
];

async function reseedDdos() {
    console.log('🏛️  Re-seeding DDO codes...');

    for (const ddo of ddoData) {
        const [existing] = await db.select()
            .from(ddoCodes)
            .where(eq(ddoCodes.district, ddo.district))
            .limit(1);

        if (existing) {
            console.log(`Updating ${ddo.district}...`);
            await db.update(ddoCodes)
                .set(ddo)
                .where(eq(ddoCodes.district, ddo.district));
        } else {
            console.log(`Inserting ${ddo.district}...`);
            await db.insert(ddoCodes).values(ddo);
        }
    }

    console.log('✅ DDO codes re-seeded successfully.');
    process.exit(0);
}

reseedDdos().catch(err => {
    console.error('❌ Re-seed failed:', err);
    process.exit(1);
});
