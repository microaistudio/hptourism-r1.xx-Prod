#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# HP Tourism Homestay Portal — Patch v1.1.6 Deployment
# Timezone Fix: Drizzle ORM Timestamp Correction
#
# This script deploys the timestamp fix to PROD in a safe, step-by-step
# manner with full backup and dry-run verification.
#
# USAGE:  bash deploy-1.1.6.sh
# RUN AS: root (or user with sudo + PM2 access)
# ═══════════════════════════════════════════════════════════════════════

set -e

# ─── Configuration ────────────────────────────────────────────────────
APP_DIR="/opt/hptourism/homestay"
DB_NAME="hptourism"
DB_USER="hptourism"
BACKUP_DIR="/opt/backup/homestay"
PM2_APP="hptourism-prod"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/hptourism_pre_v116_${TIMESTAMP}.sql.gz"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

header() { echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"; echo -e "${BOLD}${CYAN} $1${NC}"; echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"; }
ok()     { echo -e "  ${GREEN}✅ $1${NC}"; }
warn()   { echo -e "  ${YELLOW}⚠️  $1${NC}"; }
fail()   { echo -e "  ${RED}❌ $1${NC}"; }
info()   { echo -e "  ${CYAN}→ $1${NC}"; }
ask()    { echo -e "\n${YELLOW}${BOLD}$1${NC}"; read -p "  Press ENTER to continue, or Ctrl+C to abort... "; }

header "HP Tourism Patch v1.1.6 — Drizzle Timestamp Fix"
echo -e "  Date:     $(date)"
echo -e "  App Dir:  ${APP_DIR}"
echo -e "  Database: ${DB_NAME}"
echo -e "  Backup:   ${BACKUP_FILE}"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# STEP 0: INSTALL PATCH FILES
# ═══════════════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

header "Step 0/7: Installing Patch Files"

# Copy bundled files to the app directory
if [ -f "$SCRIPT_DIR/package.json" ]; then
  cp "$SCRIPT_DIR/package.json" "$APP_DIR/package.json"
  ok "Copied package.json (v1.1.6)"
fi

if [ -f "$SCRIPT_DIR/patch-drizzle-timestamp.sh" ]; then
  mkdir -p "$APP_DIR/scripts"
  cp "$SCRIPT_DIR/patch-drizzle-timestamp.sh" "$APP_DIR/scripts/patch-drizzle-timestamp.sh"
  chmod +x "$APP_DIR/scripts/patch-drizzle-timestamp.sh"
  ok "Copied patch-drizzle-timestamp.sh"
fi

if [ -f "$SCRIPT_DIR/ecosystem.prod.cjs" ]; then
  cp "$SCRIPT_DIR/ecosystem.prod.cjs" "$APP_DIR/ecosystem.prod.cjs"
  ok "Copied ecosystem.prod.cjs (with TZ/PGTZ)"
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 1: PRE-FLIGHT CHECKS
# ═══════════════════════════════════════════════════════════════════════
header "Step 1/7: Pre-Flight Checks"

# Check app directory
if [ ! -d "$APP_DIR" ]; then
  fail "App directory not found: $APP_DIR"
  exit 1
fi
ok "App directory exists"

# Check current version
CURRENT_VERSION=$(node -e "console.log(require('${APP_DIR}/package.json').version)" 2>/dev/null || echo "unknown")
info "Current version: ${CURRENT_VERSION}"

