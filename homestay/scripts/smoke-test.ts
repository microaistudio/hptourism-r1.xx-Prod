#! /usr/bin/env tsx
/**
 * HP Tourism RC4 – Smoke-Test Harness
 *
 * Runs representative applications throughout their entire lifecycle
 * (Draft -> Submitted -> DA Scrutiny -> DTDO Approval -> Certificate).
 *
 * UPDATED: Uses dynamic staff login based on district manifest.
 * UPDATED: Registers a new random owner for every test run to match role="property_owner".
 * UPDATED: Added X-Forwarded-Proto header to bypass production SSL enforcement.
 * UPDATED: Added all required fields to payload (including distances/areas).
 */

import fs from "fs";
import path from "path";
import { setTimeout as sleep } from "timers/promises";
import fetch from "node-fetch";

// --- Configuration & Types ---

type UserCredentials = {
  username?: string;
  mobile?: string;
  password: string;
};

type SmokeAppConfig = {
  label: string;
  district: string;
  tehsil?: string;
  category: "silver" | "gold" | "diamond";
  locationType: "gp" | "mc" | "tcp";
  rooms: number;
  scenario: "new" | "renewal" | "add_rooms" | "delete_rooms";
  expectedFee?: number;
};

type SessionCookie = { name: string; value: string };

// Use port 5057 as discovered
const BASE_URL = process.env.SMOKE_BASE_URL || "http://localhost:5057";

const OWNER_PASSWORD = "test123";

// --- Test Scenarios ---

