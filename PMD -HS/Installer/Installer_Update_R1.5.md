# HP Tourism Homestay Portal - Installer & Update Guide (R1.5)

**Document Version:** R1.5  
**Date:** 2026-02-06  
**Applies To:** Release v1.0.5  
**Previous:** Installer_HomeStay_R1.0.0.md (archived)

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| R1.5 | 2026-02-06 | Added verification scripts, install logging, UI version display |
| R1.0 | 2026-02-01 | Initial installer documentation for v1.0.0 |

---

## 1. What's New in v1.0.5

### 🆕 New Features
- **Enhanced Maintenance Mode**: Dynamic maintenance page with admin bypass (Access Key)
- **Payment Pause Messaging**: Prominent red alert instead of toast notifications
- **Version Display**: UI shows current version on Login and Admin Dashboard
- **Release Notes**: Downloadable at `/RELEASE_NOTES.txt`

### 🔧 New Verification Tools
| Script | Purpose |
|--------|---------|
| `scripts/verify-env.ts` | Pre-flight environment check |
| `scripts/generate-install-log.ts` | Post-install verification log |

---

## 2. Package Overview

### Package Specifications
| Property | Value |
|----------|-------|
| **Artifact Name** | `hptourism-v1.0.5-offline.tar.gz` |
| **Compressed Size** | ~220 MB |
| **Uncompressed Size** | ~730 MB |

### Package Contents
```
hptourism-v1.0.5-offline/
├── dist/                    # Compiled Application
├── node_modules/            # Vendor Dependencies (Pre-installed)
├── Database/                # Schema & Seeds
├── deploy/                  # Automation Scripts
│   └── install.sh           # Main installer
├── scripts/                 # Utility Scripts (NEW)
│   ├── verify-env.ts        # Environment verification
│   └── generate-install-log.ts  # Install log generator
├── client/public/           # Static Assets
│   └── RELEASE_NOTES.txt    # Version release notes
└── package.json             # Version: 1.0.5
```

### Why "Fat" Installer?
This package includes the entire `node_modules` directory (~600MB) to ensure **no internet connection** is needed for `npm install`. This guarantees production runs the exact same dependency tree as development.

---

## 3. System Requirements

| Component | Minimum Version | Notes |
|-----------|-----------------|-------|
| **OS** | Ubuntu 22.04 LTS / Debian 11 | Tested on Ubuntu 20/22 |
| **Runtime** | Node.js v20.x (LTS) | ⚠️ Must be v20+ |
| **Database** | PostgreSQL 14+ | |
| **Server** | Nginx | Reverse Proxy |
| **Process Manager** | PM2 | `npm install -g pm2` |

> **Note for IT Dept:** If the server is offline, pre-install Node.js, Postgres, Nginx, and PM2 before deployment.

---

## 4. Installation Steps

### Step 1: Deploy Package
Transfer the tarball to the target server:
```bash
scp hptourism-v1.0.5-offline.tar.gz root@homstyshmapp:/setup/
```

### Step 2: Extract
```bash
cd /setup
tar -xzf hptourism-v1.0.5-offline.tar.gz
cd hptourism-v1.0.5-offline
```

### Step 3: Run Installer
```bash
sudo bash deploy/install.sh
```

### Step 4: Follow Prompts
1. **Select Option [1] Fresh Installation** (or [2] for Update)
2. **Service User**: Default `hptourism`
3. **Install Path**: Default `/opt/hptourism/homestay`
4. **Database**: Enter credentials (installer auto-creates DB)
5. **SSL**: Choose Let's Encrypt / Self-Signed / HTTP Only

### Step 5: Post-Install Verification ✨ NEW
After installation completes, run the verification scripts:

```bash
# Environment Check
cd /opt/hptourism/homestay && npx tsx scripts/verify-env.ts

# Generate Install Log
cd /opt/hptourism/homestay && npx tsx scripts/generate-install-log.ts
```

**Output Files:**
- `install_log.txt` - Human-readable summary
- `install_manifest.json` - Machine-readable manifest

---

## 5. Update Strategy

### Option A: Full Update (Recommended)
**Use Case:** Minor/Patch releases (e.g., 1.0.3 → 1.0.5)

1. Copy tarball to server
2. Run `sudo bash deploy/install.sh`
3. **Select Option [2] Update Existing Installation**

**Installer Logic:**
- Creates backup of current installation
- Stops the service
- Overwrites code (`dist/`, `node_modules/`, `scripts/`)
- Runs Database Migrations
- Restarts service
- Preserves `.env` and `local-object-storage/`

### Option B: Hotfix (Manual)
**Use Case:** Emergency single-file fix

