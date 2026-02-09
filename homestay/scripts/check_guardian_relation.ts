
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { desc } from "drizzle-orm";

async function checkRelations() {
    console.log("Querying recent applications...");
    const results = await db.select({
        id: homestayApplications.id,
        appNumber: homestayApplications.applicationNumber,
        ownerName: homestayApplications.ownerName,
        guardianRel: homestayApplications.guardianRelation,
        updatedAt: homestayApplications.updatedAt,
        status: homestayApplications.status
    })
        .from(homestayApplications)
        .orderBy(desc(homestayApplications.updatedAt))
        .limit(5);

    console.table(results);
    process.exit(0);
}

checkRelations().catch(console.error);
