import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Checking supervisor_hq...");
    const results = await db
        .select()
        .from(users)
        .where(eq(users.username, "supervisor_hq"));

    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
}

main().catch(console.error);
