
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function ensureTester() {
    console.log("Checking for 'tester' user...");

    let existingUser = await db.query.users.findFirst({
        where: eq(users.username, "tester"),
    });

    if (!existingUser) {
        console.log("Username 'tester' not found. Checking mobile '9999999999'...");
        existingUser = await db.query.users.findFirst({
            where: eq(users.mobile, "9999999999"),
        });
    }

    const password = "welcome@2025";
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
        console.log(`User found (id=${existingUser.id}). Updating to 'tester' with new password...`);
        await db
            .update(users)
            .set({
                username: "tester",
                password: hashedPassword,
                role: "system_admin",
                isActive: true,
            })
            .where(eq(users.id, existingUser.id));
        console.log("User updated.");
    } else {
        console.log("User 'tester' not found. Creating...");
        await db.insert(users).values({
            username: "tester",
            fullName: "System Tester",
            email: "tester@hp.gov.in",
            mobile: "9999999999",
            role: "system_admin",
            password: hashedPassword,
            isActive: true,
        });
        console.log("User 'tester' created.");
    }

    process.exit(0);
}

ensureTester().catch((err) => {
    console.error(err);
    process.exit(1);
});
