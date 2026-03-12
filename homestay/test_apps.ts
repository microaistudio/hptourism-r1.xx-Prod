import { db } from './server/db';
import { homestayApplications } from './shared/schema';
import { ilike, or } from 'drizzle-orm';

async function run() {
    try {
        const apps = await db.select({
            id: homestayApplications.id,
            property: homestayApplications.propertyName,
            owner: homestayApplications.ownerName,
            district: homestayApplications.district,
            status: homestayApplications.status
        }).from(homestayApplications).where(or(
            ilike(homestayApplications.propertyName, '%BILLING%'),
            ilike(homestayApplications.propertyName, '%RADHEY%'),
            ilike(homestayApplications.propertyName, '%ISHANT%')
        ));
        console.log("APPS", JSON.stringify(apps, null, 2));
    } catch (err) {
        console.error("DB Error:", err);
    }
    process.exit(0);
}
run();
