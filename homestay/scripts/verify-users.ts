import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq, or } from "drizzle-orm";

async function verifyUsers() {
    console.log("Verifying seeded users...");

    try {
        // Check Admin Accounts
        const admins = await db.select().from(users).where(
            or(
                eq(users.role, 'superadmin'),
                eq(users.role, 'admin'),
                eq(users.role, 'admin_rc')
            )
        );

        console.log("\n--- Superadmin / Admin Accounts ---");
        if (admins.length > 0) {
            console.table(admins.map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                active: u.active
            })));
        } else {
            console.log("❌ No superadmin or admin accounts found.");
        }

        // Check DA Accounts (Sample) - Role: dealing_assistant
        const daAccounts = await db.select().from(users).where(eq(users.role, 'dealing_assistant')).limit(5);

        console.log("\n--- District Admin (DA) Accounts (First 5) ---");
        if (daAccounts.length > 0) {
            console.table(daAccounts.map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                district: u.district,
                active: u.active
            })));
        } else {
            console.log("❌ No District Admin accounts found (Role: dealing_assistant).");
        }

        // Check DTDO Accounts (Sample) - Role: district_tourism_officer
        const dtdoAccounts = await db.select().from(users).where(eq(users.role, 'district_tourism_officer')).limit(5);

        console.log("\n--- DTDO Accounts (First 5) ---");
        if (dtdoAccounts.length > 0) {
            console.table(dtdoAccounts.map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                district: u.district,
                active: u.active
            })));
        } else {
            console.log("❌ No DTDO accounts found (Role: district_tourism_officer).");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error querying database:", error);
        process.exit(1);
    }
}

verifyUsers();
