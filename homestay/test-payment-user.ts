import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from './server/core/auth.js';

async function run() {
    try {
        const username = 'payment_ops';
        const passwordText = 'password123';
        const hashedPassword = await hashPassword(passwordText);

        const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (existing.length > 0) {
            await db.update(users).set({ password: hashedPassword }).where(eq(users.username, username));
            console.log("Updated existing dev account: payment_ops to password123");
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

run();