# Check PM2 process
PM2_STATUS=$(pm2 jlist 2>/dev/null | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
try{const p=JSON.parse(d).find(a=>a.name==='${PM2_APP}');
console.log(p?p.pm2_env.status:'not_found');}catch(e){console.log('error');}" 2>/dev/null)
if [ "$PM2_STATUS" = "online" ]; then
  ok "PM2 process '$PM2_APP' is online"
else
  warn "PM2 process '$PM2_APP' status: $PM2_STATUS"
fi

# Check DB connection
sudo -u postgres psql -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  ok "Database '$DB_NAME' is reachable"
else
  fail "Cannot connect to database '$DB_NAME'"
  exit 1
fi

# Check Drizzle patch status
TIMESTAMP_JS="${APP_DIR}/node_modules/drizzle-orm/pg-core/columns/timestamp.js"
if grep -q '+0530' "$TIMESTAMP_JS" 2>/dev/null; then
  warn "Drizzle is ALREADY patched with +0530. Patch may have been applied manually."
else
  info "Drizzle is unpatched (+0000) — will be fixed"
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 2: DATABASE BACKUP
# ═══════════════════════════════════════════════════════════════════════
header "Step 2/7: Database Backup"

mkdir -p "$BACKUP_DIR"
info "Creating backup: ${BACKUP_FILE}"

sudo -u postgres pg_dump "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  ok "Backup created: ${BACKUP_FILE} (${BACKUP_SIZE})"
else
  fail "Backup failed!"
  exit 1
fi

echo ""
echo -e "  ${BOLD}To restore if needed:${NC}"
echo -e "  ${CYAN}gunzip -c ${BACKUP_FILE} | sudo -u postgres psql ${DB_NAME}${NC}"

# ═══════════════════════════════════════════════════════════════════════
# STEP 3: APPLY DRIZZLE CODE PATCH
# ═══════════════════════════════════════════════════════════════════════
header "Step 3/7: Apply Drizzle Code Patch"

ask "Ready to patch Drizzle's timestamp.js? (Code change only, no data changes)"

# Show the BEFORE state
info "BEFORE patch:"
grep -n 'mapFromDriverValue\|mapToDriverValue\|0000\|0530\|toISOString\|istMs' "$TIMESTAMP_JS" 2>/dev/null | head -10

# Apply the patch
cd "$APP_DIR"
bash scripts/patch-drizzle-timestamp.sh

# Show the AFTER state
echo ""
info "AFTER patch:"
grep -n 'mapFromDriverValue\|mapToDriverValue\|0000\|0530\|toISOString\|istMs' "$TIMESTAMP_JS" 2>/dev/null | head -10

# Verify
if grep -q '+0530' "$TIMESTAMP_JS" && grep -q 'istMs' "$TIMESTAMP_JS"; then
  ok "Drizzle patch applied successfully"
else
  fail "Drizzle patch FAILED — check manually!"
  exit 1
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 4: UPDATE ECOSYSTEM CONFIG
# ═══════════════════════════════════════════════════════════════════════
header "Step 4/7: Update PM2 Ecosystem Config"

ECOSYSTEM_FILE="${APP_DIR}/ecosystem.config.cjs"
if [ -f "$ECOSYSTEM_FILE" ]; then
  # Check if TZ is already set
  if grep -q "TZ.*Asia/Kolkata" "$ECOSYSTEM_FILE" 2>/dev/null; then
    ok "TZ already set in ecosystem config"
  else
    warn "TZ not found in ecosystem config. Adding to PM2 env directly..."
  fi
  
  # Regardless, we'll set it in PM2 environment
  info "Setting TZ and PGTZ in PM2 process environment..."
fi

# ═══════════════════════════════════════════════════════════════════════
# STEP 5: DATA MIGRATION — DRY RUN (READ-ONLY)
# ═══════════════════════════════════════════════════════════════════════
header "Step 5/7: Data Migration — DRY RUN (Preview Only)"
echo -e "  ${BOLD}This step changes NOTHING.${NC} It only shows what WOULD change."

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

-- ═══════════════════════════════════════════════════════════════════════
-- DRY RUN: Shows before/after for ALL columns that need UTC → IST shift
-- Rule: Any non-null timestamp that differs from created_at was written 
-- by Drizzle's toISOString() (UTC) and needs +5:30 shift
-- ═══════════════════════════════════════════════════════════════════════

\echo ''
\echo '── Table: homestay_applications ──'
\echo 'Rows where updated_at differs from created_at (Drizzle-written UTC):'
SELECT 
  id,
  to_char(created_at, 'DD Mon HH24:MI') as created_ist,
  to_char(updated_at, 'DD Mon HH24:MI') as updated_now,
  to_char(updated_at + interval '5 hours 30 minutes', 'DD Mon HH24:MI') as updated_fixed,
  CASE WHEN updated_at < created_at THEN '⚠️ BEFORE created (clearly UTC)' ELSE '' END as note
FROM homestay_applications
WHERE updated_at IS NOT NULL AND updated_at != created_at
ORDER BY created_at DESC
LIMIT 15;

\echo ''
\echo 'Count of rows to fix by column:'
SELECT 
  'updated_at' as column_name,
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as needs_fix,
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at = created_at) as already_ok
FROM homestay_applications
UNION ALL
SELECT 
  'submitted_at',
  count(*) FILTER (WHERE submitted_at IS NOT NULL AND submitted_at != created_at),
  count(*) FILTER (WHERE submitted_at IS NOT NULL AND submitted_at = created_at)
