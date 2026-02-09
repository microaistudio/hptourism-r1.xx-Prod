module.exports = {
    apps: [
        {
            name: "hptourism-dev1",
            script: "dist/index.js",
            instances: 1,
            exec_mode: "fork",
            cwd: __dirname,
            node_args: "--enable-source-maps",
            env: {
                NODE_ENV: "production",
                PORT: "5057",
                DATABASE_URL: process.env.DATABASE_URL,
                SESSION_SECRET: "hp-tourism-dev1-session-secret-clean",

                // Storage
                OBJECT_STORAGE_MODE: "local",
                LOCAL_OBJECT_DIR: `${__dirname}/local-object-storage`,
                LOCAL_MAX_UPLOAD_BYTES: String(20 * 1024 * 1024),

                // HimKosh
                VITE_HIMKOSH_TEST_MODE: "true",
                HIMKOSH_MERCHANT_CODE: "HIMKOSH230",
                HIMKOSH_DEPT_ID: "230",
                HIMKOSH_SERVICE_CODE: "TSM",
                HIMKOSH_DDO_CODE: "CTO00-068",
                HIMKOSH_HEAD: "1452-00-800-01",
                HIMKOSH_TEST_MODE: "true",
                HIMKOSH_FORCE_TEST_MODE: "true",
                HIMKOSH_RETURN_URL: "https://dev1.osipl.dev/api/himkosh/callback",
                HIMKOSH_ALLOW_DEV_FALLBACK: "true",
                HIMKOSH_KEY_FILE_PATH: `${__dirname}/server/himkosh/echallan.key`,

                // Security
                SECURITY_ENABLE_RATE_LIMIT: "false", // Disable for DEV
                CAPTCHA_FORCE_DISABLE: "true",       // Disable for DEV

                // Logs
                LOG_FILE_ENABLED: "true",
                LOG_FILE_PATH: `${__dirname}/logs/dev1.log`,
                LOG_FILE_MAX_SIZE_MB: "20",
                LOG_FILE_MAX_FILES: "5",
                LOG_FILE_ROTATE_INTERVAL: "1d",

                // HPSSO Configuration (Same as PROD for validation, but redirect will go to PROD URL)
                HPSSO_ENABLED: "true",
                HPSSO_ENVIRONMENT: "production",
                HPSSO_SERVICE_ID: "10000163",
                HPSSO_SECRET_KEY: "f7f6c2498ca0e030695331809522a1774d9fb113a319dd4f644762297c4b9ebe",
                HPSSO_STAFF_SERVICE_ID: "10000165", // Correct Staff Service ID
                HPSSO_STAFF_SECRET_KEY: "f7f6c2498ca0e030695331809522a1774d9fb113a319dd4f644762297c4b9ebe", // Placeholder
                HPSSO_PROD_URL: "https://himaccess.hp.gov.in",
            },
            autorestart: true,
            max_memory_restart: "512M",
        },
    ],
};
