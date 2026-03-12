#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# PROD DIAGNOSTIC SCRIPT 1/4: System & Environment
# Run on PROD server as the app user
# ═══════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════"
echo " SCRIPT 1: System & Environment Intelligence"
echo " Date: $(date)"
echo "═══════════════════════════════════════════════════════"

echo ""
echo "── 1. OS Timezone ──"
timedatectl 2>/dev/null | grep -E "Time zone|Local time" || echo "timedatectl not available"
echo "  /etc/localtime → $(readlink -f /etc/localtime 2>/dev/null || echo 'unknown')"
echo "  TZ env var: ${TZ:-'(not set)'}"

echo ""
echo "── 2. Node.js Timezone ──"
node -e "console.log('  TZ:', process.env.TZ || '(not set)');
console.log('  PGTZ:', process.env.PGTZ || '(not set)');
console.log('  new Date():', new Date().toString());
console.log('  toISOString():', new Date().toISOString());
console.log('  Intl timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);" 2>/dev/null || echo "Node.js not in PATH"

echo ""
echo "── 3. PM2 Process Environment ──"
PM2_PROC=$(pm2 jlist 2>/dev/null | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
try{const p=JSON.parse(d);
p.forEach(a=>{
  console.log('  Process:', a.name, '| PID:', a.pid, '| Status:', a.pm2_env?.status);
  console.log('    TZ:', a.pm2_env?.env?.TZ || a.pm2_env?.TZ || '(not set)');
  console.log('    PGTZ:', a.pm2_env?.env?.PGTZ || a.pm2_env?.PGTZ || '(not set)');
  console.log('    PORT:', a.pm2_env?.env?.PORT || a.pm2_env?.PORT || '(not set)');
  console.log('    NODE_ENV:', a.pm2_env?.env?.NODE_ENV || a.pm2_env?.NODE_ENV || '(not set)');
});}catch(e){console.log('  Could not parse PM2 data:', e.message);}" 2>/dev/null)
echo "$PM2_PROC"

echo ""
echo "── 4. .env File TZ Settings ──"
APP_DIR=$(pm2 jlist 2>/dev/null | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
try{const p=JSON.parse(d);console.log(p[0]?.pm2_env?.pm_cwd||'/opt/hptourism/homestay');}catch(e){console.log('/opt/hptourism/homestay');}" 2>/dev/null)
echo "  App directory: $APP_DIR"
if [ -f "$APP_DIR/.env" ]; then
  echo "  .env exists ✅"
  grep -E "^(TZ|PGTZ|DATABASE_URL)" "$APP_DIR/.env" 2>/dev/null | sed 's/DATABASE_URL=.*/DATABASE_URL=***REDACTED***/'
else
  echo "  .env NOT FOUND ⚠️"
fi

echo ""
echo "── 5. ecosystem.config.cjs Check ──"
if [ -f "$APP_DIR/ecosystem.config.cjs" ]; then
  echo "  ecosystem.config.cjs exists ✅"
  grep -A2 "TZ\|PGTZ" "$APP_DIR/ecosystem.config.cjs" 2>/dev/null || echo "  No TZ/PGTZ found in ecosystem config ⚠️"
elif [ -f "$APP_DIR/ecosystem.prod.cjs" ]; then
  echo "  ecosystem.prod.cjs exists ✅"
  grep -A2 "TZ\|PGTZ" "$APP_DIR/ecosystem.prod.cjs" 2>/dev/null || echo "  No TZ/PGTZ found in ecosystem config ⚠️"
else
  echo "  No ecosystem config found ⚠️"
fi

echo ""
echo "── 6. PostgreSQL Timezone ──"
sudo -u postgres psql -t -c "SHOW timezone;" 2>/dev/null || echo "  Cannot connect to PostgreSQL (try running as postgres user)"

echo ""
echo "── 7. Drizzle Patch Status ──"
TIMESTAMP_JS="$APP_DIR/node_modules/drizzle-orm/pg-core/columns/timestamp.js"
if [ -f "$TIMESTAMP_JS" ]; then
  echo "  timestamp.js exists ✅"
  echo "  READ patch (+0530):"
  grep -n "+0530\|+0000" "$TIMESTAMP_JS" | head -5
  echo "  WRITE patch (istMs):"
  grep -n "istMs\|toISOString" "$TIMESTAMP_JS" | head -5
else
  echo "  timestamp.js NOT FOUND ⚠️"
fi

echo ""
echo "── 8. App Version ──"
if [ -f "$APP_DIR/package.json" ]; then
  node -e "const p=require('$APP_DIR/package.json');console.log('  Version:', p.version);console.log('  Has postinstall:', !!p.scripts?.postinstall);" 2>/dev/null
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo " DONE. Copy-paste this entire output back."
echo "═══════════════════════════════════════════════════════"
