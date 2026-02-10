
import { db } from "./db";
import { homestayApplications, users } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

async function run() {
    console.log("\n🔍 --- DIAGNOSTIC TOOL START ---");

    // 1. Inspect the Specific Application mentioned in screenshots
    const appRef = "HP-HS-2026-LAH-000157";
    console.log(`\n📋 Checking Application: ${appRef}`);

    const apps = await db.select().from(homestayApplications).where(eq(homestayApplications.applicationNumber, appRef));

    if (apps.length === 0) {
        console.log(`❌ Application ${appRef} NOT FOUND in Database!`);
    } else {
        const app = apps[0];
        console.log(`   ✅ Found App ID: ${app.id}`);
        console.log(`   📍 DB District Value: '${app.district}'`);

        // Critical Check for Tehsil
        const tehsilVal = app.tehsil;
        const tehsilType = typeof tehsilVal;

        console.log(`   📍 DB Tehsil Value:   '${tehsilVal}'`);
        console.log(`      - Type: ${tehsilType}`);
        console.log(`      - Is Null? ${tehsilVal === null}`);
        console.log(`      - Length: ${tehsilVal ? tehsilVal.length : 'N/A'}`);

        if (tehsilVal) {
            console.log(`      - ASCII Codes: ${tehsilVal.split('').map(c => c.charCodeAt(0)).join(', ')}`);
        }

        // 2. Check DTDO Users and Simulate Logic
        console.log(`\n👤 Checking DTDO Visibility Logic against this App...`);

        // Get Lahaul and Kaza officers
        const officers = await db.select().from(users).where(ilike(users.district, '%lahaul%'));

        for (const u of officers) {
            if (u.role !== 'district_tourism_officer') continue;

            console.log(`\n   👮 Officer: ${u.email} (${u.district})`);

            const userDist = (u.district || '').toLowerCase();
            const appDist = (app.district || '').toLowerCase();
            const appTehsilLower = (app.tehsil || '').toLowerCase();

            let logicPath = "UNKNOWN";
            let shouldBeVisible = false;

            // REPLICATING EXACT SERVER LOGIC
            if (userDist.includes('kaza')) {
                logicPath = "KAZA PIPELINE";
                // Logic: Match Lahaul District AND includes 'spiti' in Tehsil
                if (appDist.includes('lahaul') && appTehsilLower.includes('spiti')) {
                    shouldBeVisible = true;
                }
            } else if (userDist.includes('lahaul')) {
                logicPath = "LAHAUL MAIN PIPELINE";
                // Logic: Match Lahaul District AND (Tehsil NOT like '%spiti%')
                // Note: If Tehsil is NULL, it IS visible.
                const isSpiti = appTehsilLower.includes('spiti');

                if (appDist.includes('lahaul') && !isSpiti) {
                    shouldBeVisible = true;
                }
            } else {
                logicPath = "OTHER";
            }

            console.log(`      - Logic Path: ${logicPath}`);
            console.log(`      - App Tehsil contains 'spiti'? ${appTehsilLower.includes('spiti')}`);
            console.log(`      - VISIBILITY RESULT: ${shouldBeVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);

            if (logicPath === "LAHAUL MAIN PIPELINE" && shouldBeVisible && appTehsilLower.includes('spiti')) {
                console.log(`      ⚠️  ALARM: This app contains 'spiti' but is VISIBLE to Lahaul?! Logic Mismatch!`);
            }
        }
    }

    console.log("\n🏁 --- DIAGNOSTIC TOOL END ---");
    process.exit(0);
}

run().catch(e => {
    console.error("Diagnostic Error:", e);
    process.exit(1);
});
