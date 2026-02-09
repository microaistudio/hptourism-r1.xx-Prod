import bcrypt from "bcrypt";
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "../server/logger";

const log = logger.child({ module: "manual-seed-system" });

const DEFAULT_PASSWORD = "Welcome@123";

const systemAccounts = [
    { username: "superadmin", fullName: "Super Admin", role: "super_admin" },
    { username: "system_admin", fullName: "System Admin", role: "system_admin" },
    { username: "supervisor_hq", fullName: "Supervisor HQ", role: "state_officer" },
];

async function run() {
    try {
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

        for (const account of systemAccounts) {
            const [existing] = await db
                .select()
                .from(users)
                .where(eq(users.username, account.username))
                .limit(1);

            if (existing) {
                log.info(`Account ${account.username} exists, updating role and password...`);
                await db.update(users)
                    .set({
                        role: account.role as any,
                        password: hashedPassword,
                        fullName: account.fullName,
                        isActive: true
                    })
                    .where(eq(users.username, account.username));
                continue;
            }

            log.info(`Creating account ${account.username}...`);
            await db.insert(users).values({
                username: account.username,
                fullName: account.fullName,
                firstName: account.fullName.split(" ")[0],
                lastName: account.fullName.split(" ").slice(1).join(" ") || "Admin",
                mobile: `78000000${systemAccounts.indexOf(account) + 1}1`,
                email: `${account.username}@himachaltourism.gov.in`,
                role: account.role as any,
                password: hashedPassword,
                isActive: true,
            });
        }

        log.info("✅ System accounts seeded successfully");
        process.exit(0);
    } catch (error) {
        log.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

run();
