import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function diagnoseDB() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("❌ Error: DATABASE_URL is not set in .env");
        process.exit(1);
    }

    const pool = new Pool({ connectionString });

    try {
        const client = await pool.connect();
        console.log("🔍 Connected to Database. Running Diagnostics...");
        console.log("------------------------------------------------");

        // 1. Check Table Columns & Types
        console.log("\n📊 Table Schema: homestay_applications");
        const resCols = await client.query(`
            SELECT column_name, data_type, udt_name, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'homestay_applications'
            ORDER BY column_name;
        `);
        console.table(resCols.rows);

        // 2. Check Sequences Table
        console.log("\n🔢 Table Content: application_sequences");
        const resSeqTable = await client.query("SELECT * FROM application_sequences");
        console.table(resSeqTable.rows);

        // 3. Check Serial Sequence for ID
        console.log("\n🔢 DB Sequence: homestay_applications_id_seq");
        try {
            const resSeq = await client.query("SELECT last_value FROM homestay_applications_id_seq");
            console.log("Current Value:", resSeq.rows[0].last_value);
        } catch (e) {
            console.log("Sequence not found or error:", e.message);
        }

        // 4. Check for constraints
        console.log("\n🔒 Constraints on homestay_applications");
        const resConstraints = await client.query(`
            SELECT conname, contype, pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conrelid = 'homestay_applications'::regclass;
        `);
        console.table(resConstraints.rows);

        client.release();
    } catch (err) {
        console.error("❌ Diagnostic failed:", err.message);
    } finally {
        await pool.end();
    }
}

diagnoseDB();
