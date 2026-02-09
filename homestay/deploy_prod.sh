#!/bin/bash
set -e

echo "========================================"
echo "   HP TOURISM PROD DEPLOYMENT v1.0.5    "
echo "========================================"

# 1. Deployment Variables
APP_DIR="/opt/hptourism/homestay"
BACKUP_DIR="/opt/backup/homestay"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 2. Cleanup Old Processes
echo "[1] Stopping legacy processes..."
pm2 delete hptourism-rc8 2>/dev/null || true
pm2 delete hptourism-dev 2>/dev/null || true
pm2 delete hptourism-prod 2>/dev/null || true

# 3. Extract & Setup
echo "[2] Setting up application in $APP_DIR..."
# Assumption: This script is run *after* extracting the tarball
cd "$APP_DIR"

# 4. Enforce PROD Configuration
echo "[3] Enforcing PROD Configuration..."
CONFIG_FILE="ecosystem.config.cjs"

# Backup original config
cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"

# Force Name = hptourism-prod
sed -i 's/name: "hptourism-dev"/name: "hptourism-prod"/' "$CONFIG_FILE"
sed -i 's/name: "hptourism-rc8"/name: "hptourism-prod"/' "$CONFIG_FILE"

# Force Port = 5050
sed -i 's/PORT: "5060"/PORT: "5050"/' "$CONFIG_FILE"

echo "✅ Config updated: hptourism-prod (Port 5050)"

# 5. Start Application
echo "[4] Starting Application..."
# Ensure DATABASE_URL is available
if [ -f ".env" ]; then
    echo "Loading .env..."
    # Safer parsing: Ignore comments (#) and empty lines
    export $(grep -v '^#' .env | xargs)
fi

pm2 start "$CONFIG_FILE"
pm2 save

# 6. Verify
echo "[5] Verifying Deployment..."
sleep 5
pm2 list
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1:5050)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "302" ] || [ "$HTTP_CODE" == "405" ]; then
    echo "✅ SUCCESS: Application is running on Port 5050!"
else
    echo "⚠️  WARNING: Application check returned HTTP $HTTP_CODE"
    echo "Check logs: pm2 logs hptourism-prod"
fi

echo "========================================"
echo "   DEPLOYMENT COMPLETE"
echo "========================================"
