
import { db } from "../server/db";
import { homestayApplications, inspectionOrders, inspectionReports, users } from "../shared/schema";
import { eq, or, and } from "drizzle-orm";
import { districtsMatch } from "../server/routes/helpers/district";

async function debugFinalCheck() {
    console.log("--- FINAL DEBUG CHECK: HP-HS-2026-SML-000001 ---\n");

    // 1. Find Application
    const app = await db.query.homestayApplications.findFirst({
        where: eq(homestayApplications.applicationNumber, "HP-HS-2026-SML-000001"),
    });

    if (!app) {
        console.error("❌ Application HP-HS-2026-SML-000001 NOT FOUND in DB!");
        return;
    }

    console.log(`✅ Application Found:`);
    console.log(`- ID: ${app.id}`);
    console.log(`- Status: '${app.status}' (Should be 'inspection_scheduled')`);
    console.log(`- District: '${app.district}'`);

    // 2. Find Inspection Order
    const order = await db.query.inspectionOrders.findFirst({
        where: eq(inspectionOrders.applicationId, app.id),
    });

    if (!order) {
        console.error("❌ No Inspection Order found for this application!");
        return;
    }

    console.log(`\n✅ Inspection Order Found:`);
    console.log(`- Order ID: ${order.id}`);
    console.log(`- Assigned To User ID: ${order.assignedTo}`);

    // 3. Check for Reports (This is critical - if report exists, it disappears from Scheduled)
    const report = await db.query.inspectionReports.findFirst({
        where: eq(inspectionReports.inspectionOrderId, order.id),
    });

    console.log(`\n🔍 Inspection Report Status:`);
    if (report) {
        console.log(`⚠️  REPORT EXISTS! ID: ${report.id}`);
        console.log(`   This effectively moves it to 'Report Submitted' or 'Completed' tab.`);
        console.log(`   It will NOT appear in 'Scheduled' list.`);
    } else {
        console.log(`✅ No report found. Should be visible in 'Scheduled'.`);
    }

    // 4. Trace Visibility for DA Shimla
    const daShimla = await db.query.users.findFirst({
        where: eq(users.username, "da_shimla"),
    });
    const daShimlaHQ = await db.query.users.findFirst({
        where: eq(users.username, "da_shimla_hq"),
    });

    console.log(`\n🔍 Visibility Trace:`);
    const checkVisibility = (user: typeof daShimla) => {
        if (!user) return console.log("User not found");
        const assigned = order.assignedTo === user.id;
        const districtMatch = districtsMatch(user.district || "", app.district);
        const visible = assigned || districtMatch;
        console.log(`User '${user.username}' (${user.district}):`);
        console.log(`  - Assigned? ${assigned}`);
        console.log(`  - District Match? ${districtMatch}`);
        console.log(`  - VISIBLE via Query? ${visible ? "YES" : "NO"}`);
    };

    checkVisibility(daShimla);
    checkVisibility(daShimlaHQ);
}

debugFinalCheck().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
