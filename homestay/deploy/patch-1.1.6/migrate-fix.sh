#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# v1.1.6 Data Migration - FIXED (removed non-existent columns)
# Run on PROD server as root
# ═══════════════════════════════════════════════════════════════════════

DB_NAME="${1:-hptourism}"

echo "═══════════════════════════════════════════════════════"
echo " v1.1.6 Data Migration (Fixed)"
echo " Database: $DB_NAME"
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Backup already exists from earlier run."
echo "  This script shifts UTC timestamps +5:30 to IST."
echo ""

# ── DRY RUN ──────────────────────────────────────────────────────────
echo "── DRY RUN (no changes) ──"
sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

\echo ''
\echo '── Rows to fix in homestay_applications ──'
SELECT 
  'updated_at' as col, count(*) FILTER (WHERE updated_at IS NOT NULL AND updated_at != created_at) as needs_fix
FROM homestay_applications
UNION ALL SELECT 'submitted_at', count(*) FILTER (WHERE submitted_at IS NOT NULL AND submitted_at != created_at) FROM homestay_applications
UNION ALL SELECT 'da_review_date', count(*) FILTER (WHERE da_review_date IS NOT NULL) FROM homestay_applications
UNION ALL SELECT 'da_forwarded_date', count(*) FILTER (WHERE da_forwarded_date IS NOT NULL) FROM homestay_applications
UNION ALL SELECT 'dtdo_review_date', count(*) FILTER (WHERE dtdo_review_date IS NOT NULL) FROM homestay_applications
UNION ALL SELECT 'certificate_issued_date', count(*) FILTER (WHERE certificate_issued_date IS NOT NULL) FROM homestay_applications
UNION ALL SELECT 'payment_date', count(*) FILTER (WHERE payment_date IS NOT NULL) FROM homestay_applications;

\echo ''
\echo '── Sample: homestay_applications before/after ──'
SELECT 
  id,
  to_char(created_at, 'DD Mon HH24:MI') as created,
  to_char(updated_at, 'DD Mon HH24:MI') as updated_now,
  to_char(updated_at + interval '5 hours 30 minutes', 'DD Mon HH24:MI') as updated_after
FROM homestay_applications
WHERE updated_at IS NOT NULL AND updated_at != created_at
ORDER BY created_at DESC LIMIT 5;

\echo ''
\echo '── Users to fix ──'
SELECT count(*) FILTER (WHERE updated_at != created_at) as needs_fix FROM users;

\echo ''
\echo '── Grievances to fix ──'
SELECT count(*) FILTER (WHERE updated_at != created_at) as needs_fix FROM grievances;

\echo ''
\echo '── Himkosh to fix ──'
SELECT
  count(*) FILTER (WHERE updated_at != created_at) as updated,
  count(*) FILTER (WHERE verified_at IS NOT NULL) as verified
FROM himkosh_transactions;

\echo ''
\echo 'DRY RUN DONE — nothing changed.'

EOSQL

echo ""
read -p "  Review above. Press ENTER to EXECUTE migration, or Ctrl+C to abort... "

# ── EXECUTE ──────────────────────────────────────────────────────────
echo ""
echo "── EXECUTING MIGRATION ──"

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

BEGIN;

\echo '── homestay_applications ──'

UPDATE homestay_applications
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;

UPDATE homestay_applications
SET submitted_at = submitted_at + interval '5 hours 30 minutes'
WHERE submitted_at IS NOT NULL AND submitted_at != created_at;

UPDATE homestay_applications
SET da_review_date = da_review_date + interval '5 hours 30 minutes'
WHERE da_review_date IS NOT NULL;

UPDATE homestay_applications
SET da_forwarded_date = da_forwarded_date + interval '5 hours 30 minutes'
WHERE da_forwarded_date IS NOT NULL;

UPDATE homestay_applications
SET dtdo_review_date = dtdo_review_date + interval '5 hours 30 minutes'
WHERE dtdo_review_date IS NOT NULL;