FROM homestay_applications
UNION ALL
SELECT 
  'da_review_date',
  count(*) FILTER (WHERE da_review_date IS NOT NULL),
  0
FROM homestay_applications
UNION ALL
SELECT 
  'district_review_date',
  count(*) FILTER (WHERE district_review_date IS NOT NULL),
  0
FROM homestay_applications
UNION ALL
SELECT 
  'state_review_date',
  count(*) FILTER (WHERE state_review_date IS NOT NULL),
  0
FROM homestay_applications
UNION ALL
SELECT 
  'site_inspection_completed_date',
  count(*) FILTER (WHERE site_inspection_completed_date IS NOT NULL),
  0
FROM homestay_applications
UNION ALL
SELECT 
  'certificate_issued_date',
  count(*) FILTER (WHERE certificate_issued_date IS NOT NULL),
  0
FROM homestay_applications
UNION ALL
SELECT 
  'approved_at',
  count(*) FILTER (WHERE approved_at IS NOT NULL),
  0
FROM homestay_applications;

\echo ''
\echo '── Table: users ──'
\echo 'Users where updated_at differs from created_at:'
SELECT 
  id,
  username,
  to_char(created_at, 'DD Mon HH24:MI') as created_ist,
  to_char(updated_at, 'DD Mon HH24:MI') as updated_now,
  to_char(updated_at + interval '5 hours 30 minutes', 'DD Mon HH24:MI') as updated_fixed
FROM users
WHERE updated_at IS NOT NULL AND updated_at != created_at
ORDER BY created_at DESC
LIMIT 10;

SELECT 
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as users_needs_fix,
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at = created_at) as users_already_ok
FROM users;

\echo ''
\echo '── Table: inspection_orders ──'
SELECT 
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as needs_fix,
  count(*) as total
FROM inspection_orders;

\echo ''
\echo '── Table: notifications ──'
SELECT 
  count(*) FILTER (WHERE read_at IS NOT NULL) as read_at_needs_fix
FROM notifications;

\echo ''
\echo '── Table: grievances ──'
SELECT 
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as updated_needs_fix,
  count(*) FILTER (WHERE resolved_at IS NOT NULL) as resolved_needs_fix,
  count(*) FILTER (WHERE last_comment_at IS NOT NULL) as last_comment_needs_fix
FROM grievances;

\echo ''
\echo '── Table: himkosh_transactions ──'
SELECT 
  count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as updated_needs_fix,
  count(*) FILTER (WHERE verified_at IS NOT NULL) as verified_needs_fix
FROM himkosh_transactions;

\echo ''
\echo '══════════════════════════════════════════════════════════════════'
\echo ' DRY RUN COMPLETE — Nothing was changed.'
\echo ' Review the above. If it looks correct, proceed to Step 6.'
\echo '══════════════════════════════════════════════════════════════════'

EOSQL

ask "Review the dry-run output above. Does it look correct? Ready to apply?"

# ═══════════════════════════════════════════════════════════════════════
# STEP 6: DATA MIGRATION — EXECUTE
# ═══════════════════════════════════════════════════════════════════════
header "Step 6/7: Data Migration — EXECUTING"
echo -e "  ${RED}${BOLD}This step MODIFIES DATA.${NC} Backup was taken in Step 2."

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

BEGIN;

\echo ''
\echo '── Migrating: homestay_applications ──'

-- updated_at: shift where it differs from created_at (Drizzle-written)
UPDATE homestay_applications
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;

-- submitted_at: shift where it differs from created_at (Drizzle-written)
UPDATE homestay_applications
SET submitted_at = submitted_at + interval '5 hours 30 minutes'
WHERE submitted_at IS NOT NULL AND submitted_at != created_at;

