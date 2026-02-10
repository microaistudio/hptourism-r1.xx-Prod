
import { db } from "./db";
import { homestayApplications } from "@shared/schema";
import { ilike } from "drizzle-orm";

async function check() {
    console.log("Checking Lahaul Applications on DEV1...");
    const apps = await db.select({
        id: homestayApplications.id,
        district: homestayApplications.district,
        tehsil: homestayApplications.tehsil
    }).from(homestayApplications).where(ilike(homestayApplications.district, '%lahaul%'));

    console.table(apps);
    process.exit(0);
}

check().catch(console.error);
