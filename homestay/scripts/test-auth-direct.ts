import bcrypt from "bcrypt";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "../server/logger";

const log = logger.child({ module: "test-auth-direct" });

async function test() {
    try {
        const [user] = await db.select().from(users).where(eq(users.username, "superadmin")).limit(1);
        if (!user) {
            log.error("❌ User superadmin not found");
            process.exit(1);
        }

        const match = await bcrypt.compare("Welcome@123", user.password!);
        log.info(`Result: ${match ? "✅ MATCH" : "❌ MISMATCH"}`);
        log.info(`Hash in DB: ${user.password}`);

        const newHash = await bcrypt.hash("Welcome@123", 10);
        log.info(`New hash would be: ${newHash}`);

        process.exit(0);
    } catch (error) {
        log.error("❌ Error:", error);
        process.exit(1);
    }
}

test();
