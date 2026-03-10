# HP Tourism Homestay Portal - Update & Migration Protocols

> [!NOTE]
> **Purpose:** This document defines the standard operating procedures (SOP) for preparing and deploying updates to the Production environment, categorized by the scope of changes.

---

## 📊 Update Categories & Pack Sizing

We classify updates into three distinct types to minimize risk and deployment size.

### **Type A: Code-Only Hotfix / Patch**
*   **Description:** Updates involving only logic changes in backend API (`server/`) or frontend UI (`client/`).
*   **Conditions:**
    *   ✅ NO new NPM packages/dependencies installed.
    *   ✅ NO changes to database schema or migrations.
    *   ✅ NO changes to `.env` variables.
*   **Artifact Strategy:** **Lean Pack**.
    *   **Includes:** `dist/` (built code), `package.json` (for version check), `scripts/`.
    *   **Excludes:** `node_modules`, `.env`, `migrations`.
*   **Estimated Size:** **~10-20 MB**.
*   **Deployment Risk:** 🟢 **Low** (Zero-downtime possible).

### **Type B: Logic + Data Structure Update**
*   **Description:** Updates that modify code AND the database structure (e.g., adding a column, creating a table).
*   **Conditions:**
    *   ✅ Includes new Migration files (`.sql`).
    *   ✅ NO new NPM dependencies.
*   **Artifact Strategy:** **Migration Pack**.
    *   **Includes:** `dist/`, `package.json`, `migrations/` (Required), `scripts/`.
    *   **Excludes:** `node_modules`, `.env`, backup ZIPs inside migrations folder.
*   **Estimated Size:** **~25-50 MB** (depending on migration history size).
*   **Deployment Risk:** 🟡 **Medium** (Requires DB migration lock).

### **Type C: Full Stack / Governance Update**
*   **Description:** Major updates involving new libraries, platform upgrades, or significant architectural shifts.
*   **Conditions:**
    *   ✅ `package.json` has new dependencies.
    *   ✅ OR `node_modules` needs a rebuild.
    *   ✅ OR `.env` requires new keys.
*   **Artifact Strategy:** **Full Pack** (minus dependencies).
    *   **Includes:** `dist/`, `package.json`, `migrations/`, `ecosystem.config.cjs`, `scripts/`.
    *   **Excludes:** `node_modules` (Must run `npm install --production` on server to ensure OS compatibility).
*   **Estimated Size:** **~50-100 MB**.
*   **Deployment Risk:** 🔴 **High** (Requires full restart & dependency install).

---

## 🛠️ Artifact Creation Protocol (Commands)

### For Type A (Code-Only Hotfix) - *Recommended for v1.1.5*
```bash
# Minimal pack (~15MB)
tar -czvf hptourism-v1.X-code-patch.tar.gz \
    dist/ \
    package.json \
    scripts/ \
    --exclude='.env' \
    --exclude='node_modules' \
    --exclude='migrations' \
    --exclude='.git'
```

### For Type B (With Migrations)
```bash
# Migration pack (~40MB)
tar -czvf hptourism-v1.X-migration-update.tar.gz \
    dist/ \
    migrations/ \
    package.json \
    scripts/ \
    --exclude='.env' \
    --exclude='node_modules' \
    --exclude='*.zip' # Exclude large backups inside migrations
```

### For Type C (Full Update)
```bash
# Governance pack (~80MB+)
tar -czvf hptourism-v1.X-full-update.tar.gz \
    dist/ \
    migrations/ \
    package.json \
    ecosystem.config.cjs \
    scripts/ \
    --exclude='.env' \
    --exclude='node_modules' \
    --exclude='*.zip'
```

---

## 🚀 Deployment Checklist by Type

| Step | Type A (Code) | Type B (DB+) | Type C (Full) |
|:---|:---:|:---:|:---:|
| **1. Backup `dist/`** | ✅ | ✅ | ✅ |
| **2. Backup DB** | Optional | ✅ | ✅ |
| **3. Extract Artifact**| ✅ | ✅ | ✅ |
| **4. `npm install`** | ❌ | ❌ | ✅ |
| **5. Update `.env`** | ❌ | ❌ | ✅ |
| **6. Run Migrations**| ❌ | ✅ | ✅ |
| **7. PM2 Restart** | ✅ | ✅ | ✅ |
| **8. Verify** | ✅ | ✅ | ✅ |

