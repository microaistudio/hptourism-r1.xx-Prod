import axios from "axios";

const BASE_URL = "http://localhost:5050";

async function verifyFeatures() {
    try {
        console.log("--- Starting V2 Feature Verification ---");

        // 1. Authenticate as Superadmin
        console.log("1. Authenticating as Superadmin...");
        const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
            identifier: "superadmin",
            password: "Welcome@123"
        }, {
            headers: {
                "X-Forwarded-Proto": "https",
                "Host": "localhost:5050"
            },
            validateStatus: () => true
        });

        if (loginRes.status !== 200) {
            console.error(`❌ Login failed (${loginRes.status}):`, loginRes.data);
            process.exit(1);
        }

        const cookie = loginRes.headers['set-cookie']?.join('; ');
        if (!cookie) throw new Error("Failed to get session cookie");
        console.log("✅ Login successful");

        // 2. Check Seed Status
        console.log("2. Checking Seed Status...");
        const statusRes = await axios.get(`${BASE_URL}/api/admin/seed/status`, {
            headers: {
                Cookie: cookie,
                "X-Forwarded-Proto": "https"
            }
        });
        console.log("✅ Seed Status:", JSON.stringify(statusRes.data, null, 2));

        // 3. Test Rate Limit Configuration
        console.log("3. Testing Rate Limit Configuration (Relaxing to 100)...");
        const newRateLimit = {
            enabled: true,
            global: { maxRequests: 5000, windowMinutes: 15 },
            auth: { maxRequests: 100, windowMinutes: 10 },
            upload: { maxRequests: 200, windowMinutes: 10 }
        };

        const updateRes = await axios.post(`${BASE_URL}/api/admin/settings/security/rate-limits`, newRateLimit, {
            headers: {
                Cookie: cookie,
                "X-Forwarded-Proto": "https"
            },
            validateStatus: () => true
        });

        if (updateRes.status !== 200) {
            console.error(`❌ Rate limit update failed (${updateRes.status}):`, updateRes.data);
            process.exit(1);
        }

        console.log("✅ Rate limit update requested. Waiting 2s...");
        await new Promise(r => setTimeout(r, 2000));

        // 4. Verify Rate Limit Retrieval
        console.log("4. Verifying Rate Limit Retrieval...");
        const getRateLimit = await axios.get(`${BASE_URL}/api/admin/settings/security/rate-limits`, {
            headers: {
                Cookie: cookie,
                "X-Forwarded-Proto": "https"
            }
        });

        const currentAuthMax = Number(getRateLimit.data.auth.maxRequests);
        console.log(`Current Auth Max: ${currentAuthMax} (type: ${typeof currentAuthMax})`);

        if (currentAuthMax === 100) {
            console.log("✅ Rate limit config applied correctly");
        } else {
            console.error("❌ Rate limit config mismatch! Received:", currentAuthMax);
        }

        console.log("--- Verification Complete ---");
    } catch (error: any) {
        console.error("❌ Verification Failed:", error.message);
        process.exit(1);
    }
}

verifyFeatures();
