
import { db } from "../server/db";
import { homestayApplications, inspectionOrders, users, inspectionReports } from "../shared/schema";
import { eq, ilike } from "drizzle-orm";
import { buildDistrictWhereClause } from "../server/routes/helpers/district";

async function debugInspections() {
    console.log("--- Debugging DA Inspection Visibility ---\n");

    // 1. Find the application
    const appNumber = "HP-HS-2026-SML-000001";
    console.log(`Searching for application: ${appNumber}`);

    const app = await db.query.homestayApplications.findFirst({
        where: eq(homestayApplications.applicationNumber, appNumber),
    });

    if (!app) {
        console.error("❌ Application NOT FOUND!");
        return;
    }

    console.log("✅ Application Found:");
    console.log(`- ID: ${app.id}`);
    console.log(`- District: '${app.district}'`);
    console.log(`- Status: '${app.status}'`);
    console.log(`- DA ID: ${app.daId}`);

    // 2. Find Inspection Order
    console.log("\nSearching for Inspection Order...");
    const order = await db.query.inspectionOrders.findFirst({
        where: eq(inspectionOrders.applicationId, app.id),
    });

    if (!order) {
        console.error("❌ Inspection Order NOT FOUND!");
    } else {
        console.log("✅ Inspection Order Found:");
        console.log(`- ID: ${order.id}`);
        console.log(`- Assigned To: ${order.assignedTo}`);
        console.log(`- Status: '${order.status}'`);

        // Check for existing report
        const report = await db.query.inspectionReports.findFirst({
            where: eq(inspectionReports.inspectionOrderId, order.id)
        });

        if (report) {
            console.log(`⚠️  REPORT ALREADY EXISTS! ID: ${report.id}`);
            console.log(`   This means 'reportSubmitted' will be true, and it will NOT show in 'Scheduled' list.`);
        } else {
            console.log("✅ No existing report found (Correct for 'Scheduled' list).");
        }
    }

    // 3. Find DAs in the same district
    console.log(`\nFinding DAs in district '${app.district}'...`);
    const das = await db.select().from(users).where(eq(users.role, 'dealing_assistant')); // simplified, then filter in JS to be safe or use match

    const relevantDas = das.filter(u => u.district && (u.district.toLowerCase().includes('shimla') || app.district.toLowerCase().includes(u.district.toLowerCase())));

    console.log(`Found ${relevantDas.length} DAs in Shimla/matching district.`);

    for (const da of relevantDas) {
        console.log(`\nChecking visibility for DA: ${da.username} (ID: ${da.id}, District: '${da.district}')`);

        if (!da.district) {
            console.log("  Skipping - no district assigned.");
            continue;
        }

        const districtCondition = buildDistrictWhereClause(homestayApplications.district, da.district);

        try {
            const rows = await db
                .select({
                    orderId: inspectionOrders.id,
                    appDistrict: homestayApplications.district,
                })
                .from(inspectionOrders)
                .innerJoin(homestayApplications, eq(inspectionOrders.applicationId, homestayApplications.id))
                .where(districtCondition);

            const found = rows.find(r => r.orderId === order?.id);

            if (found) {
                console.log(`  ✅ VISIBLE! Query returned ${rows.length} orders. Found target order.`);
            } else {
                console.log(`  ❌ NOT VISIBLE. Query returned ${rows.length} orders. Target order NOT found.`);
                console.log("  Debug: condition SQL might be mismatching.");
            }
        } catch (err) {
            console.error("  ❌ Query Error:", err);
        }
    }
}

debugInspections().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
