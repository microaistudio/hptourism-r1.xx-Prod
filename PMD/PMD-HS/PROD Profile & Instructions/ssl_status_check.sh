#!/bin/bash
# ============================================================
# HP Tourism PROD - SSL Status Check Script
# ============================================================
# Run this script on the PROD server (homstyshmapp) to get
# complete SSL configuration status
# 
# Usage: bash ssl_status_check.sh > ssl_report.txt
# ============================================================

echo "============================================================"
echo "HP Tourism Homestay Portal - SSL Status Report"
echo "Server: $(hostname)"
echo "Date: $(date)"
echo "============================================================"
echo ""

# 1. Check Nginx SSL Configuration
echo "=== 1. NGINX SSL CONFIGURATION ==="
echo ""
if [ -f /etc/nginx/sites-enabled/homestay.hp.gov.in ] || [ -f /etc/nginx/sites-enabled/default ]; then
    echo "--- Nginx SSL Config (sites-enabled) ---"
    grep -r "ssl_certificate\|listen 443\|server_name\|proxy_pass" /etc/nginx/sites-enabled/ 2>/dev/null
    echo ""
else
    echo "Checking /etc/nginx/conf.d/..."
    grep -r "ssl_certificate\|listen 443\|server_name\|proxy_pass" /etc/nginx/conf.d/ 2>/dev/null
fi
echo ""

# 2. Check SSL Certificate Files
echo "=== 2. SSL CERTIFICATE FILES ==="
echo ""
echo "Looking for certificate files..."

# Common SSL cert locations
CERT_LOCATIONS=(
    "/etc/ssl/certs"
    "/etc/nginx/ssl"
    "/etc/letsencrypt/live"
    "/etc/pki/tls/certs"
    "/opt/hptourism/ssl"
)

for loc in "${CERT_LOCATIONS[@]}"; do
    if [ -d "$loc" ]; then
        echo "--- $loc ---"
        ls -la "$loc" 2>/dev/null | grep -E "\.crt|\.pem|\.key|homestay" | head -10
        echo ""
    fi
done

# 3. Check Certificate Details
echo "=== 3. CERTIFICATE DETAILS (if accessible) ==="
echo ""
# Try to find the actual cert file from nginx config
CERT_FILE=$(grep -r "ssl_certificate " /etc/nginx/ 2>/dev/null | grep -v "#" | head -1 | awk '{print $2}' | tr -d ';')
if [ -n "$CERT_FILE" ] && [ -f "$CERT_FILE" ]; then
    echo "Certificate file: $CERT_FILE"
    echo ""
    echo "--- Certificate Info ---"
    openssl x509 -in "$CERT_FILE" -noout -subject -issuer -dates 2>/dev/null
    echo ""
    echo "--- Certificate Chain ---"
    openssl x509 -in "$CERT_FILE" -noout -text 2>/dev/null | grep -A2 "Issuer:\|Validity\|Subject:"
else
    echo "Could not find certificate file. Checking via HTTPS..."
    echo "--- Live Certificate (from curl) ---"
    echo | openssl s_client -connect homestay.hp.gov.in:443 -servername homestay.hp.gov.in 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null
fi
echo ""

# 4. Check Nginx Status
echo "=== 4. NGINX STATUS ==="
echo ""
echo "Nginx version:"
nginx -v 2>&1
echo ""
echo "Nginx configuration test:"
nginx -t 2>&1
echo ""
echo "Nginx service status:"
systemctl status nginx 2>/dev/null | head -10 || service nginx status 2>/dev/null | head -5
echo ""

# 5. Check Listening Ports
echo "=== 5. LISTENING PORTS ==="
echo ""
echo "Ports 80, 443, 5000:"
ss -tlnp 2>/dev/null | grep -E ":80|:443|:5000" || netstat -tlnp 2>/dev/null | grep -E ":80|:443|:5000"
echo ""

# 6. Check if HP NIC Managed
echo "=== 6. SSL MANAGEMENT TYPE ==="
echo ""
if [ -d "/etc/letsencrypt" ] && [ -f "/etc/letsencrypt/live/homestay.hp.gov.in/fullchain.pem" ]; then
    echo "SSL Type: Let's Encrypt (Certbot managed)"
    echo "Auto-renewal status:"
    certbot certificates 2>/dev/null | grep -A5 "homestay"
else
    echo "SSL Type: Likely HP NIC / Government SSL (manually managed)"
    echo "Certificate is probably issued by HP NIC or a government CA"
fi
echo ""

# 7. Full Nginx Config for homestay
echo "=== 7. FULL NGINX CONFIG FOR HOMESTAY ==="
echo ""
if [ -f /etc/nginx/sites-enabled/homestay.hp.gov.in ]; then
    cat /etc/nginx/sites-enabled/homestay.hp.gov.in
elif [ -f /etc/nginx/sites-enabled/default ]; then
    cat /etc/nginx/sites-enabled/default | head -100
else
    echo "Checking conf.d..."
    cat /etc/nginx/conf.d/*.conf 2>/dev/null | head -100
fi
echo ""

echo "============================================================"
echo "END OF SSL STATUS REPORT"
echo "============================================================"
