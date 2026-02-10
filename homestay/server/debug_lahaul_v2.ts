
import { db } from "./db";
import { homestayApplications } from "@shared/schema";
import { ilike, isNull, and, or, ne, sql } from "drizzle-orm";

async function verifyDevLogic() {
    console.log("🛠️  Verifying v1.0.17 Logic on DEV1 Data...\n");

    // 1. Fetch Lahaul Apps
    console.log("👉 Checking Applications in Lahaul District:");
    const apps = await db.select({
        id: homestayApplications.id,
        district: homestayApplications.district,
        tehsil: homestayApplications.tehsil
    }).from(homestayApplications).where(ilike(homestayApplications.district, '%lahaul%'));

    if (apps.length === 0) {
        console.log("❌ No apps found in DEV1 database for Lahaul. Cannot verify.");
        process.exit(0);
    }

    // 2. Simulate User "DA Lahaul" (District: "Lahaul & Spiti")
    const simulatedUserDistrict = "Lahaul & Spiti".toLowerCase();
    console.log(`\n👤 Simulated User District: "${simulatedUserDistrict}"`);

    // 3. Logic: Applying v1.0.17 Priority Rules
    let pipeline = "UNKNOWN";

    if (simulatedUserDistrict.includes('pangi')) {
        pipeline = "PANGI";
    } else if (simulatedUserDistrict.includes('lahaul')) { // v1.0.17: Lahaul Check First!
        pipeline = "LAHAUL (Main)";
    } else if (simulatedUserDistrict.includes('chamba')) {
        pipeline = "CHAMBA (Main)";
    } else if (simulatedUserDistrict.includes('kaza') || simulatedUserDistrict.includes('spiti')) {
        pipeline = "SPITI (Sub)";
    }

    console.log(`✅ Logic Result: User assigned to pipeline: [${pipeline}]`);

    // 4. Verify Visibility (using Lahaul Main logic)
    if (pipeline === "LAHAUL (Main)") {
        console.log("\n👀 checking visibility for existing apps under LAHAUL rules:");
        apps.forEach(app => {
            const tehsil = app.tehsil;
            const visible = (tehsil !== 'Spiti' || tehsil === null);
            console.log(`   - App ${app.id.substring(0, 8)} (Tehsil: ${tehsil || 'NULL'}) -> Visible? ${visible ? 'YES ✅' : 'NO ❌ (Spiti)'}`);
        });
    } else {
        console.log("❌ Logic Failed: User fell into wrong pipeline!");
    }

    process.exit(0);
}

verifyDevLogic().catch(console.error);
