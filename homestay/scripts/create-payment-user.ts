import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './server/auth';

async function run() {
    try {
        const username = 'payment_ops';
        const passwordText = 'password!';
        const hashedPassword = await hashPassword(passwordText);

        const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
        if (existing.length > 0) {
            await db.update(users).set({ password: hashedPassword }).where(eq(users.username, username));
            console.log("Updated existing");
        } else {
            await db.insert(users).values({
                username,
                password: hashedPassword,
                email: 'payment@hptourism.gov.in',
                fullName: 'Payment Operations Officer',
                mobile: '9999999999',
                role: 'payment_officer',
                district: 'Shimla HQ (AC Tourism)',
                address: 'HQ',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("Created new");
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

run();
