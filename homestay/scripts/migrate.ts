import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function runMigrations() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    console.log("Migration started...");
    console.log(`Connected to: ${connectionString.split("@")[1]}`); // Mask password

    const pool = new Pool({
        connectionString,
        max: 1, // Single connection for migration
    });

    const db = drizzle(pool, { schema });

    try {
        // This will run migrations from the ./migrations folder
        await migrate(db, { migrationsFolder: "./migrations" });
        console.log("Migration completed successfully!");
    } catch (err) {
        console.error("Migration failed!", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigrations();
