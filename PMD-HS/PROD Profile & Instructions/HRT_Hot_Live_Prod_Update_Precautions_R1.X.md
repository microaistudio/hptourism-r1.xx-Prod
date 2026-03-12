# HP Tourism Homestay Portal - Hot Live PROD Update Precautions (R1.X)

> [!DANGER]
> **READ BEFORE DEPLOYING TO PRODUCTION**
> This document outlines critical safety measures to prevent data corruption, service disruption, and environment cross-contamination during updates.

---

## 🛡️ 1. CRITICAL: Environment Parameter Isolation

To prevent DEV parameters from corrupting the PROD environment:

### A. The `.env` File Rule
*   **NEVER** include the `.env` file in the deployment package (`tar.gz`).
*   **NEVER** overwrite the existing PROD `.env` file during extraction unless explicitly updating specific keys.
*   **VERIFY** that the `.env` file on PROD remains untouched during the update process.
*   **Why?** Overwriting PROD `.env` with DEV `.env` will point PROD to the wrong database (localhost DEV) or wrong payment gateway (Test), causing data loss or financial transaction failures.

### B. `ecosystem.config.cjs` Safety
*   The `ecosystem.config.cjs` file often contains fallback environment variables.
*   **ACTION:** Ensure the PROD version of `ecosystem.config.cjs` uses `PORT=5055` and `NODE_ENV=production`.
*   **PRECAUTION:** Do not blindly replace `ecosystem.config.cjs` if your deployment package contains a DEV configured version (e.g., port 5040). Use `diff` to compare before replacing.

### C. Frontend Build Artifacts
*   The frontend (`client/dist` or `dist/public`) is compiled at build time.
*   **CHECK:** Ensure no `VITE_` variables with hardcoded DEV URLs (e.g., `http://localhost:5040`) were present during the build.
*   **VERIFY:** The frontend should use relative API paths (e.g., `/api/...`) so it automatically talks to the hosting server (PROD).

---

## 🚦 2. Public Facing Workflow Protection

The application is live. Users may be filling forms or making payments.

### A. Atomic Deployment (File System Consistency)
*   **Risk:** If you upload files one-by-one, a user might request a file that is half-written or mismatched (e.g., new JS trying to fetch old API).
*   **Solution: Swap Strategy**
    1.  Extract new build to a temporary folder: `/opt/hptourism/homestay/dist_new`.
    2.  Backup current build: `cp -r dist dist_backup_$(date +%s)`.
    3.  Atomic Switch: `mv dist dist_old && mv dist_new dist`.
    4.  Restart PM2.
*   **Result:** The downtime is reduced to the milliseconds of the rename operation + PM2 restart time.

### B. Payment Transaction Safety
*   **Risk:** A user initiates a payment, gets redirected to HimKosh/Kotak, and while they are paying, you restart the server. When they return, the server might be restarting or session info might be lost (if using memory store).
*   **Mitigation:**
    1.  **Check Logs:** Run `pm2 logs --lines 100` and look for recent `Payment Initiated` logs.
    2.  **Pause Window:** If `Redis` is used for sessions, sessions persist across restarts. If `MemoryStore` is used (default in some configs), **ALL LOGGED IN USERS WILL BE LOGGED OUT**.
    3.  **Instruction:** If possible, schedule updates during low-traffic hours (Late night IST).
    4.  **Emergency Pause:** If a major DB migration is required, enable "Maintenance Mode" (if available) or serve a temporary "Under Maintenance" 503 page via Nginx.

---

## 🤖 3. Instructions for Agent (Self-Correction)

When you (the AI Agent) are asked to update PROD, follow this strict protocol:

1.  **Context Check:** Am I connected to PROD? (Check hostname/IP).
2.  **Read Config:** Read `/opt/hptourism/homestay/.env` to confirm I am targeting `hptourism` DB and Port `5055`.
3.  **Backup First:**
    *   `pg_dump hptourism > backup_pre_update.sql`
    *   `cp -r dist dist_pre_update_backup`
4.  **Safe Extraction:**
    *   Extract artifacts to a *staging folder*, NOT directly over running files.
    *   Diff critical files (`ecosystem.config.cjs`, `package.json`).
5.  **Database Migration:**
    *   Run migrations *before* code switch if additive.
    *   Run migrations *after* code switch if destructive (avoid!).
6.  **The Switch:** Perform the Atomic Switch (Move folders).
7.  **Restart & Verify:**
    *   `pm2 restart hptourism-prod`
    *   `curl -I http://localhost:5055` (Check HTTP 200).
    *   `pm2 logs` (Check for startup errors).

---

## 📝 checklist for "Install Pack" Creation

When creating the `tar.gz` for PROD:

- [ ] Run `npm run build` in a clean environment.
- [ ] Exclude `.env` file.
- [ ] Exclude `node_modules` (install fresh on PROD to match OS/Architecture) OR verify architecture match.
- [ ] Exclude `.git` folder.
- [ ] Verify `ecosystem.config.cjs` matches PROD settings OR exclude it and rely on existing file.
- [ ] Include `migrations` folder.
- [ ] Include `package.json`.

**Command to Create Safe Artifact:**
```bash
tar -czvf hptourism-v1.X-prod-update.tar.gz \
    dist/ \
    migrations/ \
    server/ \
    shared/ \
    package.json \
    ecosystem.config.cjs \
    scripts/ \
    --exclude='.env' \
    --exclude='node_modules' \
    --exclude='.git'
```
