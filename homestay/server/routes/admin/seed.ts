import express from "express";
import { eq, and } from "drizzle-orm";
import { requireRole } from "../core/middleware";
import { db } from "../../db";
import { users } from "@shared/schema";
import { logger } from "../../logger";
import bcrypt from "bcrypt";

const log = logger.child({ module: "admin-seed-router" });

// Default password for seeded accounts (should be changed on first login)
const DEFAULT_PASSWORD = "Welcome@123";

// Template for DA accounts (12 districts)
const DA_TEMPLATE = [
    { username: "da_shimla", fullName: "DA Shimla", district: "Shimla" },
    { username: "da_kullu", fullName: "DA Kullu", district: "Kullu" },
    { username: "da_kangra", fullName: "DA Kangra", district: "Kangra" },
    { username: "da_mandi", fullName: "DA Mandi", district: "Mandi" },
    { username: "da_solan", fullName: "DA Solan", district: "Solan" },
    { username: "da_una", fullName: "DA Una", district: "Una" },
    { username: "da_hamirpur", fullName: "DA Hamirpur", district: "Hamirpur" },
    { username: "da_bilaspur", fullName: "DA Bilaspur", district: "Bilaspur" },
    { username: "da_chamba", fullName: "DA Chamba", district: "Chamba" },
    { username: "da_sirmaur", fullName: "DA Sirmaur", district: "Sirmaur" },
    { username: "da_kinnaur", fullName: "DA Kinnaur", district: "Kinnaur" },
    { username: "da_lahaul_spiti", fullName: "DA Lahaul & Spiti", district: "Lahaul & Spiti" },
];

// Template for DTDO accounts (12 districts)
const DTDO_TEMPLATE = [
    { username: "dtdo_shimla", fullName: "DTDO Shimla", district: "Shimla" },
    { username: "dtdo_kullu", fullName: "DTDO Kullu", district: "Kullu" },
    { username: "dtdo_kangra", fullName: "DTDO Kangra", district: "Kangra" },
    { username: "dtdo_mandi", fullName: "DTDO Mandi", district: "Mandi" },
    { username: "dtdo_solan", fullName: "DTDO Solan", district: "Solan" },
    { username: "dtdo_una", fullName: "DTDO Una", district: "Una" },
    { username: "dtdo_hamirpur", fullName: "DTDO Hamirpur", district: "Hamirpur" },
    { username: "dtdo_bilaspur", fullName: "DTDO Bilaspur", district: "Bilaspur" },
    { username: "dtdo_chamba", fullName: "DTDO Chamba", district: "Chamba" },
    { username: "dtdo_sirmaur", fullName: "DTDO Sirmaur", district: "Sirmaur" },
    { username: "dtdo_kinnaur", fullName: "DTDO Kinnaur", district: "Kinnaur" },
    { username: "dtdo_lahaul_spiti", fullName: "DTDO Lahaul & Spiti", district: "Lahaul & Spiti" },
];

