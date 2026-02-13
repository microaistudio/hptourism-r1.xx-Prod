/**
 * PM2 Ecosystem Config — PRODUCTION
 * 
 * For: homestay.hp.gov.in (port 5055)
 * Deploy to: /opt/hptourism/homestay/
 * 
 * Key settings for graceful shutdown:
 *   - kill_timeout: 8000ms — gives the server time to close connections before PM2 force-kills
 *   - listen_timeout: 10000ms — time PM2 waits for the app to be "ready" on startup
 *   - max_restarts: 10 — prevents infinite crash loops (stops after 10 failures in 1 minute)
 *   - restart_delay: 2000ms — 2s pause between restarts so ports can fully release
 */
module.exports = {
    apps: [
        {
            name: "hptourism-prod",
            script: "dist/index.js",
            instances: 1,
            exec_mode: "fork",
            cwd: "/opt/hptourism/homestay",
            node_args: "--enable-source-maps",

            // ── Graceful Shutdown ──────────────────────────────────────────
            // PM2 sends SIGINT first. The server catches it, closes HTTP server,
            // releases the port, then exits. PM2 waits kill_timeout ms before
            // force-killing with SIGKILL.
            kill_timeout: 8000,        // 8s grace period (server has 5s internal timeout)
            shutdown_with_message: false,

            // ── Restart Behavior ───────────────────────────────────────────
            autorestart: true,
            max_restarts: 10,          // Max 10 restarts in min_uptime window → then stop
            min_uptime: "60s",         // If process runs < 60s before crashing, count as a failed start
            restart_delay: 2000,       // 2s delay between restarts (let port release)

            // ── Resource Limits ────────────────────────────────────────────
            max_memory_restart: "512M",
            watch: false,

            // ── Logging ────────────────────────────────────────────────────
            error_file: "/opt/hptourism/homestay/logs/pm2-error.log",
            out_file: "/opt/hptourism/homestay/logs/pm2-out.log",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        },
    ],
};
