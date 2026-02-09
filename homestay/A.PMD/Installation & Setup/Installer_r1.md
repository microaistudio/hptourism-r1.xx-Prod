# HP Tourism Homestay Portal - Installer Specification (R2)

> **Version**: R2 (Updated for v0.9.5)  
> **Last Updated**: 2026-01-22  
> **Status**: Implemented & Tested

---

## Overview

This document outlines the offline installer package for the HP Tourism Homestay Portal. The installer supports fresh installations, updates with data preservation, backups, and clean uninstalls on Ubuntu/Debian-based Linux systems.

---

## Installer Menu

```
╔══════════════════════════════════════════════════════════════╗
║           HP TOURISM - HOMESTAY PORTAL INSTALLER             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  [1] Fresh Installation                                      ║
║  [2] Update Existing Installation                            ║
║  [3] Restore from Backup                                     ║
║  [4] Uninstall / Clean Old Setup                             ║
║  [5] Exit                                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Package Structure (v0.9.5)

```
hptourism-v0.9.5-offline/
├── deploy/
│   ├── install.sh              # Main installer (with startup verification)
│   ├── README.md               # Quick start guide
│   ├── nginx/
│   │   └── homestay.conf.template
│   └── ssl/
│       └── setup-ssl.sh        # SSL setup helper
├── dist/                       # Compiled application
├── node_modules/               # Dependencies (offline)
├── Database/
│   ├── admin_accounts_seed.sql # System users (admin, superadmin, supervisor_hq)
│   ├── ddo_codes_seed.sql      # DDO codes
│   └── district_staff_seed.sql # Optional staff accounts
├── migrations/                 # Drizzle schema migrations
├── shared/                     # Shared TypeScript schemas
├── package.json
├── package-lock.json
├── drizzle.config.ts
├── ecosystem.config.cjs        # Reference PM2 config
├── .env.example
└── MANIFEST.txt
```

---

## Option 1: Fresh Installation

### Interactive Prompts

| Prompt | Default | Notes |
|--------|---------|-------|
| Install path | `/opt/hptourism/homestay` | Creates if not exists |
| Domain name | `homestay.hp.gov.in` | Used for Nginx & .env |
| Port | `5060` | Application listening port |
| Database name | `hptourism` | PostgreSQL database |
| Database user | `hptourism` | PostgreSQL user |
| Database password | (prompted) | Stored in .env only |
| Backup path | `/opt/backup/homestay` | For automated backups |
| Seed staff accounts? | `n` | Optional dummy DA/DTDO |

### Installation Flow

1. **Dependency Check** - PostgreSQL, Node.js 20+, Nginx, PM2
2. **Database Setup** - Create user and database
3. **File Deployment** - Copy dist, node_modules, shared, migrations, Database
4. **Environment Config** - Generate `.env` from prompts
5. **Schema Migration** - Run `npm run db:push`
6. **Data Seeding** - Run `admin_accounts_seed.sql`, `ddo_codes_seed.sql`
7. **PM2 Startup** - `pm2 start ./dist/index.js --name hptourism-prod`
8. **Startup Verification** ← **NEW in v0.9.5**
   - Port binding check (10 retries, 30 seconds max)
   - HTTP health check (localhost:PORT returns 200/302)
   - Auto-exit with logs on failure
9. **Nginx Setup** - Generate config from template
10. **SSL Setup** - Certbot, manual certs, or self-signed
11. **Complete** - Display access URL

### PM2 Start Command (Fixed in v0.9.5)

```bash
pm2 start ./dist/index.js --name hptourism-prod --cwd "$install_path" -i 1 --time
```

> **Note**: Uses direct script path instead of ecosystem config file to avoid PM2 misinterpretation.

---

## Option 2: Update Existing Installation

### Update Flow

1. **Backup** - Auto-create `/tmp/hptourism-backup-YYYYMMDD-HHMMSS/`
2. **Stop App** - `pm2 stop hptourism-prod`
3. **Update Files** - Copy new dist, node_modules, shared, package.json
4. **Migrate Schema** - `npm run db:push`
5. **Re-seed Admins** - Run `admin_accounts_seed.sql` (upserts, safe to repeat)
6. **Restart App** - `pm2 start ./dist/index.js --name hptourism-prod`
7. **Verify Startup** - Port check + health check
8. **Complete** - Show backup location

---

## Option 3: Restore from Backup

1. Prompt for backup directory path
2. Stop current PM2 process
3. Restore application files
4. Restart PM2
5. Verify restoration

---

## Option 4: Uninstall / Clean

```
⚠️  WARNING: This will remove ALL data!

[x] Stop and remove PM2 process
[x] Drop database
[x] Remove application files
[x] Remove Nginx config

Type 'DELETE' to confirm: _
```

---

## Seeded User Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `superadmin` | `Ulan@2025` | `super_admin` | Full system access |
| `admin` | `Admin@2025` | `admin` | User Mgmt + RC Applications only |
| `adminrc` | `ulan@2025` | `admin_rc` | RC Console |
| `supervisor_hq` | `Welcome@123` | `state_officer` | Workflow Monitoring |

---

## Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgresql://hptourism:PASSWORD@localhost:5432/hptourism

# Application
NODE_ENV=production
PORT=5060
SESSION_SECRET=<generated-64-char-hex>

# Domain
APP_URL=https://homestay.hp.gov.in

# Rate Limiting
RATE_LIMIT_GLOBAL=1000
RATE_LIMIT_AUTH=100
RATE_LIMIT_UPLOAD=50

# Backup
BACKUP_PATH=/opt/backup/homestay

# Logging
LOG_LEVEL=info
```

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 50 GB |
| Node.js | 20.x | 20.x LTS |
| PostgreSQL | 12+ | 15+ |

---

## Startup Verification (v0.9.5 Feature)

The installer now includes bulletproof startup verification:

```bash
# Port binding check (10 retries, 3 seconds apart)
for i in $(seq 1 10); do
    if ss -tlpn | grep -q ":$port "; then
        break
    fi
    sleep 3
done

# Health check
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/)

if [[ "$HTTP_CODE" != "200" && "$HTTP_CODE" != "302" ]]; then
    echo "FATAL: Health check failed!"
    pm2 logs hptourism-prod --lines 20 --nostream
    exit 1
fi
```

**Benefit**: Installation fails loudly with logs if app doesn't start, preventing silent 502 errors.

---

## Build Package Command

```bash
bash scripts/build-package.sh 0.9.5
```

Output: `release/hptourism-v0.9.5-offline.tar.gz` (~237 MB)

---

## Quick Install Commands

```bash
# Extract
tar -xzf hptourism-v0.9.5-offline.tar.gz
cd hptourism-v0.9.5-offline

# Run installer
sudo bash deploy/install.sh
```
