# Disaster Recovery: System Restoration Guide

## Overview
This guide explains how to rebuild the entire HP Tourism Homestay system from scratch using the daily backups.
**Prerequisites:** You need a fresh server (Ubuntu 22.04 recommended) with Node.js (v20+) and PostgreSQL (v14+) installed.

## 1. Locate Your Backups
Retrieve the latest backup folder from your offsite storage or the `backups/` directory.
You will need three components from a specific timestamp (e.g., `backup_20260120_020000`):
1.  **Database**: `db/backup_YYYYMMDD_HHMMSS_database.sql.gz`
2.  **Files**: The `files/` directory (contains `documents/`, `images/`, etc.)
3.  **Config**: `config/backup_YYYYMMDD_HHMMSS.env` (or `latest.env`)

---

## 2. Step-by-Step Restoration

### Step A: Restore Codebase
Clone the latest application code from your Git repository.
```bash
git clone https://github.com/StartUp-Himachal/hptourism-portal.git hptourism-rc8
cd hptourism-rc8
npm install
```

### Step B: Restore Configuration
Copy your backed-up `.env` file to the project root.
```bash
# Assuming you have your backup in /tmp/backup_restore/
cp /tmp/backup_restore/config/latest.env .env
```

### Step C: Restore Database
Create the database and import the SQL dump.
```bash
# 1. Create DB (matches DATABASE_URL in .env)
createdb hptourism-rc8

# 2. Decompress and Import
gunzip -c /tmp/backup_restore/db/backup_YYYYMMDD_HHMMSS_database.sql.gz | psql hptourism-rc8
```

### Step D: Restore File Storage
Copy the backed-up files to the local Object Storage directory.
*Note: The target directory is defined in `.env` as `LOCAL_OBJECT_DIR` (default: `local-object-storage`).*

```bash
# Ensure directory exists
mkdir -p local-object-storage

# Restore files (using rsync to preserve timestamps)
rsync -av /tmp/backup_restore/files/ local-object-storage/
```

### Step E: Start the System
Rebuild and start the application.
```bash
npm run build
pm2 start ecosystem.config.cjs
```

---

## 3. Verification
After starting, run the Smoke Test to confirm the restored system is fully functional.
```bash
# Run verifying smoke test
npm run test:smoke-live
```
