
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Counting applications by status...");

    const counts = await db
        .select({
            status: homestayApplications.status,
            count: sql<number>`count(*)`
        })
        .from(homestayApplications)
        .groupBy(homestayApplications.status);

    console.log("--- DB Counts ---");
    counts.forEach(row => {
        console.log(`${row.status}: ${row.count}`);
    });

    // Also check specific existing property renewals
    const legacyCounts = await db
        .select({
            status: homestayApplications.status,
            count: sql<number>`count(*)`
        })
        .from(homestayApplications)
        .where(sql`${homestayApplications.applicationKind} = 'renewal' AND ${homestayApplications.projectType} = 'existing_property'`)
        .groupBy(homestayApplications.status);

    console.log("--- Existing RC (Legacy) Counts ---");
    legacyCounts.forEach(row => {
        console.log(`${row.status}: ${row.count}`);
    });

    process.exit(0);
}

main().catch(console.error);
