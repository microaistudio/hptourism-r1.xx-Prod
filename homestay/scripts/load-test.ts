#! /usr/bin/env tsx
/**
 * HP Tourism RC4 – Load Test Harness
 *
 * Simulates high-volume application submission and processing.
 * Usage: npx tsx scripts/load-test.ts
 */

import { setTimeout as sleep } from "timers/promises";
import fetch from "node-fetch";

// --- Configuration ---
const TOTAL_APPS = 100;
const CONCURRENCY = 5; // Simulates 5 simultaneous users
const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:5057";
const OWNER_PASSWORD = "test123";

// --- Types ---
type SessionCookie = { name: string; value: string };
type UserCredentials = { username?: string; mobile?: string; password: string; };
type SmokeAppConfig = {
    label: string; district: string; tehsil?: string;
    category: "silver" | "gold" | "diamond";
    locationType: "gp" | "mc" | "tcp";
    rooms: number; scenario: "new" | "renewal" | "add_rooms" | "delete_rooms";
};

// --- Test Data (All 12 Scenarios) ---
const SCENARIOS: SmokeAppConfig[] = [
    { label: "Pangi", district: "Chamba", tehsil: "Pangi", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
    { label: "Spiti", district: "Lahaul and Spiti", tehsil: "Spiti", category: "silver", locationType: "gp", rooms: 3, scenario: "new" },
    { label: "Hamirpur", district: "Una", tehsil: "Amb", category: "gold", locationType: "mc", rooms: 4, scenario: "new" },
    { label: "Bilaspur", district: "Mandi", tehsil: "Sadar", category: "gold", locationType: "mc", rooms: 4, scenario: "new" },
    { label: "Chamba Main", district: "Chamba", tehsil: "Chamba", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
    { label: "Kangra", district: "Kangra", tehsil: "Dharamsala", category: "diamond", locationType: "mc", rooms: 5, scenario: "new" },
    { label: "Kinnaur", district: "Kinnaur", tehsil: "Kalpa", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
    { label: "Kullu", district: "Kullu", tehsil: "Manali", category: "gold", locationType: "tcp", rooms: 4, scenario: "new" },
    { label: "Lahaul Main", district: "Lahaul and Spiti", tehsil: "Lahaul", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
    { label: "Shimla", district: "Shimla", tehsil: "Shimla (Urban)", category: "diamond", locationType: "mc", rooms: 5, scenario: "new" },
    { label: "Sirmaur", district: "Sirmaur", tehsil: "Nahan", category: "gold", locationType: "mc", rooms: 3, scenario: "new" },
    { label: "Solan", district: "Solan", tehsil: "Solan", category: "gold", locationType: "mc", rooms: 3, scenario: "new" }
];

const STAFF_CREDS: Record<string, { da: UserCredentials }> = {
    "Pangi": { da: { username: "da_pangi", password: "dapan@2025" } },
    "Lahaul-Spiti (Kaza)": { da: { username: "da_kaza", password: "dakaz@2025" } },
    "Hamirpur": { da: { username: "da_hamirpur", password: "daham@2025" } },
    "Bilaspur": { da: { username: "da_bilaspur", password: "dabil@2025" } },
    "Chamba": { da: { username: "da_chamba", password: "dacha@2025" } },
    "Kangra": { da: { username: "da_dharamsala", password: "dadha@2025" } },
    "Kinnaur": { da: { username: "da_kinnaur", password: "dakin@2025" } },
    "Kullu": { da: { username: "da_kullu_manali", password: "dakul@2025" } },
    "Lahaul": { da: { username: "da_lahaul", password: "dalah@2025" } },
    "Shimla": { da: { username: "da_shimla", password: "dashi@2025" } },
    "Sirmaur": { da: { username: "da_sirmaur", password: "dasir@2025" } },
    "Solan": { da: { username: "da_solan", password: "dasol@2025" } }
};

// --- Helpers ---

function getRoutingLabel(district: string, tehsil?: string): string {
    const d = district.toLowerCase();
    const t = (tehsil || "").toLowerCase();
    if (d.includes("chamba") && t.includes("pangi")) return "Pangi";
    if (d.includes("lahaul") && t.includes("spiti")) return "Lahaul-Spiti (Kaza)";
    if (d.includes("lahaul") && !t.includes("spiti")) return "Lahaul";
    if (d.includes("una")) return "Hamirpur";
    if (d.includes("mandi")) return "Bilaspur";
    if (d.includes("chamba")) return "Chamba";
    if (d.includes("kangra")) return "Kangra";
    if (d.includes("kinnaur")) return "Kinnaur";
    if (d.includes("kullu")) return "Kullu";
    if (d.includes("shimla")) return "Shimla";
    if (d.includes("sirmaur")) return "Sirmaur";
    if (d.includes("solan")) return "Solan";
    if (d.includes("bilaspur")) return "Bilaspur";
    if (d.includes("hamirpur")) return "Hamirpur";
    return district;
}

const getHeaders = (cookies?: SessionCookie[]) => {
    const headers: any = { "Content-Type": "application/json", "X-Forwarded-Proto": "https" };
    if (cookies) headers["Cookie"] = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
    return headers;
};

const parseCookies = (response: any): SessionCookie[] => {
    const rawCookies = response.headers.raw()["set-cookie"] || [];
    return rawCookies.map((cookie: string) => {
        const [pair] = cookie.split(";"); const [name, value] = pair.split("=");
        return { name, value };
    }).filter((c: any) => Boolean(c.name && c.value));
};

async function registerOwner(mobile: string): Promise<SessionCookie[]> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST", headers: getHeaders(),
        body: JSON.stringify({ mobile, password: OWNER_PASSWORD, fullName: `Load Test ${mobile}`, role: "property_owner" }),
    });
    if (!res.ok) throw new Error(`Registration failed: ${await res.text()}`);
    return parseCookies(res);
}

async function login(creds: UserCredentials): Promise<SessionCookie[]> {
    const id = creds.username || creds.mobile;
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST", headers: getHeaders(), redirect: "manual",
        body: JSON.stringify({ identifier: id, password: creds.password }),
    });
    if (!res.ok) throw new Error(`Login failed for ${id}: ${await res.text()}`);
    return parseCookies(res);
}

