# Development, Testing & Deployment Process Flow

> Document: DEV_TEST_DEPLOY_Process_Flow_R1.md  
> Version: R1.0  
> Last Updated: 2026-02-03

---

## 1. Environment Overview

| Environment | Location | Port | Purpose |
|-------------|----------|------|---------|
| **DEV1** | `/home/subhash.thakur.india/Projects/hptourism/homestay` | 5040 | Active development, source of code |
| **TST** | `/opt/hptourism/homestay` | 5055 | Pre-production testing (mirrors PROD structure) |
| **R1** | `/home/subhash.thakur.india/Projects/hptourism-r1` | 5030 | Backup of last deployed version |

---

## 2. Environment Details

### 2.1 DEV1 - Development Environment

**Path:** `/home/subhash.thakur.india/Projects/hptourism/homestay`  
**Port:** 5040  
**Database:** Local development DB

**Purpose:**
- All active development happens here
- Source of truth for code
- Build packages from here
- Run in development mode with hot-reload

**Commands:**
```bash
cd /home/subhash.thakur.india/Projects/hptourism/homestay
npm run dev          # Start dev server on port 5040
npm run build        # Build production bundle
```

---

### 2.2 TST - Pre-Production Testing Environment

**Path:** `/opt/hptourism/homestay`  
**Port:** 5055  
**Database:** `hptourism` (same as PROD)

**Purpose:**
- Tests deployment packages before PROD
- Exact same directory structure as production
- Validates package installation process
- Uses PM2 for process management (same as PROD)

**Why /opt folder:**
- Mirrors production server structure exactly
- Same permissions model
- Same folder paths in config
- If it works here, it works in PROD

**Commands:**
```bash
# Deploy package to TST
pm2 stop hptourism-prod
rm -rf /opt/hptourism/homestay/dist
tar -xzvf ~/setup/hptourism-<version>.tar.gz -C /opt/hptourism/homestay/
pm2 start hptourism-prod

# Verify
curl http://localhost:5055/api/health
```

---

### 2.3 R1 - Deployed Version Backup

**Path:** `/home/subhash.thakur.india/Projects/hptourism-r1`  
**Port:** N/A (not running)  
**Database:** N/A

**Purpose:**
- Backup copy of the last successfully deployed version
- Rollback reference if issues occur
- Code snapshot for comparison

**When to Update:**
- After successful PROD deployment is verified
- Before starting major feature development

---

## 3. Deployment Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   DEV1          Build Package         TST            PROD           │
│  (5040)   ─────────────────────►   (5055)   ────────►  Server       │
│     │                                  │               (5055)       │
│     │                                  │                 │          │
│     │         After Success            │     After      │          │
│     │       ◄─────────────────         │    Verified    │          │
│     │                                  │       │        │          │
│     ▼                                  ▼       ▼        ▼          │
│    R1 ◄────────────────────────────── Backup Copy                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Process:

1. **Develop in DEV1**
   - Make code changes in `/Projects/hptourism/homestay`
   - Test locally on port 5040
   - Commit changes (if using git)

2. **Build Package**
   ```bash
   cd /home/subhash.thakur.india/Projects/hptourism/homestay
   rm -rf dist && npm run build
   tar -czvf ~/setup/hptourism-v<X.X.X>.tar.gz dist/
   ```

3. **Test in TST (Pre-Production)**
   ```bash
   pm2 stop hptourism-prod
   rm -rf /opt/hptourism/homestay/dist
   tar -xzvf ~/setup/hptourism-v<X.X.X>.tar.gz -C /opt/hptourism/homestay/
   pm2 start hptourism-prod
   ```
   - Verify all features work on port 5055
   - Check logs: `pm2 logs hptourism-prod`

4. **Deploy to PROD**
   - Same commands as TST (on production server)
   - Verify production is working

5. **Backup to R1**
   ```bash
   # After verified PROD deployment
   rm -rf /home/subhash.thakur.india/Projects/hptourism-r1/*
   rsync -av --exclude='node_modules' --exclude='dist' \
     /home/subhash.thakur.india/Projects/hptourism/homestay/ \
     /home/subhash.thakur.india/Projects/hptourism-r1/
   ```

---

## 4. Port Configuration

| Port | Environment | Usage |
|------|-------------|-------|
| 5030 | R1 | Backup version (for comparison testing) |
| 5040 | DEV1 | Development server (npm run dev) |
| 5055 | TST/PROD | Production builds (PM2) |

**Important:** TST and PROD both use port 5055 because:
- TST runs locally before PROD deployment
- PROD runs on production server
- Same port ensures identical Nginx/config testing

---

## 5. Sync Schedule

| Event | Action |
|-------|--------|
| After feature completion | Build package from DEV1 |
| Before PROD deploy | Test package in TST |
| After PROD verified | Update R1 backup |
| Before major feature | Verify R1 matches PROD |

---

## 6. Rollback Procedure

If PROD deployment fails:

1. **Immediate:** Redeploy last known-good package
2. **Reference:** Check R1 for last working code
3. **Compare:** Diff DEV1 vs R1 to find breaking changes

---

## 7. Cleanup (One-Time)

Delete obsolete RC directories:
```bash
cd /home/subhash.thakur.india/Projects
rm -rf hptourism-rc6 hptourism-rc6j hptourism-rc7 hptourism-rc8
```

Keep only:
- `hptourism/homestay` (DEV1)
- `hptourism-r1` (Backup)
