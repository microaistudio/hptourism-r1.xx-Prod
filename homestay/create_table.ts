import { pool } from "./server/db";

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "help_resources" (
      "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" text,
      "type" varchar(20) NOT NULL,
      "content_url" text,
      "content_body" text,
      "is_active" boolean DEFAULT true,
      "display_order" integer DEFAULT 0,
      "created_by" varchar,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );
  `);
  console.log("Table created.");
  process.exit(0);
}
main();
