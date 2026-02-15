#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# ROLLBACK SCRIPT — Reverse v1.1.6 Data Migration
# 
# Use this ONLY if the data migration went wrong.
# This reverses the +5:30 shift by subtracting 5:30 from the same columns.
#
# USAGE:  sudo -u postgres bash rollback-1.1.6.sh
# ═══════════════════════════════════════════════════════════════════════

DB_NAME="${1:-hptourism}"

echo "═══════════════════════════════════════════════════════"
echo " ROLLBACK: Reversing v1.1.6 Data Migration"
echo " Database: $DB_NAME"
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"
echo ""
echo " ⚠️  This will SUBTRACT 5:30 from all migrated columns."
echo " ⚠️  Only run this if the migration was applied incorrectly."
echo ""
read -p "  Type 'ROLLBACK' to confirm: " CONFIRM

if [ "$CONFIRM" != "ROLLBACK" ]; then
  echo "  Aborted."
  exit 1
fi

sudo -u postgres psql -d "$DB_NAME" <<'EOSQL'

BEGIN;

\echo '── Rolling back: homestay_applications ──'

UPDATE homestay_applications SET updated_at = updated_at - interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;

UPDATE homestay_applications SET submitted_at = submitted_at - interval '5 hours 30 minutes'
WHERE submitted_at IS NOT NULL AND submitted_at != created_at;

UPDATE homestay_applications SET da_review_date = da_review_date - interval '5 hours 30 minutes'
WHERE da_review_date IS NOT NULL;

UPDATE homestay_applications SET da_forwarded_date = da_forwarded_date - interval '5 hours 30 minutes'
WHERE da_forwarded_date IS NOT NULL;

UPDATE homestay_applications SET dtdo_review_date = dtdo_review_date - interval '5 hours 30 minutes'
WHERE dtdo_review_date IS NOT NULL;

UPDATE homestay_applications SET district_review_date = district_review_date - interval '5 hours 30 minutes'
WHERE district_review_date IS NOT NULL;

UPDATE homestay_applications SET state_review_date = state_review_date - interval '5 hours 30 minutes'
WHERE state_review_date IS NOT NULL;

UPDATE homestay_applications SET site_inspection_scheduled_date = site_inspection_scheduled_date - interval '5 hours 30 minutes'
WHERE site_inspection_scheduled_date IS NOT NULL;

UPDATE homestay_applications SET site_inspection_completed_date = site_inspection_completed_date - interval '5 hours 30 minutes'
WHERE site_inspection_completed_date IS NOT NULL;

UPDATE homestay_applications SET certificate_issued_date = certificate_issued_date - interval '5 hours 30 minutes'
WHERE certificate_issued_date IS NOT NULL;

UPDATE homestay_applications SET certificate_expiry_date = certificate_expiry_date - interval '5 hours 30 minutes'
WHERE certificate_expiry_date IS NOT NULL;

UPDATE homestay_applications SET approved_at = approved_at - interval '5 hours 30 minutes'
WHERE approved_at IS NOT NULL;

UPDATE homestay_applications SET payment_date = payment_date - interval '5 hours 30 minutes'
WHERE payment_date IS NOT NULL;

UPDATE homestay_applications SET refund_date = refund_date - interval '5 hours 30 minutes'
WHERE refund_date IS NOT NULL;

UPDATE homestay_applications SET last_read_by_owner = last_read_by_owner - interval '5 hours 30 minutes'
WHERE last_read_by_owner IS NOT NULL;

\echo '  ✅ homestay_applications rolled back'

\echo '── Rolling back: users ──'
UPDATE users SET updated_at = updated_at - interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ users rolled back'

\echo '── Rolling back: inspection_orders ──'
UPDATE inspection_orders SET updated_at = updated_at - interval '5 hours 30 minutes'
WHERE updated_at IS NOT NULL AND updated_at != created_at;
\echo '  ✅ inspection_orders rolled back'

\echo '── Rolling back: notifications ──'
UPDATE notifications SET read_at = read_at - interval '5 hours 30 minutes'
WHERE read_at IS NOT NULL;
\echo '  ✅ notifications rolled back'

\echo '── Rolling back: grievances ──'
UPDATE grievances SET
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at
    THEN updated_at - interval '5 hours 30 minutes' ELSE updated_at END,
  resolved_at = CASE WHEN resolved_at IS NOT NULL
    THEN resolved_at - interval '5 hours 30 minutes' ELSE resolved_at END,
  last_comment_at = CASE WHEN last_comment_at IS NOT NULL
    THEN last_comment_at - interval '5 hours 30 minutes' ELSE last_comment_at END,
  last_read_by_owner = CASE WHEN last_read_by_owner IS NOT NULL
    THEN last_read_by_owner - interval '5 hours 30 minutes' ELSE last_read_by_owner END,
  last_read_by_officer = CASE WHEN last_read_by_officer IS NOT NULL
    THEN last_read_by_officer - interval '5 hours 30 minutes' ELSE last_read_by_officer END
WHERE updated_at != created_at
   OR resolved_at IS NOT NULL
   OR last_comment_at IS NOT NULL
   OR last_read_by_owner IS NOT NULL
   OR last_read_by_officer IS NOT NULL;
\echo '  ✅ grievances rolled back'

\echo '── Rolling back: himkosh_transactions ──'
UPDATE himkosh_transactions SET
  updated_at = CASE WHEN updated_at IS NOT NULL AND updated_at != created_at
    THEN updated_at - interval '5 hours 30 minutes' ELSE updated_at END,
  verified_at = CASE WHEN verified_at IS NOT NULL
    THEN verified_at - interval '5 hours 30 minutes' ELSE verified_at END
WHERE updated_at != created_at
   OR verified_at IS NOT NULL;
\echo '  ✅ himkosh_transactions rolled back'

COMMIT;

\echo ''
\echo '══════════════════════════════════════════════════════════'
\echo ' ROLLBACK COMPLETE. Data migration has been reversed.'
\echo '══════════════════════════════════════════════════════════'

EOSQL

echo ""
echo "  Also revert the Drizzle code patch:"
echo "  sed -i 's/+0530/+0000/g' /opt/hptourism/homestay/node_modules/drizzle-orm/pg-core/columns/timestamp.js"
echo "  pm2 restart hptourism-prod"
