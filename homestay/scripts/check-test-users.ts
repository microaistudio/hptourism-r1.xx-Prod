
import { db } from "../server/db";
import { users } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

async function checkUsers() {
    const mobiles = ["6666666610", "9999999991", "7800001013"];
    const found = await db.select().from(users).where(inArray(users.mobile, mobiles));

    console.table(found.map(u => ({ id: u.id, username: u.username, mobile: u.mobile, role: u.role })));
    process.exit(0);
}

checkUsers();