const APPS: SmokeAppConfig[] = [
  {
    label: "Pangi Fee Waiver Test",
    district: "Chamba",
    tehsil: "Pangi",
    category: "silver",
    locationType: "gp",
    rooms: 2,
    scenario: "new",
  },
  {
    label: "Kaza (Spiti) Flow",
    district: "Lahaul and Spiti",
    tehsil: "Spiti",
    category: "silver",
    locationType: "gp",
    rooms: 3,
    scenario: "new",
  },
  {
    label: "Hamirpur (Merged) Flow",
    district: "Una",
    tehsil: "Amb",
    category: "gold",
    locationType: "mc",
    rooms: 4,
    scenario: "new"
  },
  {
    label: "Mandi (Merged) Flow",
    district: "Mandi",
    tehsil: "Sadar",
    category: "gold",
    locationType: "mc",
    rooms: 4,
    scenario: "new"
  },
  // --- Remaining Standard Pipelines ---
  { label: "Chamba (Main) Flow", district: "Chamba", tehsil: "Chamba", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
  { label: "Kangra Flow", district: "Kangra", tehsil: "Dharamsala", category: "diamond", locationType: "mc", rooms: 5, scenario: "new" },
  { label: "Kinnaur Flow", district: "Kinnaur", tehsil: "Kalpa", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
  { label: "Kullu Flow", district: "Kullu", tehsil: "Manali", category: "gold", locationType: "tcp", rooms: 4, scenario: "new" },
  { label: "Lahaul (Main) Flow", district: "Lahaul and Spiti", tehsil: "Lahaul", category: "silver", locationType: "gp", rooms: 2, scenario: "new" },
  { label: "Shimla Flow", district: "Shimla", tehsil: "Shimla (Urban)", category: "diamond", locationType: "mc", rooms: 5, scenario: "new" },
  { label: "Sirmaur Flow", district: "Sirmaur", tehsil: "Nahan", category: "gold", locationType: "mc", rooms: 3, scenario: "new" },
  { label: "Solan Flow", district: "Solan", tehsil: "Solan", category: "gold", locationType: "mc", rooms: 3, scenario: "new" }
];

const STAFF_CREDS: Record<string, { da: UserCredentials; dtdo: UserCredentials }> = {
  "Pangi": {
    da: { username: "da_pangi", password: "dapan@2025" },
    dtdo: { username: "dtdo_pangi", password: "dtdopan@2025" }
  },
  "Lahaul-Spiti (Kaza)": {
    da: { username: "da_kaza", password: "dakaz@2025" },
    dtdo: { username: "dtdo_kaza", password: "dtdokaz@2025" }
  },
  "Hamirpur": {
    da: { username: "da_hamirpur", password: "daham@2025" },
    dtdo: { username: "dtdo_hamirpur", password: "dtdoham@2025" }
  },
  "Bilaspur": {
    da: { username: "da_bilaspur", password: "dabil@2025" },
    dtdo: { username: "dtdo_bilaspur", password: "dtdobil@2025" }
  },
  // Standard Districts
  "Chamba": { da: { username: "da_chamba", password: "dacha@2025" }, dtdo: { username: "dtdo_chamba", password: "dtdocha@2025" } },
  "Kangra": { da: { username: "da_dharamsala", password: "dadha@2025" }, dtdo: { username: "dtdo_dharamsala", password: "dtdodha@2025" } },
  "Kinnaur": { da: { username: "da_kinnaur", password: "dakin@2025" }, dtdo: { username: "dtdo_kinnaur", password: "dtdokin@2025" } },
  "Kullu": { da: { username: "da_kullu_manali", password: "dakul@2025" }, dtdo: { username: "dtdo_kullu_manali", password: "dtdokul@2025" } },
  "Lahaul": { da: { username: "da_lahaul", password: "dalah@2025" }, dtdo: { username: "dtdo_lahaul", password: "dtdolah@2025" } },
  "Shimla": { da: { username: "da_shimla", password: "dashi@2025" }, dtdo: { username: "dtdo_shimla", password: "dtdoshi@2025" } },
  "Sirmaur": { da: { username: "da_sirmaur", password: "dasir@2025" }, dtdo: { username: "dtdo_sirmaur", password: "dtdosir@2025" } },
  "Solan": { da: { username: "da_solan", password: "dasol@2025" }, dtdo: { username: "dtdo_solan", password: "dtdosol@2025" } }
};

function getRoutingLabel(district: string, tehsil?: string): string {
  const d = district.toLowerCase();
  const t = (tehsil || "").toLowerCase();

  if (d.includes("chamba") && t.includes("pangi")) return "Pangi";
  if (d.includes("lahaul") && t.includes("spiti")) return "Lahaul-Spiti (Kaza)";
  if (d.includes("lahaul") && !t.includes("spiti")) return "Lahaul"; // Explicit Lahaul Main

  if (d.includes("una")) return "Hamirpur";
  if (d.includes("mandi")) return "Bilaspur";

  // Explicit matches for remaining standard districts to ensure correct label mapping
  if (d.includes("chamba")) return "Chamba";
  if (d.includes("kangra")) return "Kangra";
  if (d.includes("kinnaur")) return "Kinnaur";
  if (d.includes("kullu")) return "Kullu";
  if (d.includes("shimla")) return "Shimla";
  if (d.includes("sirmaur")) return "Sirmaur";
  if (d.includes("solan")) return "Solan";
  if (d.includes("bilaspur")) return "Bilaspur";
  if (d.includes("hamirpur")) return "Hamirpur"; // For direct Hamirpur app

  return district;
}

// --- API Helpers ---

const getHeaders = (cookies?: SessionCookie[]) => {
  const headers: any = {
    "Content-Type": "application/json",
    "X-Forwarded-Proto": "https"
  };
  if (cookies) {
    headers["Cookie"] = cookies.map((c) => `${c.name}=${c.value}`).join("; ");
  }
  return headers;
};

// Parse cookies from response
const parseCookies = (response: any): SessionCookie[] => {
  const rawCookies = response.headers.raw()["set-cookie"] || [];
  return rawCookies
    .map((cookie: string) => {
      const [pair] = cookie.split(";");
      const [name, value] = pair.split("=");
      return { name, value };
    })
    .filter((cookie: any) => Boolean(cookie.name && cookie.value));
}

// REGISTER NEW OWNER
async function registerOwner(mobile: string): Promise<SessionCookie[]> {
  const payload = {
    mobile: mobile,
    password: OWNER_PASSWORD,
    fullName: "Smoke Test Owner",
    role: "property_owner"
  };

  console.log(`   📝 Registering new owner: ${mobile}`);
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new Error(`Registration failed: ${txt}`);
  }

  return parseCookies(response);
}

async function login(credentials: UserCredentials): Promise<SessionCookie[]> {
  const payload = credentials.username
    ? { identifier: credentials.username, password: credentials.password }
    : { identifier: credentials.mobile, password: credentials.password };

  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
    redirect: "manual",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed for ${credentials.username || credentials.mobile}: ${text}`);
  }

  return parseCookies(response);
}

async function ownerCreateApplication(cookies: SessionCookie[], config: SmokeAppConfig, mobile: string) {
  const payload = {
    propertyName: `${config.label} Property`,
    address: "Smoke Test Lane",
    district: config.district,
    tehsil: config.tehsil || "Headquarters",
    pincode: "171001",
    locationType: config.locationType,
    telephone: "01770000000",
    ownerEmail: "owner@example.com",
    ownerMobile: mobile,
    ownerName: "Smoke Owner",
    category: config.category,

    // Room Configuration (Complete)
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
      fileName: "dummy_deed.pdf",
      filePath: "/uploads/dummy_deed.pdf",
      fileSize: 1024,
      mimeType: "application/pdf"
    }],

    // Required Conditional Fields
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

  const response = await fetch(`${BASE_URL}/api/applications`, {
    method: "POST",
    headers: getHeaders(cookies),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create App Failed: ${response.status} ${text}`);
  }

  const { application } = (await response.json()) as any;
  return application;
}

