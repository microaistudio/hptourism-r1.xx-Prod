
import { db } from "./db";
import { homestayApplications, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function createSpitiApp() {
    console.log("🧪 Creating Test Application for Spiti (Tehsil='Spiti')...");

    // Get a random user to assign as owner (just for constraint satisfaction)
    const [user] = await db.select().from(users).limit(1);
    if (!user) {
        console.error("❌ No users found to assign application to.");
        process.exit(1);
    }

    const [app] = await db.insert(homestayApplications).values({
        userId: user.id,
        district: "Lahaul and Spiti",
        tehsil: "Spiti",
        status: "submitted", // Must be submitted to be seen by DA
        applicationNumber: "DEV-TEST-SPITI-" + Math.floor(Math.random() * 10000), // Random to avoid conflicts
        applicantName: "Test Spiti Applicant",
        propertyName: "Test Spiti Homestay",
        category: "silver",
        locationType: "gp", // Rural
        totalRooms: 2,
        address: "Kaza Market",
        pincode: "172114",
        ownerName: "Test Spiti Owner",
        ownerGender: "male",
        ownerMobile: "9999999999",
        ownerAadhaar: "123412341234",
        projectType: "new_property",
        propertyArea: "200", // sq meters
        attachedWashrooms: 2,
        mobile: "9999999999",
        email: "test@spiti.com",
        created_at: new Date(),
        updated_at: new Date(),
        isDraft: false,
        draftStep: 5
    }).returning();

    console.log(`✅ Created Application ID: ${app.id}`);
    console.log(`   District: ${app.district}`);
    console.log(`   Tehsil: ${app.tehsil}`);
    process.exit(0);
}

createSpitiApp().catch(console.error);
