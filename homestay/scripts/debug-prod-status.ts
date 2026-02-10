
import { db } from "../server/db";
import { users, homestayApplications, userProfiles } from "@shared/schema";
import { ilike, eq, isNull, and, sql } from "drizzle-orm";
import { storage } from "../server/storage";

async function inspectProd() {
    console.log("\n🔍 --- PROD STATUS INSPECTION ---\n");

    // 1. Inspect DA Users for Lahaul/Spiti
    console.log("👉 1. INSPECTING DA USERS (Lahaul/Spiti/Keylong/Kaza):");
    const daUsers = await db.select({
        id: users.id,
        email: users.email,
        fullName: userProfiles.fullName,
        district: userProfiles.district,
        role: users.role,
    })
        .from(users)
        .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
        .where(
            and(
                eq(users.role, 'dealing_assistant'),
                sql`(${userProfiles.district} ILIKE '%lahaul%' OR ${userProfiles.district} ILIKE '%spiti%' OR ${userProfiles.district} ILIKE '%kaza%' OR ${userProfiles.district} ILIKE '%keylong%')`
            )
        );

    if (daUsers.length === 0) {
        console.log("   ❌ No DA users found matching 'Lahaul' or 'Spiti'.");
    } else {
        console.table(daUsers.map(u => ({
            email: u.email,
            district: u.district,
            "Logic Check": checkLogic(u.district)
        })));
    }

    // 2. Inspect Applications in Lahaul District
    console.log("\n👉 2. INSPECTING APPLICATIONS (District contains 'Lahaul'):");
    const apps = await db.select({
        id: homestayApplications.id,
        status: homestayApplications.status,
        district: homestayApplications.district,
        tehsil: homestayApplications.tehsil,
        createdAt: homestayApplications.createdAt
    })
        .from(homestayApplications)
        .where(ilike(homestayApplications.district, '%lahaul%'))
        .orderBy(sql`${homestayApplications.createdAt} DESC`)
        .limit(10);

    if (apps.length === 0) {
        console.log("   ❌ No applications found in Lahaul district.");
    } else {
        console.table(apps.map(a => ({
            ...a,
            "Is Null Tehsil?": a.tehsil === null,
            "Visible to Spiti Logic?": (a.tehsil || "").toLowerCase().includes('spiti'),
            "Visible to Lahaul Logic?": (a.tehsil !== 'Spiti' || a.tehsil === null)
        })));
    }

    console.log("\n✅ Done.\n");
    process.exit(0);
}

function checkLogic(district: string | null) {
    if (!district) return "NULL District";
    const d = district.toLowerCase();

    // Simulation of v1.0.16 Logic Order
    if (d.includes('kaza') || d.includes('spiti')) return "MATCHES SPITI (Priority 1)";
    if (d.includes('lahaul')) return "MATCHES LAHAUL (Priority 2)";

    return "NO MATCH";
}

inspectProd().catch(console.error);
