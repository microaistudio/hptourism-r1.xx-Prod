import { db } from './server/db';
import { users } from './shared/schema';
import { inArray } from 'drizzle-orm';

async function run() {
    try {
        const dtdos = await db.select({
            username: users.username,
            fullName: users.fullName,
            district: users.district,
            hasSig: users.signatureUrl
        }).from(users).where(inArray(users.role, ['district_tourism_officer', 'district_officer']));
        console.log(JSON.stringify(dtdos, null, 2));
    } catch (err) {
        console.error("DB Error:", err);
    }
    process.exit(0);
}
run();
