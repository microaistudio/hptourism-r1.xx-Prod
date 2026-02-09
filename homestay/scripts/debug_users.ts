
import { db } from "../server/db";
import { users } from "../shared/schema";
import { count } from "drizzle-orm";

async function run() {
    console.log("Checking DB connection...");
    try {
        const userCount = await db.select({ count: count() }).from(users);
        console.log("User count in DB:", userCount[0]?.count);

        const allUsers = await db.select().from(users).limit(5);
        console.log("First 5 users:", JSON.stringify(allUsers, null, 2));

        // Check fields specifically
        if (allUsers.length > 0) {
            console.log("Sample user keys:", Object.keys(allUsers[0]));
        }
    } catch (error) {
        console.error("Error querying DB:", error);
    }
    process.exit(0);
}

run();
