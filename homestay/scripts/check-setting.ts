
import { db } from "../server/db";
import { systemSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

async function checkSetting() {
    console.log("Checking system settings...");
    const allSettings = await db.select().from(systemSettings);
    console.log("All settings:", JSON.stringify(allSettings, null, 2));

    const setting = await db.query.systemSettings.findFirst({
        where: eq(systemSettings.settingKey, "woman_discount_mode")
    });
    console.log("Woman Discount Mode:", JSON.stringify(setting, null, 2));
    process.exit(0);
}

checkSetting().catch(err => {
    console.error(err);
    process.exit(1);
});