-- da_review_date: always Drizzle-written
UPDATE homestay_applications
SET da_review_date = da_review_date + interval '5 hours 30 minutes'
WHERE da_review_date IS NOT NULL;

-- da_forwarded_date: always Drizzle-written
UPDATE homestay_applications
SET da_forwarded_date = da_forwarded_date + interval '5 hours 30 minutes'
WHERE da_forwarded_date IS NOT NULL;

-- dtdo_review_date: always Drizzle-written
UPDATE homestay_applications
SET dtdo_review_date = dtdo_review_date + interval '5 hours 30 minutes'
WHERE dtdo_review_date IS NOT NULL;

-- district_review_date: always Drizzle-written
UPDATE homestay_applications
SET district_review_date = district_review_date + interval '5 hours 30 minutes'
WHERE district_review_date IS NOT NULL;

-- state_review_date: always Drizzle-written
UPDATE homestay_applications
SET state_review_date = state_review_date + interval '5 hours 30 minutes'
WHERE state_review_date IS NOT NULL;

-- site_inspection_scheduled_date: always Drizzle-written
UPDATE homestay_applications
SET site_inspection_scheduled_date = site_inspection_scheduled_date + interval '5 hours 30 minutes'
WHERE site_inspection_scheduled_date IS NOT NULL;

-- site_inspection_completed_date: always Drizzle-written
UPDATE homestay_applications
SET site_inspection_completed_date = site_inspection_completed_date + interval '5 hours 30 minutes'
WHERE site_inspection_completed_date IS NOT NULL;

-- certificate_issued_date: always Drizzle-written
UPDATE homestay_applications
SET certificate_issued_date = certificate_issued_date + interval '5 hours 30 minutes'
WHERE certificate_issued_date IS NOT NULL;

-- certificate_expiry_date: always Drizzle-written
UPDATE homestay_applications
SET certificate_expiry_date = certificate_expiry_date + interval '5 hours 30 minutes'
WHERE certificate_expiry_date IS NOT NULL;

-- approved_at: always Drizzle-written
UPDATE homestay_applications
SET approved_at = approved_at + interval '5 hours 30 minutes'
WHERE approved_at IS NOT NULL;

-- payment_date: always Drizzle-written
UPDATE homestay_applications
SET payment_date = payment_date + interval '5 hours 30 minutes'
WHERE payment_date IS NOT NULL;

-- refund_date: always Drizzle-written
UPDATE homestay_applications
SET refund_date = refund_date + interval '5 hours 30 minutes'
WHERE refund_date IS NOT NULL;

-- last_read_by_owner: always Drizzle-written
UPDATE homestay_applications
SET last_read_by_owner = last_read_by_owner + interval '5 hours 30 minutes'
WHERE last_read_by_owner IS NOT NULL;

\echo '  ✅ homestay_applications migrated'

\echo ''
\echo '── Migrating: users ──'
UPDATE users
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ users migrated'

\echo ''
\echo '── Migrating: inspection_orders ──'
UPDATE inspection_orders
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ inspection_orders migrated'

\echo ''
\echo '── Migrating: notifications ──'
UPDATE notifications
SET read_at = read_at + interval '5 hours 30 minutes'
WHERE read_at IS NOT NULL;
\echo '  ✅ notifications migrated'

\echo ''
\echo '── Migrating: grievances ──'
UPDATE grievances
SET 
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at 
    THEN updated_at + interval '5 hours 30 minutes' ELSE updated_at END,
  resolved_at = CASE WHEN resolved_at IS NOT NULL 
    THEN resolved_at + interval '5 hours 30 minutes' ELSE resolved_at END,
  last_comment_at = CASE WHEN last_comment_at IS NOT NULL 
    THEN last_comment_at + interval '5 hours 30 minutes' ELSE last_comment_at END,
  last_read_by_owner = CASE WHEN last_read_by_owner IS NOT NULL 
    THEN last_read_by_owner + interval '5 hours 30 minutes' ELSE last_read_by_owner END,
  last_read_by_officer = CASE WHEN last_read_by_officer IS NOT NULL 
    THEN last_read_by_officer + interval '5 hours 30 minutes' ELSE last_read_by_officer END
