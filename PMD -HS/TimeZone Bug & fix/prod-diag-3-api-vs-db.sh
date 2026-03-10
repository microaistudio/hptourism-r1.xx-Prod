#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# PROD DIAGNOSTIC SCRIPT 3/4: Live API vs Raw DB Comparison
# Run on PROD server. Tests API output vs actual DB values.
# ═══════════════════════════════════════════════════════════════

APP_PORT="${1:-5055}"
echo "═══════════════════════════════════════════════════════"
echo " SCRIPT 3: Live API vs Raw DB Comparison"
echo " Testing against localhost:$APP_PORT"
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"

echo ""
echo "── 1. API Health Check ──"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT/")
echo "  HTTP Status: $HTTP_CODE"

echo ""
echo "── 2. Server-reported time ──"
curl -s "http://localhost:$APP_PORT/api/verify-session-status" 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "  Could not reach API"

echo ""
echo "── 3. Pick a recent application and compare API vs DB ──"

# Get the most recent app ID from DB
RECENT_APP_ID=$(sudo -u postgres psql -d "${2:-hptourism}" -t -c "
  SELECT id FROM homestay_applications WHERE submitted_at IS NOT NULL ORDER BY created_at DESC LIMIT 1;
" 2>/dev/null | tr -d ' ')

if [ -z "$RECENT_APP_ID" ]; then
  echo "  Could not get app ID from DB"
  exit 1
fi

echo "  App ID: $RECENT_APP_ID"
echo ""
echo "  Raw DB values:"
sudo -u postgres psql -d "${2:-hptourism}" -c "
  SELECT 
    to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at_raw,
    to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at_raw,
    to_char(submitted_at, 'YYYY-MM-DD HH24:MI:SS') as submitted_at_raw
  FROM homestay_applications 
  WHERE id = '$RECENT_APP_ID';
"

echo ""
echo "── 4. What does JavaScript toISOString() do right now? ──"
node -e "
const d = new Date();
console.log('  Current time:');
console.log('    toString():', d.toString());
console.log('    toISOString():', d.toISOString());
console.log('');  
console.log('  If toISOString gives 20:XX and toString gives 01:XX,');
console.log('  then Drizzle writes UTC while Postgres now() writes IST.');
"

echo ""
echo "═══════════════════════════════════════════════════════"
echo " DONE. Copy-paste this entire output back."
echo "═══════════════════════════════════════════════════════"
