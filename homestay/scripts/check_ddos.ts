import { db } from '../server/db';
import { ddoCodes } from '../shared/schema';

async function checkDdos() {
    const allDdos = await db.select().from(ddoCodes);
    console.log('Current DDO Codes in DB:');
    console.table(allDdos.map(d => ({
        district: d.district,
        ddoCode: d.ddoCode,
        description: d.ddoDescription
    })));
    process.exit(0);
}

checkDdos().catch(err => {
    console.error(err);
    process.exit(1);
});
