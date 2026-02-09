
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { eq, inArray } from "drizzle-orm";

async function checkSpecificIds() {
    const ids = [
        'bc787ecd-93b2-4dc8-a22e-8bd30ae81f9f', // From Screenshot
        '18741a41-8298-41bb-816f-1c33c76b5449'  // From Previous Check
    ];

    console.log("Querying specific IDs...");
    const results = await db.select({
        id: homestayApplications.id,
        appNumber: homestayApplications.applicationNumber,
        ownerName: homestayApplications.ownerName,
        guardianRel: homestayApplications.guardianRelation,
        updatedAt: homestayApplications.updatedAt,
        status: homestayApplications.status
    })
        .from(homestayApplications)
        .where(inArray(homestayApplications.id, ids));

    console.table(results);
    process.exit(0);
}

checkSpecificIds().catch(console.error);