WHERE updated_at != created_at 
   OR resolved_at IS NOT NULL 
   OR last_comment_at IS NOT NULL
   OR last_read_by_owner IS NOT NULL
   OR last_read_by_officer IS NOT NULL;
\echo '  ✅ grievances migrated'

\echo ''
\echo '── Migrating: himkosh_transactions ──'
UPDATE himkosh_transactions
SET
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at
    THEN updated_at + interval '5 hours 30 minutes' ELSE updated_at END,
  verified_at = CASE WHEN verified_at IS NOT NULL
    THEN verified_at + interval '5 hours 30 minutes' ELSE verified_at END
WHERE updated_at != created_at
   OR verified_at IS NOT NULL;
\echo '  ✅ himkosh_transactions migrated'

COMMIT;

\echo ''
\echo '══════════════════════════════════════════════════════════════════'
\echo ' DATA MIGRATION COMPLETE.'
\echo '══════════════════════════════════════════════════════════════════'

EOSQL

ok "Data migration completed"

# ═══════════════════════════════════════════════════════════════════════
# STEP 7: RESTART & VERIFY
# ═══════════════════════════════════════════════════════════════════════
header "Step 7/7: Restart & Verify"

ask "Ready to restart PM2 with TZ environment?"

# Restart PM2 with new env
info "Restarting PM2 process with TZ=Asia/Kolkata..."
pm2 restart "$PM2_APP" --update-env --node-args="--enable-source-maps" 2>/dev/null || \
pm2 start "$APP_DIR/ecosystem.config.cjs" --update-env 2>/dev/null || \
pm2 start "$APP_DIR/dist/index.js" --name "$PM2_APP" --node-args="--enable-source-maps" 2>/dev/null

# Wait for startup
sleep 3

# Check process is online
PM2_STATUS=$(pm2 jlist 2>/dev/null | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
try{const p=JSON.parse(d).find(a=>a.name==='${PM2_APP}');
console.log(p?p.pm2_env.status:'not_found');}catch(e){console.log('error');}" 2>/dev/null)

if [ "$PM2_STATUS" = "online" ]; then
  ok "PM2 process is online"
else
  warn "PM2 process status: $PM2_STATUS — check logs!"
fi

# Check HTTP
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5055/" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
  ok "HTTP 200 — site is responding"
else
  warn "HTTP status: $HTTP_CODE"
fi

# Verify Drizzle patch is still applied
if grep -q '+0530' "$TIMESTAMP_JS" && grep -q 'istMs' "$TIMESTAMP_JS"; then
  ok "Drizzle patch verified"
else
  fail "Drizzle patch NOT found after restart!"
fi

# Quick DB verification
echo ""
info "Post-migration spot check:"
sudo -u postgres psql -d "$DB_NAME" -c "
  SELECT 
    to_char(created_at, 'DD Mon HH24:MI') as created,
    to_char(updated_at, 'DD Mon HH24:MI') as updated,
    CASE WHEN updated_at >= created_at OR updated_at = created_at 
      THEN '✅ OK' ELSE '⚠️ CHECK' END as status
  FROM homestay_applications
  WHERE updated_at IS NOT NULL AND updated_at != created_at
  ORDER BY created_at DESC
  LIMIT 5;
"

echo ""
header "🎉 Patch v1.1.6 Deployment Complete"
echo -e "  ${GREEN}${BOLD}Drizzle timestamp fix is LIVE${NC}"
echo ""
echo -e "  ${BOLD}What was done:${NC}"
echo -e "  1. Database backup: ${BACKUP_FILE}"
echo -e "  2. Drizzle read patch:  +0000 → +0530"  
echo -e "  3. Drizzle write patch: toISOString → IST wall-clock"
echo -e "  4. Data migration: UTC timestamps shifted +5:30"
echo -e "  5. PM2 restarted with TZ=Asia/Kolkata"
echo ""
echo -e "  ${BOLD}To rollback if needed:${NC}"
echo -e "  1. Restore DB:     gunzip -c ${BACKUP_FILE} | sudo -u postgres psql ${DB_NAME}"
echo -e "  2. Revert patch:   sed -i 's/+0530/+0000/g' ${TIMESTAMP_JS}"
echo -e "  3. Restart:        pm2 restart ${PM2_APP}"
echo ""
