
import { db } from "../server/db";
import { homestayApplications } from "@shared/schema";
import { desc } from "drizzle-orm";

async function main() {
    console.log("Checking last 5 applications...");
    const result = await db.select({
        id: homestayApplications.id,
        formTime: homestayApplications.formCompletionTimeSeconds,
        status: homestayApplications.status,
        created: homestayApplications.createdAt
    })
        .from(homestayApplications)
        .orderBy(desc(homestayApplications.createdAt))
        .limit(5);

    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
}

main().catch(console.error);
