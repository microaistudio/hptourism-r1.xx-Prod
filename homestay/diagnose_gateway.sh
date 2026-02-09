#!/bin/bash
echo "=== GATEWAY DIAGNOSIS ==="
echo "Time: $(date)"

echo ""
echo "[1] Checking Nginx Proxy Destination"
echo "------------------------------------"
# Find where Nginx is sending traffic (Should be 127.0.0.1:5050)
grep -r "proxy_pass" /etc/nginx/sites-enabled/ || echo "❌ No proxy_pass found in sites-enabled"

echo ""
echo "[2] Nginx Error Logs (Last 10 failures)"
echo "---------------------------------------"
# Look for 'connection refused', 'permission denied', or 'upstream' errors
tail -n 20 /var/log/nginx/error.log | grep -E "error|warn|crit|emerg"

echo ""
echo "[3] Curl Local Nginx (Bypass External FW)"
echo "-----------------------------------------"
# See if Nginx itself gives 403 when accessed locally
curl -I -k https://localhost/

echo ""
echo "[4] Check SELinux Status"
echo "------------------------"
if command -v getenforce &> /dev/null; then
    getenforce
else
    echo "SELinux command not found (Likely disabled)"
fi
