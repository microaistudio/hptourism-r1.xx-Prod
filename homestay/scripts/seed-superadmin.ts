import bcrypt from "bcrypt";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { logger } from "../server/logger";

const log = logger.child({ module: "seed-superadmin" });

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash("Welcome@123", 10);

        await db.insert(users).values({
            username: "superadmin",
            fullName: "Super Admin",
            firstName: "Super",
            lastName: "Admin",
            mobile: "7800000011",
            email: "superadmin@himachaltourism.gov.in",
            role: "super_admin",
            password: hashedPassword,
            isActive: true,
        }).onConflictDoNothing();

        log.info("✅ Superadmin account seeded successfully (or already exists)");
        process.exit(0);
    } catch (error) {
        log.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
