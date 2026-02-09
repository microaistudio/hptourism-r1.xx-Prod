
import { db } from "../server/db";
import { homestayApplications } from "@shared/schema";
import { eq } from "drizzle-orm";

async function run() {
    try {
        const appNumber = "HP-HS-2026-SML-000011";
        console.log(`Fetching application: ${appNumber}`);

        const result = await db.select().from(homestayApplications).where(eq(homestayApplications.applicationNumber, appNumber));

        if (result.length === 0) {
            console.log("Application not found");
            return;
        }

        const app = result[0];
        console.log("Application Found:", app.id);
        console.log("Guardian Name:", app.guardianName);
        console.log("Guardian Relation (DB Value):", app.guardianRelation);

        // Explicitly check if the key exists in the object
        console.log("Has 'guardianRelation' key:", 'guardianRelation' in app);
        console.log("Full Object Keys:", Object.keys(app).sort());

    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(0);
    }
}

run();
