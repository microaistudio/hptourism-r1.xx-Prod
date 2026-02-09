
import { db } from "../server/db";
import { systemSettings } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    const [setting] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.settingKey, "default_payment_gateway"));

    console.log("Current Setting in DB:", JSON.stringify(setting, null, 2));
    process.exit(0);
}

main().catch(console.error);
