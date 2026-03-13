import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function run() {
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "verified_single_bed_rooms" integer;`);
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "verified_double_bed_rooms" integer;`);
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "verified_family_suites" integer;`);
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "room_correction_notes" text;`);
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "aadhaar_verified" boolean DEFAULT false;`);
  await db.execute(sql`SET ROLE postgres; ALTER TABLE "inspection_reports" ADD COLUMN IF NOT EXISTS "verified_aadhaar_number" varchar(20);`);
  console.log("Migration executed!");
  process.exit(0);
}
run().catch(console.error);
