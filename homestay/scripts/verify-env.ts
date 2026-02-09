
import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function verify() {
    console.log("🔍 Starting Production Environment Verification (v1.0.5)...\n");

    const issues: string[] = [];
    const warnings: string[] = [];

    // 1. System Parameters
    console.log("--- System Parameters ---");
    const nodeEnv = process.env.NODE_ENV || 'undefined';
    console.log(`NODE_ENV: ${nodeEnv}`);
    console.log(`PORT: ${process.env.PORT || 'undefined'}`);

    if (nodeEnv !== "production") {
        warnings.push("NODE_ENV is not set to 'production'. Performance optimizations will be disabled.");
    }

    // Check Session Secret
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === "secret") {
        warnings.push("SESSION_SECRET is weak or default. Change this for production security.");
    }

    // 2. Database Connection
    console.log("\n--- Database Check ---");
    try {
        const start = Date.now();
        await db.execute(sql`SELECT 1`);
        console.log(`✅ Database Connected (${Date.now() - start}ms)`);
    } catch (err: any) {
        console.error(`❌ Database Connection Failed: ${err.message}`);
        issues.push("Cannot connect to Database. Check DATABASE_URL.");
    }

    // 3. HimKosh Payment Gateway
    console.log("\n--- Payment Gateway Config ---");
    const testMode = process.env.VITE_HIMKOSH_TEST_MODE === "true";
    console.log(`HIMKOSH Mode: ${testMode ? "🧪 TEST MODE" : "🔒 PRODUCTION MODE"}`);

    if (nodeEnv === "production" && testMode) {
        warnings.push("URGENT: You are running in PRODUCTION but HimKosh is in TEST MODE. Real payments will not work.");
    }

    // 4. Critical Settings in DB
    console.log("\n--- Active System Controls ---");
    try {
        const configRes = await db.execute(sql`SELECT setting_key as key, setting_value as value FROM system_settings WHERE setting_key IN ('maintenance_mode_config', 'payment_pipeline_pause_config')`);

        // Parse settings
        const settings = configRes.rows.reduce((acc: any, row: any) => {
            acc[row.key] = row.value;
            return acc;
        }, {});

        const maint = settings['maintenance_mode_config'] || { enabled: false };
        const payPause = settings['payment_pipeline_pause_config'] || { enabled: false };

        console.log(`Maintenance Mode: ${maint.enabled ? "🔴 ENABLED (Site Locked)" : "🟢 Disabled (Site Live)"}`);
        if (maint.enabled) warnings.push("Maintenance Mode is currently ENABLED. Users cannot access the site.");

        console.log(`Payment Pause:    ${payPause.enabled ? "🔴 PAUSED" : "🟢 Active"}`);
        if (payPause.enabled) warnings.push("Payments are currently PAUSED. Users cannot pay.");

    } catch (e: any) {
        console.log(`⚠️ Could not fetch system settings: ${e.message}`);
        // Don't fail the whole check if table is missing (which shouldn't happen)
    }

    console.log("\n============================================");
    if (issues.length > 0) {
        console.log(`❌ CRITICAL ISSUES FOUND (${issues.length}):`);
        issues.forEach(i => console.log(` - ${i}`));
        console.log("\nFAIL: Do not deploy until critical issues are fixed.");
        process.exit(1);
    } else if (warnings.length > 0) {
        console.log(`⚠️  WARNINGS (${warnings.length}):`);
        warnings.forEach(w => console.log(` - ${w}`));
        console.log("\n✅ System matches basic requirements, but review warnings above.");
    } else {
        console.log("✅ ALL SYSTEMS GREEN. Ready for Production.");
    }
    process.exit(0);
}

verify().catch(e => {
    console.error("Script failed:", e);
    process.exit(1);
});
