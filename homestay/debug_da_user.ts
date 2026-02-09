
import { db } from "./server/db";
import { users } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

async function main() {
    console.log(`Searching for Pangi DA user...`);

    const daUsers = await db.select().from(users).where(ilike(users.fullName, '%Pangi%'));

    if (daUsers.length === 0) {
        console.log("No Pangi DA user found.");
    } else {
        daUsers.forEach(user => {
            console.log("User Found:", {
                id: user.id,
                fullName: user.fullName,
                role: user.role,
                district: user.district,
                email: user.email
            });
        });
    }
    process.exit(0);
}

main().catch(console.error);
