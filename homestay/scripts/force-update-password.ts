import bcrypt from "bcrypt";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "../server/logger";

const log = logger.child({ module: "force-update-password" });

async function run() {
    try {
        const hashedPassword = await bcrypt.hash("Welcome@123", 10);

        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.username, "superadmin"));

        log.info("✅ Superadmin password force-updated successfully");
        process.exit(0);
    } catch (error) {
        log.error("❌ Update failed:", error);
        process.exit(1);
    }
}

run();
