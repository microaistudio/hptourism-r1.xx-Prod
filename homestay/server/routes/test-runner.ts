import { Router } from "express";
import { db } from "../db";
import { users, homestayApplications, ddoCodes, type ApplicationKind } from "@shared/schema";
import { eq, like, desc } from "drizzle-orm";
import { APP_CONSTANTS, APPLICATION_STATUSES } from "@shared/constants";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

const router = Router();

// SAFETY CHECK: Middleware to block in Production unless explicitly enabled
router.use((req, res, next) => {
    // console.log(`[TestRunner] Request: ${req.method} ${req.originalUrl}`);
    const isProd = process.env.NODE_ENV === "production";
    const isEnabled = process.env.ENABLE_TEST_RUNNER === "true";

    // console.log(`[TestRunner] Env: Prod=${isProd}, Enabled=${isEnabled}`);

    if (isProd && !isEnabled) {
        console.warn("⛔️ Blocked Test Runner access in Production");
        return res.status(403).json({ error: "Test Runner is DISABLED in Production environment." });
    }
    next();
});

// --- HELPER: Random Application Generator ---
function generateDummyApplication(district: string, tehsil: string | undefined, ownerId: string, index: number) {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    const appNumber = `TEST-${district.substring(0, 3).toUpperCase()}-${timestamp}-${randomSuffix}`;

    return {
        userId: ownerId,
        applicationNumber: appNumber,
        applicationKind: 'new_registration' as ApplicationKind,
        propertyName: `TEST Homestay ${district} ${index + 1}`,
        category: 'gold' as const,
        locationType: 'gm' as const, // gram panchayat
        totalRooms: 3,

        // Address
        district: district,
        tehsil: tehsil || 'Test Tehsil', // Use provided or default
        address: 'Test Address Line 1',
        pincode: '171001',

        // Owner
        ownerName: 'Test Owner',
        ownerGender: 'male' as const,
        ownerMobile: '9999999999',
        ownerAadhaar: '999999999999',

        // Status
        status: APPLICATION_STATUSES.DRAFT,
        currentStage: 'document_upload',

        // Fee
        baseFee: '500.00',
        totalFee: '500.00',

        // Meta
        formCompletionTimeSeconds: 0,
        projectType: 'homestay',
        propertyArea: '250.00',
        attachedWashrooms: 3
    };
}


