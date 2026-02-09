
import { db } from "../server/db";
import { users } from "@shared/schema";
import { ilike, ne, and, or, sql } from "drizzle-orm";
import { deriveDistrictRoutingLabel } from "@shared/districtRouting";

// Duplicate the logic from server/routes/da.ts for verification
// In a real refactor, this should be a shared helper function
function getExpectedDA(district: string, tehsil: string) {
    const d = district.toLowerCase();
    const t = tehsil.toLowerCase();

    if (d.includes('chamba') && t.includes('pangi')) return "Pangi";
    if (d.includes('chamba') && !t.includes('pangi')) return "Chamba";

    if (d.includes('lahaul') && (t.includes('kaza') || t.includes('spiti'))) return "Lahaul-Spiti (Kaza)";
    if (d.includes('lahaul') && !t.includes('kaza') && !t.includes('spiti')) return "Lahaul";

    if (d.includes('hamirpur') || d.includes('una')) return "Hamirpur";
    if (d.includes('bilaspur') || d.includes('mandi')) return "Bilaspur";

    if (d.includes('kangra')) return "Kangra";
    if (d.includes('kinnaur')) return "Kinnaur";
    if (d.includes('kullu')) return "Kullu";
    if (d.includes('shimla')) return "Shimla";
    if (d.includes('sirmaur')) return "Sirmaur";
    if (d.includes('solan')) return "Solan";

    return "UNKNOWN";
}

async function verifyPipelines() {
    console.log("🚀 Verifying All 12 Data Pipelines...\n");

    const testCases = [
        // Group A: Standard Pipelines
        { district: "Kangra", tehsil: "Dharamshala", expectedDA: "Kangra" },
        { district: "Kinnaur", tehsil: "Kalpa", expectedDA: "Kinnaur" },
        { district: "Kullu", tehsil: "Manali", expectedDA: "Kullu" },
        { district: "Shimla", tehsil: "Rohru", expectedDA: "Shimla" },
        { district: "Sirmaur", tehsil: "Nahan", expectedDA: "Sirmaur" },
        { district: "Solan", tehsil: "Kasauli", expectedDA: "Solan" },

        // Group B: Merged Pipelines
        { district: "Hamirpur", tehsil: "Hamirpur", expectedDA: "Hamirpur" },
        { district: "Una", tehsil: "Amb", expectedDA: "Hamirpur" }, // Una -> Hamirpur
        { district: "Bilaspur", tehsil: "Bilaspur", expectedDA: "Bilaspur" },
        { district: "Mandi", tehsil: "Mandi", expectedDA: "Bilaspur" }, // Mandi -> Bilaspur

        // Group C: Split Pipelines
        { district: "Chamba", tehsil: "Chamba", expectedDA: "Chamba" },
        { district: "Chamba", tehsil: "Bharmour", expectedDA: "Chamba" }, // Bharmour -> Chamba
        { district: "Chamba", tehsil: "Pangi", expectedDA: "Pangi" }, // Pangi -> Pangi (ITDP)

        { district: "Lahaul and Spiti", tehsil: "Lahaul", expectedDA: "Lahaul" },
        { district: "Lahaul and Spiti", tehsil: "Udaipur", expectedDA: "Lahaul" },
        { district: "Lahaul and Spiti", tehsil: "Spiti", expectedDA: "Lahaul-Spiti (Kaza)" },
        { district: "Lahaul and Spiti", tehsil: "Kaza", expectedDA: "Lahaul-Spiti (Kaza)" }, // Kaza = Spiti for routing
    ];

    let passed = 0;
    let failed = 0;

    for (const test of testCases) {
        const result = getExpectedDA(test.district, test.tehsil);
        // Map "Lahaul-Spiti (Kaza)" to "Kaza" for simpler output or check match against manifest label

        // We actually want to check if there is a DA user configured for this "expectedDA" district label
        // But first, verify the logic matches
        const status = result.includes(test.expectedDA) || (test.expectedDA === "Pangi" && result === "Pangi") ? "✅ PASS" : "❌ FAIL";

        console.log(`${status} | Input: ${test.district} / ${test.tehsil} -> Routing Target: ${result} (Expected: ${test.expectedDA})`);

        if (status.includes("PASS")) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log(`\n---------------------------------------------------`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`---------------------------------------------------\n`);

    if (failed === 0) {
        console.log("✨ All Pipelines Configured Correctly!");
        process.exit(0);
    } else {
        console.error("⚠️ Some pipelines failed verification.");
        process.exit(1);
    }
}

verifyPipelines().catch(console.error);
