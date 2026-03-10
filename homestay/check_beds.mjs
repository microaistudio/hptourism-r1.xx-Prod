import 'dotenv/config';
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const apps = await pool.query("SELECT application_number, status, category FROM homestay_applications WHERE status = 'approved';");
console.table(apps.rows);
pool.end();
