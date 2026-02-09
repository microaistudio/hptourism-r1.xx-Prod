
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkFields() {
    const id = 'bc787ecd-93b2-4dc8-a22e-8bd30ae81f9f';

    const result = await db.select().from(homestayApplications).where(eq(homestayApplications.id, id)).limit(1);

    if (result[0]) {
        console.log("Application found:");
        console.log("  ID:", result[0].id);
        console.log("  guardianRelation:", result[0].guardianRelation);
        console.log("  guardianName:", result[0].guardianName);
        console.log("  ownerName:", result[0].ownerName);
    } else {
        console.log("Application not found");
    }

    process.exit(0);
}

checkFields().catch(console.error);
