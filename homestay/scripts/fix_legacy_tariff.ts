
import { db } from "../server/db";
import { homestayApplications } from "../shared/schema";
import { eq, inArray } from "drizzle-orm";

async function main() {
    const PARENT_ID = "f92123b1-9025-4152-9957-a3d35a388a9b"; // The parent with missing data
    const DRAFT_ID = "e886f3f2-11e4-4369-8a1e-4109409f5692";  // The current delete_rooms draft

    console.log("Updating tariff data to 1500 for legacy applications...");

    // Update Parent Application
    await db
        .update(homestayApplications)
        .set({
            singleBedRoomRate: "1500.00",
            doubleBedRoomRate: "2500.00", // Setting a sensible default for double too, just in case
            proposedRoomRate: "1500.00",  // Legacy fallback
        })
        .where(eq(homestayApplications.id, PARENT_ID));

    console.log(`Updated Parent Application: ${PARENT_ID}`);

    // Update Draft Application (so user sees it immediately on refresh)
    await db
        .update(homestayApplications)
        .set({
            singleBedRoomRate: "1500.00",
            doubleBedRoomRate: "2500.00",
            proposedRoomRate: "1500.00",
        })
        .where(eq(homestayApplications.id, DRAFT_ID));

    console.log(`Updated Draft Application: ${DRAFT_ID}`);
    console.log("Done. Please refresh the page.");

    process.exit(0);
}

main().catch((err) => {
    console.error("Failed to update tariffs:", err);
    process.exit(1);
});
