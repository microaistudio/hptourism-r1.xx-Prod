#!/bin/bash

echo "============================================="
echo "   HP TOURISM PROD ENVIRONMENT CHECK v1.0   "
echo "============================================="
echo "Hostname: $(hostname)"
echo "Date: $(date)"
echo "User: $(whoami)"
echo "---------------------------------------------"

echo ""
echo "[1] Checking Active Ports (Should be 5050 for PROD)"
echo "-------------------------------------------------"
netstat -tulpn | grep -E '5050|5060' || echo "❌ No process listening on 5050 or 5060"

echo ""
echo "[2] Checking PM2 Process List"
echo "-----------------------------"
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo "❌ PM2 command not found"
fi

echo ""
echo "[3] Checking Nginx Status"
echo "-------------------------"
systemctl is-active nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx is Active"
else
    echo "❌ Nginx is NOT Active"
fi

echo ""
echo "[4] Checking Ecosystem Config (If Present)"
echo "------------------------------------------"
CONFIG_FILE="/opt/hptourism/homestay/ecosystem.config.cjs"
if [ -f "$CONFIG_FILE" ]; then
    echo "Found config at: $CONFIG_FILE"
    grep -E "name:|PORT:|DATABASE_URL" "$CONFIG_FILE"
else
    echo "ℹ️  ecosystem.config.cjs not found in standard path"
fi

echo ""
echo "============================================="
echo "   CHECK COMPLETE - COPY OUTPUT TO SUPPORT   "
echo "============================================="
