
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { logger } from "../server/logger";

const createHqUser = async () => {
    const username = "supervisor_hq";
    const password = "password123";
    const role = "state_officer";
    const fullName = "State HQ Supervisor";
    const mobile = "9800000001";
    const email = "supervisor.hq@himachaltourism.gov.in";

    try {
        const [existing] = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existing) {
            console.log(`User ${username} already exists. Updating...`);
            await db.update(users).set({
                password: hashedPassword,
                role: role,
                fullName: fullName,
                mobile: mobile,
                email: email,
                isActive: true
            }).where(eq(users.id, existing.id));
        } else {
            console.log(`Creating user ${username}...`);
            await db.insert(users).values({
                username,
                password: hashedPassword,
                role: role,
                fullName,
                mobile,
                email,
                isActive: true,
                isEmailVerified: true,
                isMobileVerified: true
            });
        }
        console.log("HQ Supervisor user created/updated successfully.");
    } catch (error) {
        console.error("Error creating HQ user:", error);
    } finally {
        process.exit(0);
    }
};

createHqUser();
