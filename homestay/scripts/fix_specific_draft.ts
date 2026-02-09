
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fixDraft() {
    const id = 'bc787ecd-93b2-4dc8-a22e-8bd30ae81f9f';
    console.log(`Fixing draft ${id} to 'd_o'...`);

    await db.update(homestayApplications)
        .set({ guardianRelation: 'd_o' })
        .where(eq(homestayApplications.id, id));

    console.log("Fixed.");
    process.exit(0);
}

fixDraft().catch(console.error);
