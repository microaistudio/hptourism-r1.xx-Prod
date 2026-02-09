
import { syncStaffAccountsFromManifest } from "../server/staffManifestSync";
import { db } from "../server/db";

async function runSync() {
    console.log("Starting Staff Account Sync...");
    try {
        await syncStaffAccountsFromManifest();
        console.log("✅ Staff Account Sync Completed Successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Staff Account Sync Failed:", error);
        process.exit(1);
    }
}

runSync();
