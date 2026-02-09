
import { db } from "./db";
import { homestayApplications } from "@shared/schema";
import { eq } from "drizzle-orm";

async function forceForwardToDtdo() {
    const appNumber = "HP-HS-2026-SML-000004";
    console.log(`Forcing application ${appNumber} to 'forwarded_to_dtdo'...`);

    const result = await db.update(homestayApplications)
        .set({ status: 'forwarded_to_dtdo' })
        .where(eq(homestayApplications.applicationNumber, appNumber))
        .returning();

    if (result.length > 0) {
        console.log("Success! status set to 'forwarded_to_dtdo'.");
        console.log("It should now be visible in the DTDO Incoming Queue.");
    } else {
        console.error("Application not found!");
    }
    process.exit(0);
}

forceForwardToDtdo();