async function createApplication(cookies: SessionCookie[], config: SmokeAppConfig, mobile: string) {
    const payload = {
        propertyName: `Load Test ${config.label} ${mobile}`,
        address: "Smoke Test Lane",
        district: config.district,
        tehsil: config.tehsil || "Headquarters",
        pincode: "171001",
        locationType: config.locationType,
        telephone: "01770000000",
        ownerEmail: "load@test.com",
        ownerMobile: mobile,
        ownerName: "Load User",
        category: config.category,

        // Room Configuration
        singleBedRooms: config.rooms,
        singleBedBeds: 1,
        singleBedRoomRate: 2000,
        singleBedRoomSize: 120,

        doubleBedRooms: 0,
        doubleBedBeds: 2,
        doubleBedRoomRate: 0,
        doubleBedRoomSize: 0,

        familySuites: 0,
        familySuiteBeds: 4,
        familySuiteRate: 0,
        familySuiteSize: 0,

        // Must match highest rate
        proposedRoomRate: 2000,

        attachedWashrooms: config.rooms,
        lobbyArea: 100,
        diningArea: 100,
        parkingArea: "Yes",
        ecoFriendlyFacilities: "None",

        // Distances
        distanceAirport: 10,
        distanceRailway: 20,
        distanceCityCenter: 5,
        distanceShopping: 3,
        distanceBusStand: 2,

        projectType: "new_project",
        propertyOwnership: "owned",
        propertyArea: 1200,
        propertyAreaUnit: "sqft",
        certificateValidityYears: 1,
        totalRooms: config.rooms,

        // Fees
        baseFee: 5000,
        totalBeforeDiscounts: 5000,
        totalFee: 5000,

        documents: [{
            documentType: "proof_of_ownership",
            fileName: "load_test_doc.pdf",
            filePath: "/uploads/dummy.pdf",
            fileSize: 1024,
            mimeType: "application/pdf"
        }],

        // Required Conditional Fields across all scenarios
        block: "Test Block",
        gramPanchayat: "Test GP",
        urbanBody: "Test MC",
        ward: "1",
        tehsilOther: "",
        blockOther: "",
        gramPanchayatOther: "",
        urbanBodyOther: "",
        ownerGender: "male",
        ownerAadhaar: "123456789012",
        gstin: ""
    };
    const res = await fetch(`${BASE_URL}/api/applications`, { method: "POST", headers: getHeaders(cookies), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`Create App Failed: ${res.status} ${await res.text()}`);
    const { application } = (await res.json()) as any;
    return application;
}

// Full Workflow for 1 User
async function runUserFlow(idx: number) {
    const config = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const mobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
    const start = Date.now();

    try {
        // 1. Owner Register
        const ownerCookies = await registerOwner(mobile);

        // 2. Create App
        const app = await createApplication(ownerCookies, config, mobile);

        // 3. DA Login & Forward (Optional - high load might skip this to save time, but user asked for full flow)
        const label = getRoutingLabel(config.district, config.tehsil);
        const staff = STAFF_CREDS[label];
        if (staff) {
            const daCookies = await login(staff.da);
            // Start Scrutiny
            await fetch(`${BASE_URL}/api/da/applications/${app.id}/start-scrutiny`, { method: "POST", headers: getHeaders(daCookies) });
            // Verify Docs
            const verifyPayload = { verifications: app.documents?.map((d: any) => ({ documentId: d.id, status: "verified" })) };
            await fetch(`${BASE_URL}/api/da/applications/${app.id}/save-scrutiny`, { method: "POST", headers: getHeaders(daCookies), body: JSON.stringify(verifyPayload) });
            // Forward
            await fetch(`${BASE_URL}/api/da/applications/${app.id}/forward-to-dtdo`, { method: "POST", headers: getHeaders(daCookies), body: JSON.stringify({ remarks: "Load Test Forward" }) });
        }

        const duration = Date.now() - start;
        process.stdout.write("✅"); // Progress tick
        return { success: true, duration, district: config.district };
    } catch (e: any) {
        process.stdout.write("❌");
        return { success: false, duration: Date.now() - start, error: e.message };
    }
}

// --- Main Runner ---
async function runLoadTest() {
    console.log(`🚀 Starting Load Test via API`);
    console.log(`🎯 Target: ${TOTAL_APPS} applications`);
    console.log(`⚡ Concurrency: ${CONCURRENCY} workers`);
    console.log(`-----------------------------------------------`);

    const results: any[] = [];
    const chunks = [];
    for (let i = 0; i < TOTAL_APPS; i += CONCURRENCY) {
        chunks.push(Array.from({ length: Math.min(CONCURRENCY, TOTAL_APPS - i) }, (_, k) => i + k));
    }

    const overallStart = Date.now();

    for (const chunk of chunks) {
        const promises = chunk.map((idx) => runUserFlow(idx));
        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);
    }

    const overallDuration = (Date.now() - overallStart) / 1000;
    const successes = results.filter(r => r.success);
    const failures = results.filter(r => !r.success);
    const avgTime = successes.reduce((acc, r) => acc + r.duration, 0) / (successes.length || 1);

    console.log(`\n\n📊 Load Test Results`);
    console.log(`-----------------------------------------------`);
    console.log(`⏱️  Total Time:   ${overallDuration.toFixed(2)}s`);
    console.log(`✅ Success:      ${successes.length} / ${TOTAL_APPS}`);
    console.log(`❌ Failed:       ${failures.length} / ${TOTAL_APPS}`);
    console.log(`📉 Avg Req Time: ${(avgTime / 1000).toFixed(2)}s`);
    console.log(`🚀 Throughput:   ${(TOTAL_APPS / overallDuration * 60).toFixed(1)} apps/min`);

    if (failures.length > 0) {
        console.log(`\n⚠️ Failure Samples:`);
        failures.slice(0, 5).forEach(f => console.log(` - ${f.error}`));
    }
}

runLoadTest();
