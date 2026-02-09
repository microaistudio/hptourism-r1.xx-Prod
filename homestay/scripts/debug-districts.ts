import { db } from "../server/db";
import { ddoCodes } from "@shared/schema";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking districts in DB...");
    const results = await db
        .select({ district: ddoCodes.district })
        .from(ddoCodes)
        .groupBy(ddoCodes.district);

    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
}

main().catch(console.error);
