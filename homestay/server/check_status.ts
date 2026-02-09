
import { db } from "./db";
import { homestayApplications } from "@shared/schema";
import { eq } from "drizzle-orm";

async function checkStatus() {
    const appNumber = "HP-HS-2026-SML-000004";
    console.log(`Checking status for ${appNumber}...`);

    const result = await db.select({
        id: homestayApplications.id,
        status: homestayApplications.status,
        applicationKind: homestayApplications.applicationKind
    })
        .from(homestayApplications)
        .where(eq(homestayApplications.applicationNumber, appNumber));

    console.log("Result:", result);
    process.exit(0);
}

checkStatus();
