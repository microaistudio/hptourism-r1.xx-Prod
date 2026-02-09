module.exports = {
  apps: [
    {
      name: "hptourism-rc7",
      script: "dist/index.js",
      instances: 2,
      exec_mode: "cluster",
      cwd: __dirname,
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || "5050",
        DATABASE_URL: process.env.DATABASE_URL,
        SESSION_SECRET:
          process.env.SESSION_SECRET ||
          "hp-tourism-rc7-session-secret-clean",
        OBJECT_STORAGE_MODE: process.env.OBJECT_STORAGE_MODE || "local",
        LOCAL_OBJECT_DIR: process.env.LOCAL_OBJECT_DIR || `${__dirname}/local-object-storage`,
        LOCAL_MAX_UPLOAD_BYTES: process.env.LOCAL_MAX_UPLOAD_BYTES || String(20 * 1024 * 1024),
        VITE_HIMKOSH_TEST_MODE: process.env.VITE_HIMKOSH_TEST_MODE || "true",
        HIMKOSH_MERCHANT_CODE: process.env.HIMKOSH_MERCHANT_CODE || "HIMKOSH230",
        HIMKOSH_DEPT_ID: process.env.HIMKOSH_DEPT_ID || "230",
        HIMKOSH_SERVICE_CODE: process.env.HIMKOSH_SERVICE_CODE || "TSM",
        HIMKOSH_DDO_CODE: process.env.HIMKOSH_DDO_CODE || "CTO00-068",
        HIMKOSH_HEAD: process.env.HIMKOSH_HEAD || "1452-00-800-01",
        HIMKOSH_TEST_MODE: process.env.HIMKOSH_TEST_MODE || "true",
        HIMKOSH_FORCE_TEST_MODE: process.env.HIMKOSH_FORCE_TEST_MODE || "true",
        HIMKOSH_RETURN_URL:
          process.env.HIMKOSH_RETURN_URL ||
          "https://live5.osipl.dev/api/himkosh/callback",
        HIMKOSH_ALLOW_DEV_FALLBACK: process.env.HIMKOSH_ALLOW_DEV_FALLBACK || "false",
        HIMKOSH_KEY_FILE_PATH:
          process.env.HIMKOSH_KEY_FILE_PATH || `${__dirname}/server/himkosh/echallan.key`,
        SECURITY_ENABLE_RATE_LIMIT: process.env.SECURITY_ENABLE_RATE_LIMIT || "true",
        CAPTCHA_FORCE_DISABLE: process.env.CAPTCHA_FORCE_DISABLE || "false",
        LOG_FILE_ENABLED: process.env.LOG_FILE_ENABLED || "true",
        LOG_FILE_PATH: process.env.LOG_FILE_PATH || `${__dirname}/logs/app.log`,
        LOG_FILE_MAX_SIZE_MB: process.env.LOG_FILE_MAX_SIZE_MB || "20",
        LOG_FILE_MAX_FILES: process.env.LOG_FILE_MAX_FILES || "14",
        LOG_FILE_ROTATE_INTERVAL: process.env.LOG_FILE_ROTATE_INTERVAL || "1d",
        LOG_TRACE_PAYMENTS: process.env.LOG_TRACE_PAYMENTS || "false",

        // HPSSO Configuration
        HPSSO_ENABLED: "true",
        HPSSO_ENVIRONMENT: "production",
        HPSSO_SERVICE_ID: "10000163",
        HPSSO_SECRET_KEY: "f7f6c2498ca0e030695331809522a1774d9fb113a319dd4f644762297c4b9ebe",
        HPSSO_STAFF_SERVICE_ID: "10000163", // Placeholder
        HPSSO_STAFF_SECRET_KEY: "f7f6c2498ca0e030695331809522a1774d9fb113a319dd4f644762297c4b9ebe", // Placeholder
        HPSSO_PROD_URL: "https://himaccess.hp.gov.in",
      },

      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
    {
      name: "hptourism-rc8",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      cwd: __dirname,
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: "5050",
        DATABASE_URL: process.env.DATABASE_URL,
        SESSION_SECRET: process.env.SESSION_SECRET || "hp-tourism-rc8-session-secret-clean", // Distinct secret
        OBJECT_STORAGE_MODE: process.env.OBJECT_STORAGE_MODE || "local",
        LOCAL_OBJECT_DIR: process.env.LOCAL_OBJECT_DIR || `${__dirname}/local-object-storage`,
        // ... (can inherit others or copy-paste). For simplicity, relying on .env loading if code does it, 
        // OR explicit definition here. Since code converts env vars, accurate copy is best.
        // Copying essential vars from above but tailored for RC8 if needed.
        // Assuming strict clone, we use same DB URL as .env (which needs to be loaded via PM2 ecosystem usually by --env or dotenv)
        // PM2 doesn't auto-load .env for ecosystem unless specified.
        // Better approach: Use local .env file.
        // But here we can just pass the vars.

        // Kotak / HimKosh settings
        CCAVENUE_MERCHANT_ID: process.env.CCAVENUE_MERCHANT_ID,
        CCAVENUE_ACCESS_CODE: process.env.CCAVENUE_ACCESS_CODE,
        CCAVENUE_WORKING_KEY: process.env.CCAVENUE_WORKING_KEY,
        CCAVENUE_URL: process.env.CCAVENUE_URL,
        CCAVENUE_ENV: process.env.CCAVENUE_ENV,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    }
  ],
};
