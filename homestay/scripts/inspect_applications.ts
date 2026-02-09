
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { desc, eq } from "drizzle-orm";

async function main() {
    console.log("Fetching recent applications...");

    // Fetch last 5 applications
    const apps = await db
        .select()
        .from(homestayApplications)
        .orderBy(desc(homestayApplications.createdAt))
        .limit(5);

    console.log(`Found ${apps.length} applications.`);

    apps.forEach((app, index) => {
        console.log(`\n--- App #${index + 1} ---`);
        console.log(`ID: ${app.id}`);
        console.log(`Kind: ${app.applicationKind}`);
        console.log(`Status: ${app.status}`);
        console.log(`Owner: ${app.ownerName}`);
        console.log(`Property: ${app.propertyName}`);
        console.log(`Single Bed Rate: ${app.singleBedRoomRate}`);
        console.log(`Double Bed Rate: ${app.doubleBedRoomRate}`);
        console.log(`Family Suite Rate: ${app.familySuiteRate}`);
        console.log(`Proposed Rate (Legacy): ${app.proposedRoomRate}`);
        console.log(`Parent App ID: ${app.parentApplicationId}`);

        // Check if rooms JSON exists in any form (though schema suggests likely not, db-storage hinted at it)
        // We can't access it if not in schema type, but we can log the raw object safely
        // console.log("Raw Rooms Data:", (app as any).rooms);
    });

    // If there's a specific parent application the user is working on, we might find it referenced
    if (apps.length > 0 && apps[0].parentApplicationId) {
        const parentId = apps[0].parentApplicationId;
        console.log(`\n[DEBUG] Fetching Parent App: ${parentId}`);
        const parent = await db.select().from(homestayApplications).where(eq(homestayApplications.id, parentId)).limit(1);
        if (parent.length > 0) {
            const p = parent[0];
            console.log(`\n--- PARENT APP FULL DUMP (${parentId}) ---`);
            console.log(JSON.stringify(p, null, 2));
        }
    }

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
