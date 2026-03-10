# HP Tourism Homestay Portal - Installer Documentation (v1.0.0)

**Document Version:** 1.0.0
**Date:** 2026-02-01
**Applies To:** Release v1.0.0 (Gold)

---

## 1. Package Overview
The **v1.0.0 Offline Installer** is a self-contained package designed for deploying the HP Tourism Homestay Portal in air-gapped or restricted internal networks.

### Package Specifications
- **Core Artifact:** `hptourism-v1.0.0-offline.tar.gz`
- **Compressed Size:** ~219 MB
- **Uncompressed Size:** ~725 MB
- **Primary Content:**
    - `dist/` (Compiled Application)
    - `node_modules/` (Vendor Dependencies - Pre-installed)
    - `Database/` (Schema & Seeds)
    - `deploy/` (Automation Scripts)

### Why "Fat" Installer?
This package includes the entire `node_modules` directory (~600MB) to ensure that **no internet connection** involves `npm install` during deployment. This guarantees that the production environment runs the exact same dependency tree as development.

---

## 2. System Requirements (Pre-requisites)
The installer script automates configuration, but requires the underlying OS and runtime binaries to be present.

| Component | Minimum Version | Notes |
| :--- | :--- | :--- |
| **OS** | Ubuntu 22.04 LTS / Debian 11 | Tested on Ubuntu 20/22 |
| **Runtime** | Node.js v20.x (LTS) | *Critical*: Must be v20+ |
| **Database** | PostgreSQL 14+ | |
| **Server** | Nginx | Reverse Proxy for Port 80/443 |
| **Process Manager** | PM2 | `npm install -g pm2` |

> **Note for IT Dept:** If the server is offline, please pre-install Node.js, Postgres, Nginx, and PM2 binaries before attempting deployment.

---

## 3. Installation Guide

### Step 1: Deploy Artifact
Transfer the tarball to the target server (e.g., via SCP or USB).
```bash
# Example
scp release/hptourism-v1.0.0-offline.tar.gz user@10.x.x.x:/tmp/
```

### Step 2: Extract
```bash
cd /tmp
tar -xzf hptourism-v1.0.0-offline.tar.gz
cd hptourism-v1.0.0-offline
```

### Step 3: Run Installer
Run the interactive installation script as root.
```bash
sudo bash deploy/install.sh
```

### Step 4: Follow Prompts
1.  **Select Option [1] Fresh Installation**
2.  **Service User**: Default `hptourism` (Recommended)
3.  **Install Path**: Default `/opt/hptourism/homestay`
4.  **Database**: Enter credentials (installer will auto-create DB if permitted)
5.  **SSL**: Choose "Let's Encrypt" (Online), "Self-Signed" (Offline), or "HTTP Only".

---

## 4. Update Strategy (Maintenance)

### Scenario A: Full Update (Recommended)
**Use Case:** Major/Minor releases (e.g., 1.0 -> 1.1) or when libraries change.
1.  Copy the new tarball (`hptourism-v1.1.0-offline.tar.gz`) to the server.
2.  Run `sudo bash deploy/install.sh`.
3.  **Select Option [2] Update Existing Installation**.
    *   **Logic**:
        *   Creates a comprehensive backup of the current `/opt/hptourism/homestay`.
        *   Stops the service.
        *   Overwrites code (`dist/`, `node_modules/`).
        *   Runs Database Migrations (`npm run db:push`).
        *   Restarts service.

### Scenario B: Patch / Hotfix
**Use Case:** Small logic fixes (e.g., 1.0.0 -> 1.0.1) without dependency changes.
*   *Current v1.0.0 Installer Logic*: Always performs a Full Update (safest).
*   *Manual Patching (Advanced)*:
    *   If you only have a small `dist/` patch, you can manually replace the files in `/opt/hptourism/homestay/dist/` and restart PM2: `pm2 restart hptourism`.

---

## 5. Directory Structure (Post-Install)

| Path | Purpose |
| :--- | :--- |
| `/opt/hptourism/homestay/` | **Application Root** |
| ├── `.env` | Environment Config (Secrets) |
| ├── `dist/` | Running Code |
| ├── `node_modules/` | Dependencies |
| ├── `logs/` | Application Logs (`out.log`, `error.log`) |
| ├── `ecosystem.config.cjs` | PM2 Config |
| `/etc/nginx/sites-enabled/` | Nginx Proxy Config |
| `/var/log/hptourism-install.log` | Installer Activity Log |

---

## 6. Troubleshooting & Operations

### Service Management
```bash
# Check Status
sudo -u hptourism pm2 status

# View Logs (Real-time)
sudo -u hptourism pm2 logs hptourism-prod

# Restart App
sudo -u hptourism pm2 restart hptourism-prod
```

### Common Issues
1.  **Port Conflict (5050)**:
    *   Error: `FATAL: Application failed to bind to port 5050`
    *   Fix: Edit `.env` to change `PORT`, then restart PM2.
2.  **Database Connection**:
    *   Error: `Connection terminated` or `Authentication failed`.
    *   Fix: Verify `.env` credentials. Check `pg_hba.conf` allows local connections.
3.  **Migration Failure**:
    *   Error during Update: `Database migrations failed!`
    *   Fix: Check log. Typically means DB schema drift. Restore from backup (Option [3]) if critical.

### Backup & Restore
*   **Auto-Backup**: The installer creates a backup in `/tmp/hptourism-backup-YYYYMMDD...` before every update.
*   **Restore**: Run `sudo bash deploy/install.sh` and select **Option [3] Restore from Backup**.

---
**Support Contact:** Development Team (MicroAI Studio)
