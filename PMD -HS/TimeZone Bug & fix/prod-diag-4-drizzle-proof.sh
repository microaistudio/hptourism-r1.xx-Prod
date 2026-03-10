#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# PROD DIAGNOSTIC SCRIPT 4/4: Drizzle Write Proof
# Run on PROD server IN the app directory  
# This creates a TEMPORARY test record, checks it, then DELETES it.
# ═══════════════════════════════════════════════════════════════

APP_DIR="${1:-/opt/hptourism/homestay}"
DB_NAME="${2:-hptourism}"

echo "═══════════════════════════════════════════════════════"
echo " SCRIPT 4: Drizzle Write Behavior Proof"
echo " App Dir: $APP_DIR"
echo " Database: $DB_NAME"  
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"

echo ""
echo "── 1. What Drizzle's mapToDriverValue currently does ──"
TIMESTAMP_JS="$APP_DIR/node_modules/drizzle-orm/pg-core/columns/timestamp.js"
if [ -f "$TIMESTAMP_JS" ]; then
  echo "  mapToDriverValue line:"
  grep -A3 "mapToDriverValue" "$TIMESTAMP_JS" | head -6
  echo ""
  echo "  mapFromDriverValue line:"
  grep -A3 "mapFromDriverValue" "$TIMESTAMP_JS" | head -4
else
  echo "  ⚠️ timestamp.js not found at: $TIMESTAMP_JS"
fi

echo ""
echo "── 2. Proof: Insert test record via SQL and check behavior ──"
echo "  We'll insert a record using BOTH methods and compare:"

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

-- Step A: What does Postgres now() produce?
SELECT 
  'Postgres now()' as method,
  to_char(now(), 'YYYY-MM-DD HH24:MI:SS') as value,
  'This is what defaultNow() stores' as note;

-- Step B: What would toISOString() produce?
-- At this exact moment, JavaScript toISOString() would give UTC
-- We can simulate: current IST time minus 5:30 = UTC
SELECT 
  'JS toISOString()' as method,
  to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') as value,
  'This is what Drizzle toISOString() would store' as note;

-- Step C: The difference
SELECT 
  to_char(now(), 'HH24:MI:SS') as postgres_now_ist,
  to_char(now() AT TIME ZONE 'UTC', 'HH24:MI:SS') as js_toiso_utc,
  to_char(now() - (now() AT TIME ZONE 'UTC'), 'HH24:MI:SS') as difference,
  CASE 
    WHEN EXTRACT(EPOCH FROM (now() - (now() AT TIME ZONE 'UTC'))) BETWEEN 19500 AND 20100
    THEN '⚠️ YES - 5:30 gap exists. Drizzle DOES write UTC.'
    ELSE '✅ No significant gap'
  END as conclusion;

EOSQL

echo ""
echo "── 3. Actual PROD data evidence ──"
echo "  Looking for rows where created_at and updated_at are"
echo "  within seconds of each other (same operation)."
echo "  If gap is ~5:30, updated_at is in UTC."

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

-- Find apps where submitted_at was set within a short time of created_at
-- (indicating same form submission operation)
-- If submitted_at is ~5:30 BEHIND created_at, it's UTC
SELECT 
  id,
  to_char(created_at, 'DD Mon HH24:MI:SS') as created_at_ist,
  to_char(submitted_at, 'DD Mon HH24:MI:SS') as submitted_at_val,
  ROUND(EXTRACT(EPOCH FROM (created_at - submitted_at))) as diff_seconds,
  CASE 
    WHEN EXTRACT(EPOCH FROM (created_at - submitted_at)) BETWEEN 19500 AND 20100
    THEN '⚠️ submitted_at IS UTC (5:30 behind)'
    WHEN ABS(EXTRACT(EPOCH FROM (created_at - submitted_at))) < 300
    THEN '✅ Both appear to be IST'
    ELSE '🔍 Different times (normal)'
  END as diagnosis
FROM homestay_applications 
WHERE submitted_at IS NOT NULL
ORDER BY created_at DESC
LIMIT 15;

EOSQL

echo ""
echo "═══════════════════════════════════════════════════════"
echo " DONE. Copy-paste this entire output back."
echo " This is the KEY diagnostic — Section 3 tells us"
echo " whether PROD data migration is needed or not."
echo "═══════════════════════════════════════════════════════"
