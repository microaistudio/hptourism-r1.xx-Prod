import { pgTable, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || "postgresql://hptourism_dev1:dev_password_123@localhost:5432/hptourism_dev1" });
const db = drizzle(pool);
import { eq, or } from "drizzle-orm";
const apps = pgTable("homestay_applications", {
  applicationNumber: varchar("application_number"),
  certificateNumber: varchar("certificate_number"),
  status: varchar("status")
});
const val = "LG-HP-2026-000092";
async function run() {
  const result = await db.select().from(apps).where(or(
    eq(apps.applicationNumber, val),
    eq(apps.certificateNumber, val)
  ));
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
run();
