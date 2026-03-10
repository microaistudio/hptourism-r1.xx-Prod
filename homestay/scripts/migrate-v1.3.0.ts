#!/usr/bin/env node
/**
 * v1.3.0 Migration Script
 * 
 * Run this ONCE on production BEFORE starting the new app version:
 *   node dist/migrate-v1.3.0.js
 * 
 * This script is self-contained — it reads DATABASE_URL from the environment
 * (same .env as the app) and applies all schema changes using raw SQL.
 * No internet access required.
 * 
 * Safe to re-run: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.
 */

import pg from "pg";
import { config } from "dotenv";

// Load .env from the app directory
config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Please check your .env file.");
    process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

async function migrate() {
    const client = await pool.connect();
    try {
        console.log("🔄 v1.3.0 Migration — Starting...\n");

        // ─────────────────────────────────────────────────────────
        // 1. Add new columns to homestay_applications
        // ─────────────────────────────────────────────────────────
        console.log("  [1/4] Adding correction columns to homestay_applications...");

        const appColumns = [
            `ALTER TABLE homestay_applications ADD COLUMN IF NOT EXISTS pending_correction_type varchar(50)`,
            `ALTER TABLE homestay_applications ADD COLUMN IF NOT EXISTS previous_category varchar(20)`,
            `ALTER TABLE homestay_applications ADD COLUMN IF NOT EXISTS previous_validity_years integer`,
            `ALTER TABLE homestay_applications ADD COLUMN IF NOT EXISTS previous_total_fee numeric(10,2)`,
        ];

        for (const sql of appColumns) {
            await client.query(sql);
        }
        console.log("  ✅ homestay_applications columns added.\n");

        // ─────────────────────────────────────────────────────────
        // 2. Add correctionType column to application_actions
        // ─────────────────────────────────────────────────────────
        console.log("  [2/4] Adding correction_type to application_actions...");

        await client.query(`
      ALTER TABLE application_actions 
      ADD COLUMN IF NOT EXISTS correction_type varchar(50)
    `);
        console.log("  ✅ application_actions column added.\n");

        // ─────────────────────────────────────────────────────────
        // 3. Create credit_ledger table
        // ─────────────────────────────────────────────────────────
        console.log("  [3/4] Creating credit_ledger table...");

        await client.query(`
      CREATE TABLE IF NOT EXISTS credit_ledger (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id varchar NOT NULL REFERENCES homestay_applications(id) ON DELETE CASCADE,
        user_id varchar NOT NULL REFERENCES users(id),
        
        reason varchar(100) NOT NULL,
        correction_action_id varchar REFERENCES application_actions(id),
        
        previous_fee numeric(10,2) NOT NULL,
        new_fee numeric(10,2) NOT NULL,
        credit_amount numeric(10,2) NOT NULL,
        
        status varchar(50) NOT NULL DEFAULT 'recorded',
        applied_to_application_id varchar REFERENCES homestay_applications(id),
        applied_at timestamp,
        
        notes text,
        created_by varchar NOT NULL REFERENCES users(id),
        created_at timestamp DEFAULT now()
      )
    `);
        console.log("  ✅ credit_ledger table created.\n");

        // ─────────────────────────────────────────────────────────
        // 4. Create indexes on credit_ledger
        // ─────────────────────────────────────────────────────────
        console.log("  [4/4] Creating indexes...");

        const indexes = [
            `CREATE INDEX IF NOT EXISTS credit_ledger_user_idx ON credit_ledger(user_id)`,
            `CREATE INDEX IF NOT EXISTS credit_ledger_app_idx ON credit_ledger(application_id)`,
            `CREATE INDEX IF NOT EXISTS credit_ledger_status_idx ON credit_ledger(status)`,
        ];

        for (const sql of indexes) {
            await client.query(sql);
        }
        console.log("  ✅ Indexes created.\n");

        // ─────────────────────────────────────────────────────────
        // Verify
        // ─────────────────────────────────────────────────────────
        console.log("  🔍 Verifying migration...");

        const verifyColumns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'homestay_applications' 
        AND column_name IN ('pending_correction_type', 'previous_category', 'previous_validity_years', 'previous_total_fee')
      ORDER BY column_name
    `);
        console.log(`     homestay_applications: ${verifyColumns.rows.map(r => r.column_name).join(', ')}`);

        const verifyActionCol = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'application_actions' AND column_name = 'correction_type'
    `);
        console.log(`     application_actions: ${verifyActionCol.rows.length > 0 ? 'correction_type ✅' : '❌ MISSING'}`);

        const verifyTable = await client.query(`
      SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'credit_ledger')
    `);
        console.log(`     credit_ledger table: ${verifyTable.rows[0].exists ? '✅' : '❌ MISSING'}`);

        console.log("\n✅ v1.3.0 Migration completed successfully!");
        console.log("   You can now restart the app with: pm2 restart hptourism-prod\n");

    } catch (error) {
        console.error("\n❌ Migration failed:", error.message);
        console.error(error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
