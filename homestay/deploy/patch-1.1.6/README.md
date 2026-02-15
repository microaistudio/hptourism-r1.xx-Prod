# HP Tourism Homestay Portal — Patch v1.1.6

## Drizzle ORM Timestamp Fix

### What This Patch Fixes

Drizzle ORM has a bug where it:
1. **READS** `timestamp without time zone` values and appends `+0000` (UTC), causing IST timestamps to display +5:30 ahead
2. **WRITES** timestamps using JavaScript's `toISOString()` which always outputs UTC, causing data to be stored 5:30 hours behind

### Changes Included

| Component | Change |
|-----------|--------|
| `package.json` | Version bump 1.1.5 → 1.1.6, postinstall hook |
| `scripts/patch-drizzle-timestamp.sh` | Auto-patches Drizzle on `npm install` |
| `ecosystem.prod.cjs` | Added `TZ` and `PGTZ` env vars |
| Data migration | Shifts existing UTC timestamps +5:30 to IST |

### Files to Copy to PROD

```
/opt/hptourism/homestay/
├── package.json                          (updated: version + postinstall)
├── scripts/patch-drizzle-timestamp.sh    (the patch script)
├── ecosystem.prod.cjs                    (updated: TZ/PGTZ env)
└── deploy/patch-1.1.6/
    ├── deploy-1.1.6.sh                   (master deployment script)
    └── rollback-1.1.6.sh                 (emergency rollback)
```

### Deployment Steps

```bash
# 1. Copy files to PROD server
scp -r deploy/patch-1.1.6/ root@prod:/opt/hptourism/homestay/deploy/
scp package.json root@prod:/opt/hptourism/homestay/
scp scripts/patch-drizzle-timestamp.sh root@prod:/opt/hptourism/homestay/scripts/
scp ecosystem.prod.cjs root@prod:/opt/hptourism/homestay/

# 2. SSH into PROD and run the deployment
ssh root@prod
cd /opt/hptourism/homestay/deploy/patch-1.1.6/
bash deploy-1.1.6.sh
```

The deployment script will:
1. ✅ Run pre-flight checks
2. ✅ Take a full database backup
3. ✅ Apply the Drizzle code patch
4. ✅ Show a DRY-RUN preview of data changes
5. ✅ Wait for your approval
6. ✅ Execute the data migration
7. ✅ Restart PM2 and verify

### Emergency Rollback

```bash
# Option A: Rollback script (reverses data migration)
bash rollback-1.1.6.sh

# Option B: Full DB restore (nuclear option)
gunzip -c /opt/backup/homestay/hptourism_pre_v116_*.sql.gz | sudo -u postgres psql hptourism
sed -i 's/+0530/+0000/g' /opt/hptourism/homestay/node_modules/drizzle-orm/pg-core/columns/timestamp.js
pm2 restart hptourism-prod
```