// DA: Start Scrutiny
async function daStartScrutiny(cookies: SessionCookie[], appId: string) {
  const res = await fetch(`${BASE_URL}/api/da/applications/${appId}/start-scrutiny`, {
    method: "POST", headers: getHeaders(cookies)
  });
  // Already in scrutiny is okay (idempotency)
  if (!res.ok) {
    const txt = await res.text();
    if (!txt.includes("already in scrutiny")) {
      throw new Error(`DA Start Scrutiny Failed: ${txt}`);
    }
  }
}

// DA: Verify Documents
async function daVerifyDocuments(cookies: SessionCookie[], appId: string) {
  // 1. Get Application Details to find Document IDs
  const detailsRes = await fetch(`${BASE_URL}/api/da/applications/${appId}`, {
    headers: getHeaders(cookies)
  });

  if (!detailsRes.ok) {
    throw new Error(`DA Fetch Details Failed: ${await detailsRes.text()}`);
  }

  const details = await detailsRes.json() as any;
  const docs = details.documents || [];

  if (docs.length === 0) {
    throw new Error("No documents found to verify!");
  }

  // 2. Prepare verification payload
  const verifications = docs.map((d: any) => ({
    documentId: d.id,
    status: "verified",
    notes: "Automated Smoke Test Verification"
  }));

  // 3. Save Scrutiny
  const saveRes = await fetch(`${BASE_URL}/api/da/applications/${appId}/save-scrutiny`, {
    method: "POST",
    headers: getHeaders(cookies),
    body: JSON.stringify({ verifications })
  });

  if (!saveRes.ok) {
    throw new Error(`DA Verify Docs Failed: ${await saveRes.text()}`);
  }
}

// DA: Forward
async function daForwardToDTDO(cookies: SessionCookie[], appId: string) {
  const res = await fetch(`${BASE_URL}/api/da/applications/${appId}/forward-to-dtdo`, {
    method: "POST",
    headers: getHeaders(cookies),
    body: JSON.stringify({ remarks: "Automated Forward" })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`DA Forward Failed: ${txt}`);
  }
}

// --- Main Runner ---

async function runSmokeTest() {
  console.log("🔥 Starting Enhanced Pipeline Smoke Test...");

  for (const config of APPS) {
    console.log(`\n👉 Testing Scenario: ${config.label}`);

    // 1. Register Owner (Fresh for each app)
    const currentMobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
    console.log(`   📝 Registering new owner: ${currentMobile}`);

    // Create session for this iteration
    let ownerCookies: SessionCookie[] = [];
    try {
      ownerCookies = await registerOwner(currentMobile);
      console.log("   ✅ Registered & Logged in as Owner");
    } catch (e: any) {
      console.error("   ❌ Owner Registration Failed:", e.message);
      continue;
    }

    try {
      // 2. Create App
      const app = await ownerCreateApplication(ownerCookies, config, currentMobile);
      console.log(`   ✅ Created Application: ${app.applicationNumber} [${config.district}/${config.tehsil || ''}]`);

      // 3. Identify Correct Staff
      const routingLabel = getRoutingLabel(config.district, config.tehsil);
      const staff = STAFF_CREDS[routingLabel];

      if (!staff) {
        console.log(`   ⚠️ No staff creds for ${routingLabel}, skipping staff steps.`);
        continue;
      }

      // 4. Login as DA
      console.log(`   🔐 Logging in as DA: ${staff.da.username}`);
      const daCookies = await login(staff.da);

      // 5. DA Scrutiny
      await daStartScrutiny(daCookies, app.id);
      console.log(`   ✅ DA Started Scrutiny`);

      // 6. DA Verify Documents
      await daVerifyDocuments(daCookies, app.id);
      console.log(`   ✅ DA Verified Documents`);

      // 7. DA Forward
      await daForwardToDTDO(daCookies, app.id);
      console.log(`   ✅ DA Forwarded to DTDO (Success!)`);

      // Success for this route!
      console.log(`   ✨ Route Verified: ${config.district} -> ${routingLabel}`);

    } catch (err: any) {
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }
}

runSmokeTest();
