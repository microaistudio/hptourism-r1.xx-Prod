module.exports = {
  apps: [
    // hptourism-rc7 removed to avoid conflict. Managed independently in its own folder.

    {
      name: "hptourism-dev",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      cwd: __dirname,
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: "5040",
        // DATABASE_URL: process.env.DATABASE_URL, // Load from .env 
        DATABASE_URL: process.env.DATABASE_URL || "postgresql://hptourism_user:hptourism_pass@localhost:5432/hptourism-dev",
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
        ENABLE_TEST_RUNNER: "true",
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    }
  ],
};
