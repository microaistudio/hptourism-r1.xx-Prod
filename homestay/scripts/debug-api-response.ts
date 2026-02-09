
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function debugApiResponse() {
    const baseUrl = "http://localhost:5050";
    console.log(`Targeting: ${baseUrl}`);

    try {
        // 1. Login
        console.log("Logging in as da_shimla...");
        await client.post(`${baseUrl}/api/login`, {
            username: "da_shimla",
            password: "dashi@2025"
        });
        console.log("Login successful!");

        // 2. Fetch Inspections
        console.log("Fetching /api/da/inspections...");
        const response = await client.get(`${baseUrl}/api/da/inspections`);

        console.log("\n--- API RESPONSE ---");
        console.log(JSON.stringify(response.data, null, 2));

        const orders = response.data;
        if (Array.isArray(orders)) {
            orders.forEach((o: any) => {
                console.log(`\nOrder ${o.id}:`);
                console.log(`  - App ID: ${o.applicationId}`);
                console.log(`  - App Object: ${o.application ? 'PRESENT' : 'NULL'}`);
                if (o.application) {
                    console.log(`    - Property Name: '${o.application.propertyName}'`);
                    console.log(`    - App Number: '${o.application.applicationNumber}'`);
                    console.log(`    - District: '${o.application.district}'`);
                }
            });
        }

    } catch (error: any) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
    }
}

debugApiResponse().then(() => console.log("Done."));
