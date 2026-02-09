
import { db } from "./db";
import { homestayApplications, users } from "@shared/schema";
import { sql } from "drizzle-orm";

async function verifyReset() {
    console.log("Verifying database reset...");

    const appCount = await db.select({ count: sql<number>`count(*)` }).from(homestayApplications);
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);

    console.log(`Applications count: ${appCount[0].count}`);
    console.log(`Users count: ${userCount[0].count}`);

    if (Number(appCount[0].count) === 0) {
        console.log("Database appears to be reset (no applications).");
    } else {
        console.log("Database is NOT fully reset. Applications exist.");
    }
    process.exit(0);
}

verifyReset();
