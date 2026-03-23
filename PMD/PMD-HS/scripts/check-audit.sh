#!/bin/bash
# PROD Application Audit Trail Checker
# Usage: Run this script directly on the PROD server to view the exact history of an application.
# Run as root or hptourism: sudo -u hptourism bash check-audit.sh

APP_NUMBER="HP-HS-2026-SOL-000253"
DB_URL=$(grep 'DATABASE_URL' /opt/hptourism/homestay/.env | cut -d '=' -f2)

echo "================================================================="
echo " AUDIT TRAIL FOR APPLICATION: $APP_NUMBER"
echo "================================================================="
echo ""

# 1. Check current status and basic details
echo ">>> CURRENT STATUS & DETAILS <<<"
psql $DB_URL -c "
SELECT 
    id, 
    status,
    created_at AT TIME ZONE 'Asia/Kolkata' as created_at,
    updated_at AT TIME ZONE 'Asia/Kolkata' as updated_at,
    da_id,
    dtdo_id
FROM homestay_applications 
WHERE application_number = '$APP_NUMBER';
"

echo ""
echo ">>> FULL AUDIT TRAIL LOGS <<<"
echo "This shows every single action taken on this application, when it happened, and by whom."
# 2. Get the full history of actions
psql $DB_URL -c "
SELECT 
    aa.created_at AT TIME ZONE 'Asia/Kolkata' as timestamp,
    aa.action as performed_action,
    u.role as actor_role,
    u.full_name as actor_name,
    SUBSTRING(aa.feedback, 1, 50) as feedback_preview
FROM application_actions aa
JOIN homestay_applications ha ON aa.application_id = ha.id
LEFT JOIN users u ON aa.actor_id = u.id
WHERE ha.application_number = '$APP_NUMBER'
ORDER BY aa.created_at DESC;
"

echo "================================================================="
echo "If you see a 'correction_resubmitted' action immediately followed by an 'approved' status "
echo "WITHOUT a DTDO action in between, we will need to check the code logic for the resubmit handler."
