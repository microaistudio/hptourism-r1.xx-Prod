
import { db } from "../server/db";
import { homestayApplications, inspectionOrders, users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { districtsMatch } from "../server/routes/helpers/district";

async function debugInspectionDetail() {
    console.log("--- Debugging DA Inspection Detail View ---\n");

    const targetId = "d21a096b-8b1d-49d9-9971-dbb22578092f";
    console.log(`Target Inspection ID from URL: ${targetId}`);

    // 1. Fetch the order directly (as the API does)
    const order = await db
        .select()
        .from(inspectionOrders)
        .where(eq(inspectionOrders.id, targetId))
        .limit(1);

    if (order.length === 0) {
        console.error("❌ Inspection order not found in DB!");
        return;
    }

    const inspection = order[0];
    console.log("✅ Inspection Order Found:");
    console.log(`- ID: ${inspection.id}`);
    console.log(`- Assigned To: ${inspection.assignedTo}`);
    console.log(`- Application ID: ${inspection.applicationId}`);

    // 2. Fetch Application
    const app = await db.query.homestayApplications.findFirst({
        where: eq(homestayApplications.id, inspection.applicationId),
    });

    if (!app) {
        console.error("❌ Application not found!");
        return;
    }
    console.log(`- Application District: '${app.district}'`);

    // 3. Test Access for Shimla DAs
    console.log("\nTesting Access for Shimla DAs:");

    // Fetch Shimla DAs
    const das = await db.select().from(users).where(eq(users.role, 'dealing_assistant'));
    const relevantDas = das.filter(u => u.district && (u.district.toLowerCase().includes('shimla') || app.district.toLowerCase().includes(u.district.toLowerCase())));

    for (const da of relevantDas) {
        console.log(`\nUser: ${da.username} (ID: ${da.id}, District: '${da.district}')`);

        const isAssigned = inspection.assignedTo === da.id;
        const isSameDistrict = da.district && districtsMatch(da.district, app.district);

        console.log(`  - Is Assigned? ${isAssigned}`);
        console.log(`  - Is Same District? ${isSameDistrict}`);
        console.log(`  - Result: ${isAssigned || isSameDistrict ? "✅ ALLOWED" : "❌ FORBIDDEN (403)"}`);

        if (!isAssigned && !isSameDistrict) {
            console.log(`    REASON: strict assignment mismatch AND district mismatch.`);
            console.log(`    Debug: districtsMatch('${da.district}', '${app.district}') returned false.`);
        }
    }
}

debugInspectionDetail().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
