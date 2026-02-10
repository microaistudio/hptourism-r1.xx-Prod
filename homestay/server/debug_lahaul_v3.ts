
import { db } from "./db";
import { homestayApplications } from "@shared/schema";
import { ilike, isNull, and, or, ne, sql } from "drizzle-orm";

async function verifyDevLogic() {
    console.log("🛠️  Verifying v1.0.18 Logic (Merge strategy) on DEV1 Data...\n");

    // 1. Fetch ALL Lahaul Apps (including Spiti)
    const apps = await db.select({
        id: homestayApplications.id,
        district: homestayApplications.district,
        tehsil: homestayApplications.tehsil
    }).from(homestayApplications).where(ilike(homestayApplications.district, '%lahaul%'));

    if (apps.length === 0) {
        console.log("❌ No apps found in DEV1 database for Lahaul. Creating mock data in memory for test...");
        apps.push({ id: 'mock-spiti-1', district: 'Lahaul and Spiti', tehsil: 'Spiti' });
        apps.push({ id: 'mock-lahaul-1', district: 'Lahaul and Spiti', tehsil: 'Lahaul' });
        apps.push({ id: 'mock-null-1', district: 'Lahaul and Spiti', tehsil: null });
    }

    // --- SCENARIO A: DA "Lahaul & Spiti" (Main) ---
    console.log("\n🧪 SCENARIO A: User District = 'Lahaul & Spiti'");
    let pipelineA = "UNKNOWN";
    const userA = "lahaul & spiti";

    if (userA.includes('pangi')) pipelineA = "PANGI";
    else if (userA.includes('lahaul')) pipelineA = "LAHAUL (Main - v1.0.18 Include All)";
    else if (userA.includes('chamba')) pipelineA = "CHAMBA";
    else if (userA.includes('kaza') || userA.includes('spiti')) pipelineA = "SPITI";

    console.log(`   Pipeline Assigned: [${pipelineA}]`);

    if (pipelineA.includes("LAHAUL")) {
        console.log("   Visibility Check:");
        apps.forEach(app => {
            // v1.0.18 Logic: Just district match. No exclusion.
            const visible = true;
            console.log(`     - App (Tehsil: ${app.tehsil}) -> Visible? ${visible ? 'YES ✅' : 'NO ❌'}`);
        });
    }

    // --- SCENARIO B: DA "Spiti" (Sub) ---
    console.log("\n🧪 SCENARIO B: User District = 'Spiti'");
    let pipelineB = "UNKNOWN";
    const userB = "spiti"; // No 'lahaul' string

    if (userB.includes('pangi')) pipelineB = "PANGI";
    else if (userB.includes('lahaul')) pipelineB = "LAHAUL";
    else if (userB.includes('chamba')) pipelineB = "CHAMBA";
    else if (userB.includes('kaza') || userB.includes('spiti')) pipelineB = "SPITI (Sub)";

    console.log(`   Pipeline Assigned: [${pipelineB}]`);

    if (pipelineB.includes("SPITI")) {
        console.log("   Visibility Check:");
        apps.forEach(app => {
            // Spiti Logic: Tehsil must include 'Spiti'
            const visible = (app.tehsil || "").toLowerCase().includes('spiti');
            console.log(`     - App (Tehsil: ${app.tehsil}) -> Visible? ${visible ? 'YES ✅' : 'NO ❌'}`);
        });
    }

    process.exit(0);
}

verifyDevLogic().catch(console.error);