// 1. BATCH CREATE APPLICATIONS
router.post("/seed-applications", async (req, res) => {
    try {
        const { district, tehsil, count = 1, status = "draft", bypassPayment = false } = req.body;

        if (!district) return res.status(400).json({ error: "District is required" });
        if (count > 10) return res.status(400).json({ error: "Max 10 applications per batch" });

        // 1. Get or Create a Dummy User for this District
        // We try to find a "test_owner" or creating one.
        // For simplicity, we'll assign to the first available property_owner in DB.

        // 1. Normalize District/Tehsil for Special Regions (Pangi, Kaza, Lahaul)
        // 1. Normalize District/Tehsil for Special Regions (Pangi, Kaza, Lahaul) for OWNER PROFILE
        let ownerDistrict = district;
        let ownerTehsil = tehsil || district;

        // Application District might differ (Virtual Routing)
        let appDistrict = district;

        if (district === "Pangi") {
            ownerDistrict = "Chamba";
            appDistrict = "Pangi"; // Routing Label
            ownerTehsil = "Pangi";
        } else if (district === "Spiti" || district === "Kaza" || district.includes("Kaza")) {
            ownerDistrict = "Lahaul and Spiti";
            appDistrict = "Lahaul-Spiti (Kaza)"; // Routing Label
            ownerTehsil = "Spiti";
        } else if (district === "Lahaul") {
            ownerDistrict = "Lahaul and Spiti";
            appDistrict = "Lahaul"; // Routing Label
            ownerTehsil = "Lahaul";
        } else if (district === "Chamba" && tehsil?.toLowerCase() === "pangi") {
            ownerDistrict = "Chamba";
            appDistrict = "Pangi";
            ownerTehsil = "Pangi";
        }

        // 2. Get or Create a Dummy User for this District
        let owner = await db.query.users.findFirst({
            where: eq(users.role, 'property_owner')
        });

        if (!owner) {
            // console.log("[TestRunner] No property owner found, creating dummy owner...");
            const dummyId = randomUUID();
            const dummyPasswordHash = await hash("password123", 10);

            [owner] = await db.insert(users).values({
                id: dummyId,
                username: "test_owner",
                password: dummyPasswordHash,
                fullName: "Test Property Owner",
                email: "test_owner_unique@example.com",
                mobile: "9999999000", /* Changed to avoid conflict */
                role: "property_owner",
                district: ownerDistrict, // Assign to the requested district (Normalized)
                isActive: true,
                isVerified: true
            }).returning();
        }

        const createdApps = [];

        for (let i = 0; i < count; i++) {
            const dummyData = generateDummyApplication(appDistrict, ownerTehsil, owner.id, i);

            // Override status if requested
            if (status === 'submitted') {
                dummyData.status = APPLICATION_STATUSES.SUBMITTED;
                dummyData.submittedAt = new Date();
                dummyData.currentStage = 'document_verification';

                if (bypassPayment) {
                    dummyData.paymentStatus = 'paid';
                    dummyData.paymentAmount = '500.00';
                    dummyData.paymentDate = new Date();
                    dummyData.paymentId = `TEST-PAY-${nanoid(8)}`;
                }
            }

            await db.insert(homestayApplications).values(dummyData as any);
            createdApps.push(dummyData.applicationNumber);
        }

        res.json({
            success: true,
            message: `Created ${count} applications for ${district}`,
            applications: createdApps
        });

    } catch (error: any) {
        console.error("Test Runner Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. ROUTING STATS
router.get("/routing-stats", async (req, res) => {
    try {
        // Return count of applications grouped by District and Current Stage
        // This helps verify if they are landing in the right queues
        const stats = await db.select({
            district: homestayApplications.district,
            status: homestayApplications.status,
        }).from(homestayApplications);

        // Aggregate in memory for simplicity (or select count group by in SQL)
        const aggregation: Record<string, any> = {};

        stats.forEach(s => {
            if (!aggregation[s.district]) aggregation[s.district] = {};
            if (!aggregation[s.district][s.status || 'unknown']) aggregation[s.district][s.status || 'unknown'] = 0;
            aggregation[s.district][s.status || 'unknown']++;
        });

        res.json(aggregation);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


// 2. PREVIEW INTEGRATION MAPPING
// Shows the user what DDO/Tehsil will be selected for a given district
router.get("/preview-integration", async (req, res) => {
    try {
        const district = req.query.district as string || "Shimla";

        // Dynamic Imports to avoid circular deps if any
        const { deriveDistrictRoutingLabel } = await import("@shared/districtRouting");
        const { resolveDistrictDdo } = await import("../himkosh/ddo");
        const { getHimKoshConfig } = await import("../himkosh/config");

        const config = getHimKoshConfig();

        // Use district name as tehsil for standard districts (matches setup-integration-payment)
        let dbDistrict = district;
        let dbTehsil = district;

        if (district.toLowerCase() === "pangi") {
            dbDistrict = "Chamba";
            dbTehsil = "Pangi";
        } else if (district.includes("Kaza") || district.toLowerCase() === "spiti") {
            dbDistrict = "Lahaul and Spiti";
            dbTehsil = "Spiti";
        } else if (district.toLowerCase() === "lahaul") {
            dbDistrict = "Lahaul and Spiti";
            dbTehsil = "Lahaul";
        }

        const routingLabel = deriveDistrictRoutingLabel(dbDistrict, dbTehsil) || dbDistrict;
        const ddoMapping = await resolveDistrictDdo(routingLabel, dbTehsil);

        res.json({
            district: dbDistrict,
            tehsil: dbTehsil,
            routingLabel,
            ddoCode: ddoMapping?.ddoCode || config.ddo,
            head1: ddoMapping?.head1 || config.heads.registrationFee
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 3. SETUP INTEGRATION PAYMENT TEST
// Creates a real DB record so we can test the EXACT production flow via /api/himkosh/initiate
router.post("/setup-integration-payment", async (req, res) => {
    try {
        const { district = "Shimla" } = req.body;

        // 1. Map Special Districts to DB Format
        // Use district name as tehsil for standard districts (triggers proper DDO lookup)
        let dbDistrict = district;
        let dbTehsil = district; // Use district name as tehsil for DDO resolution

        if (district.toLowerCase() === "pangi") {
            dbDistrict = "Chamba";
            dbTehsil = "Pangi"; // Triggers Pangi Pipeline
        } else if (district.includes("Kaza") || district.toLowerCase() === "spiti") {
            dbDistrict = "Lahaul and Spiti";
            dbTehsil = "Spiti"; // Triggers Kaza Pipeline
        } else if (district.toLowerCase() === "lahaul") {
            dbDistrict = "Lahaul and Spiti";
            dbTehsil = "Lahaul"; // Triggers Lahaul Pipeline
        }

        // 2. Get Owner (reuse logic)
        // 2. Get or Create Owner (reuse logic)
        let owner = await db.query.users.findFirst({
            where: eq(users.role, 'property_owner')
        });

        if (!owner) {
            const dummyId = randomUUID();
            const dummyPasswordHash = await hash("password123", 10);

            [owner] = await db.insert(users).values({
                id: dummyId,
                username: "test_owner",
                password: dummyPasswordHash,
                fullName: "Test Property Owner",
                email: "test_owner_unique@example.com",
                mobile: "9999999000",
                role: "property_owner",
                district: dbDistrict,
                isActive: true,
                isVerified: true
            }).returning();
        }

        // 3. Create Application (Payment Pending)
        const timestamp = Date.now();
        const appNumber = `TEST-${dbDistrict.substring(0, 3).toUpperCase()}-${timestamp}`;

        const dummyData = {
            userId: owner.id,
            applicationNumber: appNumber,
            applicationKind: 'new_registration' as ApplicationKind,
            propertyName: `Payment Integration Test (${district})`,
            category: 'gold' as const,
            locationType: 'gm' as const,
            totalRooms: 3,
            district: dbDistrict,
            tehsil: dbTehsil, // Critical for routing
            address: 'Test Address Line 1',
            pincode: '171001',
            ownerName: 'Test Owner',
            ownerGender: 'male' as const,
            ownerMobile: '9999999999',
            ownerAadhaar: '999999999999',
            status: APPLICATION_STATUSES.PAYMENT_PENDING,
            currentStage: 'payment',
            baseFee: '500.00',
            totalFee: '500.00',
            formCompletionTimeSeconds: 0,
            projectType: 'homestay',
            // REQUIRED FIELDS FOR SCHEMA VALIDATION:
            propertyArea: '100.00', // sq meters (Decimal)
            attachedWashrooms: 3,
            confirmed: true
        };

        const [created] = await db.insert(homestayApplications).values(dummyData as any).returning();

        res.json({
            success: true,
            applicationId: created.id,
            applicationNumber: created.applicationNumber,
            mapped: {
                district: dbDistrict,
                tehsil: dbTehsil
            }
        });

    } catch (error: any) {
        console.error("Integration Setup Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. GET TEST REPORTS
router.get("/reports", async (req, res) => {
    try {
        const results = {
            playwright: null,
            vitest: null
        };

        // Helper to safely read JSON
        const readReport = async (filename: string) => {
            try {
                const filePath = path.join(process.cwd(), "test-results", filename);
                const data = await fs.readFile(filePath, "utf-8");
                return JSON.parse(data);
            } catch (e) {
                return null; // Return null if file doesn't exist yet
            }
        };

        results.playwright = await readReport("playwright-report.json");
        results.vitest = await readReport("vitest-report.json");

        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
