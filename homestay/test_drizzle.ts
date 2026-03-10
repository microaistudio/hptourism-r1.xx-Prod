import { db } from './server/db.js';
import { homestayApplications } from './shared/schema.js';
import { sql, eq } from 'drizzle-orm';

async function test() {
    const [economicData] = await db
        .select({
            totalBeds: sql<number>`sum(
                COALESCE(${homestayApplications.singleBedBeds}, 0) + 
                COALESCE(${homestayApplications.doubleBedBeds}, 0) + 
                COALESCE(${homestayApplications.familySuiteBeds}, 0)
            )`,
            projectedRevenue: sql<number>`sum(
                COALESCE(${homestayApplications.averageRoomRate}, 2000) * 
                ${homestayApplications.totalRooms} * 
                365 * 0.40
            )`
        })
        .from(homestayApplications)
        .where(eq(homestayApplications.status, 'approved'));

    console.log(economicData);
    process.exit(0);
}

test().catch(console.error);
