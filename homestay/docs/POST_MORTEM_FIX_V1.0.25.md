# Post-Mortem: Lahaul/Spiti Visibility & PM2 Zombie Process Fix
**Date:** February 10, 2026
**Version:** v1.0.25

## 1. The Issue
Users reported that Lahaul DTDOs were incorrectly seeing applications from "Spiti", despite logic to exclude them. Multiple fix attempts seemed to have no effect.

## 2. Root Causes Identified

### A. Logic Flaw (Data Ambiguity)
The original exclusion logic relied on simple inequality (`ne`) or case-sensitive checks. Production data contained variations (e.g., "Spiti " with trailing spaces, mixed casing) that bypassed these checks.

### B. The "Zombie" Process (Critical)
Even after the logic was fixed in code (v1.0.23+), the changes were **not appearing on Production**.
- **Discovery:** A hidden, root-owned PM2 daemon (`/root/.pm2`) was running a "zombie" process on port 5055.
- **Impact:** Every time we deployed new code and restarted the `hmsusr` PM2 service, it would either crash (EADDRINUSE) or fail to bind the port because the zombie process was still holding it.
- **Result:** The web server was serving **old, stale code** for hours, regardless of our deployments.

### C. Deployment Failures
- `tar` extraction failed multiple times due to directory confusion (`/root/setup` vs `~/setup`) and a corrupted (truncated) `.tar.gz` file during sync.

## 3. The Solution

### Code Fixes (v1.0.24/v1.0.25)
1.  **SQL Layer:** Changed strict inequality to `NOT ILIKE '%spiti%'` to catch any variation of the word "Spiti".
2.  **Application Layer:** Added a **JavaScript Failsafe** in `dtdo.ts`. Even if the DB returns a Spiti row, the server explicitly filters it out before sending to the frontend.
3.  **Logging:** Added `[SAFETY FILTER]` logs to confirm the logic is active.

### Deployment & Server Fixes
1.  **Killed the Zombie:** Identified and killed the root PM2 daemon and its child processes. Removed the `/root/.pm2/dump.pm2` file to prevent resurrection.
2.  **Proper PM2 Config:** Created `/opt/hptourism/homestay/ecosystem.config.cjs` with:
    - `kill_timeout: 5000` (Gives time for port release)
    - `restart_delay: 3000` (Prevents crash loops)
3.  **Persistence:** Enabled `pm2-hmsusr` systemd service and saved the process list (`pm2 save`). The correct service now auto-starts on reboot.

## 4. Current Status
- **Version:** v1.0.25 is live and verified.
- **Stability:** PM2 is online, memory usage normal (~140MB), no restart loops.
- **Bug:** Lahaul dashboard is confirmed clean (Spiti apps hidden).

## 5. Next Steps: Stability & Redundancy (Tomorrow)
- [ ] **Log Rotation:** Ensure logs don't consume all disk space (`pm2-logrotate`).
- [ ] **Database Backups:** Verify automated backup schedules.
- [ ] **Monitoring:** Set up basic uptime checks.
- [ ] **Redundancy:** Review failover procedures.
