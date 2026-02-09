
import { db } from "./server/db";
import { homestayApplications, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    const appNumber = "HP-HS-2026-PNG-000003";
    console.log(`Searching for ${appNumber}...`);

    const apps = await db.select().from(homestayApplications).where(eq(homestayApplications.applicationNumber, appNumber));

    if (apps.length === 0) {
        console.log("No application found.");
    } else {
        const app = apps[0];
        console.log("Application Found:", {
            id: app.id,
            status: app.status,
            district: app.district,
            tehsil: app.tehsil,
            isPangiSubDivision: app.isPangiSubDivision,
            userId: app.userId,
        });
    }
    process.exit(0);
}

main().catch(console.error);