```bash
# 1. Backup current dist
cp -r /opt/hptourism/homestay/dist /opt/hptourism/homestay/dist_backup_$(date +%s)

# 2. Replace dist only
tar -xzf hptourism-v1.0.5-hotfix.tar.gz -C /opt/hptourism/homestay/

# 3. Restart
pm2 restart hptourism-prod
```

---

## 6. Post-Installation Verification ✨

### 6.1 Quick Health Check
```bash
cd /opt/hptourism/homestay && npx tsx scripts/verify-env.ts
```

**Expected Output:**
```
🔍 Starting Production Environment Verification (v1.0.5)...

--- System Parameters ---
NODE_ENV: production
PORT: 5055

--- Database Check ---
✅ Database Connected (34ms)

--- Payment Gateway Config ---
HIMKOSH Mode: 🔒 PRODUCTION MODE

--- Active System Controls ---
Maintenance Mode: 🟢 Disabled (Site Live)
Payment Pause:    🟢 Active

============================================
✅ ALL SYSTEMS GREEN. Ready for Production.
```

### 6.2 Full Install Log
```bash
cd /opt/hptourism/homestay && npx tsx scripts/generate-install-log.ts
```

**Generated Files:**
| File | Location | Purpose |
|------|----------|---------|
| `install_log.txt` | Project root | Share with support |
| `install_manifest.json` | Project root | Automated comparison |

**Sample Output:**
```
╔══════════════════════════════════════════════════════════════╗
║        HP TOURISM HOMESTAY PORTAL - INSTALLATION LOG         ║
╚══════════════════════════════════════════════════════════════╝

📦 Version:     1.0.5
📅 Generated:   2026-02-06T00:33:08.183Z
🖥️  Hostname:    homstyshmapp
⚙️  Node:        v20.17.0

─── CRITICAL FILES ────────────────────────────────────────────
  ✅ package.json (6.0 KB)
  ✅ .env (2.6 KB)
  ✅ dist/index.js (932.4 KB)
  ✅ dist/public/index.html (3.0 KB)
```

### 6.3 UI Version Check
After deployment, verify version display:
1. **Login Page**: Version shown in footer
2. **Admin Dashboard**: Version shown next to "Legacy Console" link
3. **Release Notes**: Download from `https://domain/RELEASE_NOTES.txt`

---

## 7. Directory Structure (Post-Install)

```
/opt/hptourism/homestay/
├── .env                     # Environment Config ⚠️ CRITICAL
├── dist/                    # Running Code
│   ├── index.js             # Server entry point
│   └── public/              # Frontend assets
├── node_modules/            # Dependencies
├── scripts/                 # Utility Scripts ✨ NEW
│   ├── verify-env.ts        # Environment check
│   └── generate-install-log.ts  # Install logger
├── local-object-storage/    # Uploaded files
├── logs/                    # Application logs
├── ecosystem.config.cjs     # PM2 Config
├── install_log.txt          # Generated install log ✨ NEW
└── install_manifest.json    # Generated manifest ✨ NEW
```

---

## 8. PROD Parameters Reference

| Parameter | Value |
|-----------|-------|
| **Server** | `homstyshmapp` / `10.126.102.145` |
| **Domain** | `homestay.hp.gov.in` |
| **Port** | `5055` |
| **PM2 Process** | `hptourism-prod` |
| **Database** | `hptourism` |
| **Install Path** | `/opt/hptourism/homestay` |

> Full details: See `PROD Profile/01.Prod_Parameters_R1.md`

---

## 9. Troubleshooting

### Service Management
```bash
# Check Status
pm2 status

# View Logs
pm2 logs hptourism-prod --lines 50

# Restart
pm2 restart hptourism-prod --update-env
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port Conflict | Edit `.env` PORT, restart PM2 |
| Database Connection | Verify `.env` credentials |
| Migration Failure | Check log, restore from backup |
| Version Mismatch UI | Clear browser cache, rebuild |

### Backup & Restore
- **Auto-Backup**: Installer creates backup before every update
- **Location**: `/tmp/hptourism-backup-YYYYMMDD.../`
- **Restore**: Run installer, select **Option [3]**

---

## 10. Checklist: Update to v1.0.5

- [ ] Backup current installation manually
- [ ] Transfer `hptourism-v1.0.5-offline.tar.gz` to server
- [ ] Extract package
- [ ] Run `sudo bash deploy/install.sh` → Option [2]
- [ ] Run `npx tsx scripts/verify-env.ts` → Confirm green
- [ ] Run `npx tsx scripts/generate-install-log.ts` → Save log
- [ ] Check Login page shows `v1.0.5`
- [ ] Check Admin Dashboard shows `v1.0.5`
- [ ] Test Maintenance Mode toggle in System Controls
- [ ] Test Payment Pause toggle in System Controls

---

**Support Contact:** Development Team (MicroAI Studio)  
**Document:** `Installer/Installer_Update_R1.5.md`
