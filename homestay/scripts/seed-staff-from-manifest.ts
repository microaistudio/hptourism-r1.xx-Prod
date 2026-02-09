
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getDistrictStaffManifest } from "@shared/districtStaffManifest";

const manifest = getDistrictStaffManifest();

const capitalize = (value: string) =>
    value.length === 0 ? value : value[0].toUpperCase() + value.slice(1).toLowerCase();

const formatStaffNames = (username: string) => {
    const tokens = username.split("_").filter(Boolean);
    if (tokens.length === 0) {
        const fallback = username.trim() || "Officer";
        return {
            firstName: fallback.toUpperCase(),
            lastName: "",
            fullName: fallback.toUpperCase(),
        };
    }
    const [firstToken, ...rest] = tokens;
    const firstName = firstToken.toUpperCase();
    const lastName = rest.length > 0 ? rest.map(capitalize).join(" ") : "Officer";
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    return { firstName, lastName, fullName };
};

async function seedStaff() {
    console.log("🌱 Seeding Staff Accounts from Manifest...");

    let createdCount = 0;
    let updatedCount = 0;

    for (const entry of manifest) {
        for (const role of ["da", "dtdo"] as const) {
            const manifestAccount = entry[role];
            const targetRole = role === "da" ? "dealing_assistant" : "district_tourism_officer";

            // Check if user exists by mobile
            const [existing] = await db
                .select()
                .from(users)
                .where(eq(users.mobile, manifestAccount.mobile))
                .limit(1);

            const derivedNames = formatStaffNames(manifestAccount.username);
            const passwordHash = await bcrypt.hash(manifestAccount.password, 10);

            if (!existing) {
                // CREATE
                console.log(`   Creating ${targetRole}: ${manifestAccount.username} (${entry.districtLabel})`);
                await db.insert(users).values({
                    username: manifestAccount.username,
                    password: passwordHash,
                    fullName: derivedNames.fullName,
                    firstName: derivedNames.firstName,
                    lastName: derivedNames.lastName,
                    email: manifestAccount.email,
                    mobile: manifestAccount.mobile,
                    role: targetRole,
                    district: entry.districtLabel,
                    active: true,
                    isEmailVerified: true,
                    isMobileVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                createdCount++;
            } else {
                // UPDATE (Optional, but good for consistency)
                // console.log(`   Updating ${targetRole}: ${manifestAccount.username}`);
                await db.update(users).set({
                    username: manifestAccount.username,
                    // Only update password if needed? For now, let's strictly enforcing manifest password might be annoying if changed.
                    // But for "seeding" usually we enforce. Let's skipping password update to be safe, only update metadata.
                    district: entry.districtLabel,
                    role: targetRole,
                    fullName: derivedNames.fullName,
                    firstName: derivedNames.firstName,
                    lastName: derivedNames.lastName,
                    active: true
                }).where(eq(users.id, existing.id));
                updatedCount++;
            }
        }
    }

    console.log(`✅ Seeding Complete.`);
    console.log(`   Created: ${createdCount}`);
    console.log(`   Updated/Verified: ${updatedCount}`);
    process.exit(0);
}

seedStaff().catch(err => {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
});
