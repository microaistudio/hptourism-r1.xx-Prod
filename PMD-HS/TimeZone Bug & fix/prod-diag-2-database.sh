#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# PROD DIAGNOSTIC SCRIPT 2/4: Database Timestamp Analysis
# Run on PROD server. Needs access to the hptourism database.
# Usage: sudo -u postgres bash prod-diag-2-database.sh
#   OR:  PGPASSWORD=xxx psql -U hptourism_user -d hptourism -f prod-diag-2-database.sql
# ═══════════════════════════════════════════════════════════════

DB_NAME="${1:-hptourism}"

echo "═══════════════════════════════════════════════════════"
echo " SCRIPT 2: Database Timestamp Analysis"
echo " Database: $DB_NAME"
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

-- 1. PostgreSQL timezone setting
\echo ''
\echo '── 1. PostgreSQL Timezone ──'
SHOW timezone;
SELECT now() as pg_now, to_char(now(), 'YYYY-MM-DD HH24:MI:SS TZ') as pg_now_formatted;

-- 2. Total record counts
\echo ''
\echo '── 2. Record Counts ──'
SELECT 
  (SELECT count(*) FROM homestay_applications) as total_applications,
  (SELECT count(*) FROM application_actions) as total_actions,
  (SELECT count(*) FROM users) as total_users,
  (SELECT count(*) FROM documents) as total_documents,
  (SELECT count(*) FROM himkosh_transactions) as total_himkosh;

-- 3. CRITICAL CHECK: Compare created_at vs updated_at for timestamp gap
-- If updated_at was written by Drizzle (UTC), the gap will be ~5:30 hours
-- If both are IST, the gap will be small (seconds to minutes)
\echo ''
\echo '── 3. CRITICAL: created_at vs updated_at Gap Analysis (homestay_applications) ──'
\echo '    If gap is ~5:30:00 → updated_at is in UTC (needs migration)'
\echo '    If gap is small (seconds/minutes) → both are IST (no migration needed)'
SELECT 
  id,
  to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
  to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at,
  to_char(updated_at - created_at, 'HH24:MI:SS') as gap,
  CASE 
    WHEN ABS(EXTRACT(EPOCH FROM (updated_at - created_at))) BETWEEN 19500 AND 20100 
    THEN '⚠️ LIKELY UTC (-5:30 from IST)'
    WHEN ABS(EXTRACT(EPOCH FROM (updated_at - created_at))) < 600 
    THEN '✅ Looks IST (small gap)'
    ELSE '🔍 Normal gap (updated later)'
  END as verdict
FROM homestay_applications 
WHERE updated_at IS NOT NULL AND updated_at != created_at
ORDER BY created_at DESC
LIMIT 10;

-- 4. Count apps by gap category
\echo ''
\echo '── 4. Gap Distribution (homestay_applications) ──'
SELECT 
  CASE 
    WHEN ABS(EXTRACT(EPOCH FROM (updated_at - created_at))) BETWEEN 19500 AND 20100 
    THEN 'UTC_OFFSET (~5:30 gap)'
    WHEN ABS(EXTRACT(EPOCH FROM (updated_at - created_at))) < 600 
    THEN 'IST_CONSISTENT (<10min gap)'
    ELSE 'NORMAL (updated much later)'
  END as category,
  count(*) as row_count
FROM homestay_applications 
WHERE updated_at IS NOT NULL AND updated_at != created_at
GROUP BY 1
ORDER BY 2 DESC;

-- 5. Check submitted_at vs created_at (submitted_at is set by Drizzle)
\echo ''
\echo '── 5. submitted_at vs created_at Gap (should be small if both IST) ──'
SELECT 
  id,
  to_char(created_at, 'HH24:MI:SS') as created,
  to_char(submitted_at, 'HH24:MI:SS') as submitted,
  to_char(submitted_at - created_at, 'HH24:MI:SS') as gap,
  CASE 
    WHEN submitted_at < created_at AND ABS(EXTRACT(EPOCH FROM (created_at - submitted_at))) BETWEEN 19500 AND 20100
    THEN '⚠️ submitted_at IS UTC'
    ELSE '✅ OK'
  END as verdict  
FROM homestay_applications 
WHERE submitted_at IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- 6. Check other date fields that Drizzle writes
\echo ''
\echo '── 6. date fields set by Drizzle code (spot check) ──'
SELECT 
  id,
  to_char(da_review_date, 'YYYY-MM-DD HH24:MI') as da_review,
  to_char(district_review_date, 'YYYY-MM-DD HH24:MI') as district_review,
  to_char(site_inspection_completed_date, 'YYYY-MM-DD HH24:MI') as inspection_done,
  to_char(certificate_issued_date, 'YYYY-MM-DD HH24:MI') as cert_issued,
  to_char(approved_at, 'YYYY-MM-DD HH24:MI') as approved
FROM homestay_applications 
WHERE da_review_date IS NOT NULL OR approved_at IS NOT NULL
ORDER BY COALESCE(approved_at, da_review_date) DESC
LIMIT 10;

-- 7. Users table check
\echo ''
\echo '── 7. Users: created_at vs updated_at ──'
SELECT 
  id,
  to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
  to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated,
  CASE 
    WHEN ABS(EXTRACT(EPOCH FROM (updated_at - created_at))) BETWEEN 19500 AND 20100 
    THEN '⚠️ LIKELY UTC'
    ELSE '✅ OK'
  END as verdict
FROM users 
WHERE updated_at != created_at
ORDER BY created_at DESC
LIMIT 5;

-- 8. Application actions (created_at only, set by Drizzle)
\echo ''
\echo '── 8. Application Actions: Spot Check ──'
SELECT 
  aa.action,
  to_char(aa.created_at, 'YYYY-MM-DD HH24:MI:SS') as action_time,
  to_char(ha.created_at, 'YYYY-MM-DD HH24:MI:SS') as app_created
FROM application_actions aa
JOIN homestay_applications ha ON aa.application_id = ha.id
ORDER BY aa.created_at DESC
LIMIT 5;

-- 9. HimKosh transactions
\echo ''
\echo '── 9. HimKosh Transactions: Spot Check ──'
SELECT 
  id,
  to_char(initiated_at, 'YYYY-MM-DD HH24:MI:SS') as initiated,
  to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created,
  to_char(verified_at, 'YYYY-MM-DD HH24:MI:SS') as verified
FROM himkosh_transactions 
ORDER BY created_at DESC
LIMIT 5;

\echo ''
\echo '═══════════════════════════════════════════════════════'
\echo ' DONE. Copy-paste this entire output back.'
\echo '═══════════════════════════════════════════════════════'

EOSQL