export function createAdminSeedRouter() {
    const router = express.Router();

    // Seed DA accounts
    router.post("/seed/da-accounts", requireRole("super_admin"), async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            const results: { username: string; status: "created" | "exists" | "error"; message?: string }[] = [];

            for (const da of DA_TEMPLATE) {
                try {
                    // Check if user already exists
                    const [existing] = await db
                        .select()
                        .from(users)
                        .where(eq(users.username, da.username))
                        .limit(1);

                    if (existing) {
                        results.push({ username: da.username, status: "exists" });
                        continue;
                    }

                    // Create new DA account
                    await db.insert(users).values({
                        username: da.username,
                        fullName: da.fullName,
                        firstName: "DA",
                        lastName: da.district,
                        mobile: `78000010${DA_TEMPLATE.indexOf(da) + 10}`, // Generate unique mobile
                        email: `${da.username}@himachaltourism.gov.in`,
                        role: "dealing_assistant",
                        district: da.district,
                        password: hashedPassword,
                        isActive: true,
                    });

                    results.push({ username: da.username, status: "created" });
                } catch (err: any) {
                    results.push({ username: da.username, status: "error", message: err.message });
                }
            }

            const created = results.filter(r => r.status === "created").length;
            const exists = results.filter(r => r.status === "exists").length;
            const errors = results.filter(r => r.status === "error").length;

            log.info({ userId: req.session?.userId, created, exists, errors }, "[seed] DA accounts seeded");
            res.json({
                success: true,
                created,
                exists,
                errors,
                results,
                defaultPassword: DEFAULT_PASSWORD
            });
        } catch (error) {
            log.error({ err: error }, "[seed] Failed to seed DA accounts");
            res.status(500).json({ message: "Failed to seed DA accounts" });
        }
    });

    // Seed DTDO accounts
    router.post("/seed/dtdo-accounts", requireRole("super_admin"), async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            const results: { username: string; status: "created" | "exists" | "error"; message?: string }[] = [];

            for (const dtdo of DTDO_TEMPLATE) {
                try {
                    // Check if user already exists
                    const [existing] = await db
                        .select()
                        .from(users)
                        .where(eq(users.username, dtdo.username))
                        .limit(1);

                    if (existing) {
                        results.push({ username: dtdo.username, status: "exists" });
                        continue;
                    }

                    // Create new DTDO account
                    await db.insert(users).values({
                        username: dtdo.username,
                        fullName: dtdo.fullName,
                        firstName: "DTDO",
                        lastName: dtdo.district,
                        mobile: `78000020${DTDO_TEMPLATE.indexOf(dtdo) + 10}`, // Generate unique mobile
                        email: `${dtdo.username}@himachaltourism.gov.in`,
                        role: "district_tourism_officer",
                        district: dtdo.district,
                        password: hashedPassword,
                        isActive: true,
                    });

                    results.push({ username: dtdo.username, status: "created" });
                } catch (err: any) {
                    results.push({ username: dtdo.username, status: "error", message: err.message });
                }
            }

            const created = results.filter(r => r.status === "created").length;
            const exists = results.filter(r => r.status === "exists").length;
            const errors = results.filter(r => r.status === "error").length;

            log.info({ userId: req.session?.userId, created, exists, errors }, "[seed] DTDO accounts seeded");
            res.json({
                success: true,
                created,
                exists,
                errors,
                results,
                defaultPassword: DEFAULT_PASSWORD
            });
        } catch (error) {
            log.error({ err: error }, "[seed] Failed to seed DTDO accounts");
            res.status(500).json({ message: "Failed to seed DTDO accounts" });
        }
    });

    // Seed system accounts (superadmin, system_admin, supervisor_hq)
    router.post("/seed/system-accounts", requireRole("super_admin"), async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            const systemAccounts = [
                { username: "superadmin", fullName: "Super Admin", role: "super_admin" },
                { username: "system_admin", fullName: "System Admin", role: "system_admin" },
                { username: "supervisor_hq", fullName: "Supervisor HQ", role: "state_officer" },
            ];

            const results: { username: string; status: "created" | "exists" | "error"; message?: string }[] = [];

            for (const account of systemAccounts) {
                try {
                    const [existing] = await db
                        .select()
                        .from(users)
                        .where(eq(users.username, account.username))
                        .limit(1);

                    if (existing) {
                        results.push({ username: account.username, status: "exists" });
                        continue;
                    }

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

                    results.push({ username: account.username, status: "created" });
                } catch (err: any) {
                    results.push({ username: account.username, status: "error", message: err.message });
                }
            }

            const created = results.filter(r => r.status === "created").length;
            const exists = results.filter(r => r.status === "exists").length;
            const errors = results.filter(r => r.status === "error").length;

            log.info({ userId: req.session?.userId, created, exists, errors }, "[seed] System accounts seeded");
            res.json({
                success: true,
                created,
                exists,
                errors,
                results,
                defaultPassword: DEFAULT_PASSWORD
            });
        } catch (error) {
            log.error({ err: error }, "[seed] Failed to seed system accounts");
            res.status(500).json({ message: "Failed to seed system accounts" });
        }
    });

    // Get seed status (what's already seeded)
    router.get("/seed/status", requireRole("super_admin"), async (_req, res) => {
        try {
            const daUsers = await db
                .select({ username: users.username, district: users.district })
                .from(users)
                .where(eq(users.role, "dealing_assistant"));

            const dtdoUsers = await db
                .select({ username: users.username, district: users.district })
                .from(users)
                .where(eq(users.role, "district_tourism_officer"));

            const systemUsers = await db
                .select({ username: users.username, role: users.role })
                .from(users)
                .where(
                    and(
                        eq(users.role, "super_admin"),
                    )
                );

            res.json({
                da: {
                    total: DA_TEMPLATE.length,
                    seeded: daUsers.length,
                    accounts: daUsers,
                },
                dtdo: {
                    total: DTDO_TEMPLATE.length,
                    seeded: dtdoUsers.length,
                    accounts: dtdoUsers,
                },
                systemAccounts: systemUsers,
            });
        } catch (error) {
            log.error({ err: error }, "[seed] Failed to get seed status");
            res.status(500).json({ message: "Failed to get seed status" });
        }
    });

    return router;
}
