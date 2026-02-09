#!/bin/bash

echo "=========================================="
echo "   HP TOURISM PROD RESTORATION SCRIPT     "
echo "=========================================="

# 1. Stop conflicting processes
echo "[1] Cleaning up PM2 processes..."
pm2 delete hptourism-rc8 2>/dev/null
pm2 delete hptourism-prod 2>/dev/null

# 2. Fix Configuration (Force Name=hptourism-prod, Port=5050)
echo "[2] Updating ecosystem.config.cjs..."
CONFIG_FILE="/opt/hptourism/homestay/ecosystem.config.cjs"

# Backup first
cp "$CONFIG_FILE" "${CONFIG_FILE}.bak"

# Use sed to enforce production values
# Update Name
sed -i 's/name: "hptourism-rc8"/name: "hptourism-prod"/' "$CONFIG_FILE"
# Update Port (Ensure it asks for 5050)
sed -i 's/PORT: "5060"/PORT: "5050"/' "$CONFIG_FILE"

echo "✅ Configuration updated."

# 3. Start the Application
echo "[3] Starting Application as 'hptourism-prod'..."
cd /opt/hptourism/homestay
pm2 start ecosystem.config.cjs
pm2 save

# 4. Verification
echo "[4] verifying Connectivity..."
sleep 5
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1:5050)

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "302" ]; then
    echo "✅ SUCCESS: App is responding on Port 5050 (HTTP $HTTP_CODE)"
    echo "🚀 The site should be LIVE."
else
    echo "⚠️  WARNING: App responded with HTTP $HTTP_CODE"
    echo "Check if the application is starting correctly using: pm2 logs hptourism-prod"
fi
