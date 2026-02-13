import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function checkSchema() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("Error: DATABASE_URL is not set in .env");
        process.exit(1);
    }

    const pool = new Pool({ connectionString });

    try {
        const client = await pool.connect();
        console.log("Connected to Database. Checking Schema...");
        console.log("------------------------------------------------");

        // 1. Check for specific tables
        const tablesToCheck = [
            'district_baseline_stats',
            'support_tickets',
            'grievances',
            'ccavenue_transactions',
            'users',
            'homestay_applications'
        ];

        console.log("Checking Tables:");
        for (const table of tablesToCheck) {
            const res = await client.query(
                "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)",
                [table]
            );
            const exists = res.rows[0].exists;
            console.log(`- ${table}: ${exists ? "EXISTS" : "MISSING"}`);
        }

        // 2. Check for specific columns in 'users'
        console.log("\nChecking Columns in 'users':");
        const userCols = ['sso_id', 'signature_url', 'enabled_services'];
        for (const col of userCols) {
            const res = await client.query(
                "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = $1)",
                [col]
            );
            const exists = res.rows[0].exists;
            console.log(`- ${col}: ${exists ? "EXISTS" : "MISSING"}`);
        }

        // 3. Check for specific columns in 'himkosh_transactions'
        console.log("\nChecking Columns in 'himkosh_transactions':");
        const hkCols = ['is_refunded', 'refunded_at'];
        for (const col of hkCols) {
            const res = await client.query(
                "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'himkosh_transactions' AND column_name = $1)",
                [col]
            );
            const exists = res.rows[0].exists;
            console.log(`- ${col}: ${exists ? "EXISTS" : "MISSING"}`);
        }

        console.log("------------------------------------------------");

        client.release();
    } catch (err) {
        console.error("Schema check failed:", err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