UPDATE homestay_applications
SET district_review_date = district_review_date + interval '5 hours 30 minutes'
WHERE district_review_date IS NOT NULL;

UPDATE homestay_applications
SET state_review_date = state_review_date + interval '5 hours 30 minutes'
WHERE state_review_date IS NOT NULL;

UPDATE homestay_applications
SET site_inspection_scheduled_date = site_inspection_scheduled_date + interval '5 hours 30 minutes'
WHERE site_inspection_scheduled_date IS NOT NULL;

UPDATE homestay_applications
SET site_inspection_completed_date = site_inspection_completed_date + interval '5 hours 30 minutes'
WHERE site_inspection_completed_date IS NOT NULL;

UPDATE homestay_applications
SET certificate_issued_date = certificate_issued_date + interval '5 hours 30 minutes'
WHERE certificate_issued_date IS NOT NULL;

UPDATE homestay_applications
SET certificate_expiry_date = certificate_expiry_date + interval '5 hours 30 minutes'
WHERE certificate_expiry_date IS NOT NULL;

UPDATE homestay_applications
SET approved_at = approved_at + interval '5 hours 30 minutes'
WHERE approved_at IS NOT NULL;

UPDATE homestay_applications
SET payment_date = payment_date + interval '5 hours 30 minutes'
WHERE payment_date IS NOT NULL;

UPDATE homestay_applications
SET refund_date = refund_date + interval '5 hours 30 minutes'
WHERE refund_date IS NOT NULL;

\echo '  ✅ homestay_applications done'

\echo '── users ──'
UPDATE users
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ users done'

\echo '── inspection_orders ──'
UPDATE inspection_orders
SET updated_at = updated_at + interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ inspection_orders done'

\echo '── notifications ──'
UPDATE notifications
SET read_at = read_at + interval '5 hours 30 minutes'
WHERE read_at IS NOT NULL;
\echo '  ✅ notifications done'

\echo '── grievances ──'
UPDATE grievances
SET 
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at 
    THEN updated_at + interval '5 hours 30 minutes' ELSE updated_at END,
  resolved_at = CASE WHEN resolved_at IS NOT NULL 
    THEN resolved_at + interval '5 hours 30 minutes' ELSE resolved_at END,
  last_comment_at = CASE WHEN last_comment_at IS NOT NULL 
    THEN last_comment_at + interval '5 hours 30 minutes' ELSE last_comment_at END
WHERE updated_at != created_at 
   OR resolved_at IS NOT NULL 
   OR last_comment_at IS NOT NULL;
\echo '  ✅ grievances done'

\echo '── himkosh_transactions ──'
UPDATE himkosh_transactions
SET
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at
    THEN updated_at + interval '5 hours 30 minutes' ELSE updated_at END,
  verified_at = CASE WHEN verified_at IS NOT NULL
    THEN verified_at + interval '5 hours 30 minutes' ELSE verified_at END
WHERE updated_at != created_at
   OR verified_at IS NOT NULL;
\echo '  ✅ himkosh_transactions done'

COMMIT;

\echo ''
\echo '══════════════════════════════════════════════════════'
\echo ' ✅ MIGRATION COMPLETE'
\echo '══════════════════════════════════════════════════════'

-- Verification
\echo ''
\echo '── Verification: updated_at should now be AFTER created_at ──'
SELECT 
  to_char(created_at, 'DD Mon HH24:MI') as created,
  to_char(updated_at, 'DD Mon HH24:MI') as updated,
  CASE WHEN updated_at >= created_at THEN '✅ OK' ELSE '⚠️ CHECK' END as status
FROM homestay_applications
WHERE updated_at IS NOT NULL AND updated_at != created_at
ORDER BY created_at DESC
LIMIT 10;

EOSQL

echo ""
echo "═══════════════════════════════════════════════════════"
echo " DONE! Migration applied and verified."
echo "═══════════════════════════════════════════════════════"
