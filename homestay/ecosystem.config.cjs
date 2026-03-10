// ============================================================================
// HP Tourism Homestay Portal — PM2 Ecosystem Config
//
// DEV1 config aligned with PROD parameters:
//   - Port: 5055 (same as PROD)
//   - DB user: hptourism (same as PROD)
//   - DB name: hptourism-dev (DEV data, PROD credentials)
//   - PM2 name: hptourism-dev1 (different from PROD's hptourism-prod)
//
// PROD runs PM2 directly via CLI, NOT via this file.
// This file is for DEV1 only and is excluded from PROD packs.
// ============================================================================

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
        TZ: "Asia/Kolkata",
        PGTZ: "Asia/Kolkata",
        NODE_ENV: "production",
        PORT: "5055",
        DATABASE_URL: "postgresql://hptourism:hptourism@localhost:5432/hptourism-dev",
        SESSION_SECRET: "hp-tourism-dev1-session-secret-change-me-in-prod-please",
        OBJECT_STORAGE_MODE: "local",
        LOCAL_OBJECT_DIR: `${__dirname}/local-object-storage`,

        // Security flags — match PROD
        ALLOW_PRODUCTION_RESET: "false",
        ALLOW_RESET_OPERATIONS: "false",
        ENABLE_TEST_RUNNER: "true",  // Only true on DEV for testing
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    }
  ],
};
