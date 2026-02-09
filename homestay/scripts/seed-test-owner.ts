
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedTestOwners() {
    const owners = [
        { mobile: "6666666610", name: "Smoke Test Owner 1", pass: "test123" },
        { mobile: "6666666611", name: "Smoke Test Owner 2", pass: "test123" }
    ];

    console.log(`🌱 Seeding ${owners.length} test owners...`);

    for (const owner of owners) {
        const hashedPassword = await bcrypt.hash(owner.pass, 10);
        console.log(`Processing owner: ${owner.mobile}`);

        try {
            await db.insert(users).values({
                mobile: owner.mobile,
                password: hashedPassword,
                role: 'property_owner',
                fullName: owner.name,
                firstName: 'Smoke',
                lastName: `Owner ${owner.mobile.slice(-2)}`,
                // Remove invalid fields if they don't exist in schema anymore or check schema
                // Checking schema.ts: active/isMobileVerified might not be there?
                // Schema shows: isActive (boolean, default true)
                isActive: true,
                // created_at etc are defaultNow()
            } as any);
            console.log(`✅ Created test owner ${owner.mobile}`);
        } catch (e: any) {
            if (e.code === '23505') {
                console.log(`User ${owner.mobile} already exists, updating password...`);
                await db.update(users)
                    .set({ password: hashedPassword, isActive: true })
                    .where(eq(users.mobile, owner.mobile));
                console.log(`✅ Updated test owner ${owner.mobile}`);
            } else {
                console.error(`❌ Error seeding ${owner.mobile}:`, e);
            }
        }
    }
    process.exit(0);
}

seedTestOwners();
