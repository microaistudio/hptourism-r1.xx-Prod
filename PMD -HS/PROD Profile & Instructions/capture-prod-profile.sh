#!/bin/bash
################################################################################
# HP Tourism — PROD Profile Capture Script
#
# Run this ON THE PROD SERVER to capture the complete environment profile.
# Output: prod_profile_<timestamp>.txt
#
# Usage:  bash capture-prod-profile.sh
#         bash capture-prod-profile.sh /opt/hptourism/homestay
################################################################################

set -euo pipefail

INSTALL_PATH="${1:-/opt/hptourism/homestay}"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
OUTPUT="prod_profile_${TIMESTAMP}.txt"

echo "╔══════════════════════════════════════════════════════╗"
echo "║   HP TOURISM — PROD PROFILE CAPTURE                  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

{
echo "============================================"
echo "PROD PROFILE CAPTURE — $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "============================================"
echo ""

# ── Server Info ──────────────────────────────────────────
echo "=== SERVER INFO ==="
echo "Hostname      : $(hostname)"
echo "IP Addresses  : $(hostname -I 2>/dev/null || echo 'N/A')"
echo "OS            : $(cat /etc/os-release 2>/dev/null | grep PRETTY_NAME | cut -d= -f2 | tr -d '"')"
echo "Kernel        : $(uname -r)"
echo "Uptime        : $(uptime -p 2>/dev/null || uptime)"
echo "RAM           : $(free -h | awk '/^Mem:/{print $2}') total, $(free -h | awk '/^Mem:/{print $3}') used"
echo "Disk          : $(df -h / | awk 'NR==2{print $2}') total, $(df -h / | awk 'NR==2{print $3}') used, $(df -h / | awk 'NR==2{print $4}') free"
echo ""

# ── Node / PM2 ───────────────────────────────────────────
echo "=== NODE / PM2 ==="
echo "Node Version  : $(node -v 2>/dev/null || echo 'NOT INSTALLED')"
echo "NPM Version   : $(npm -v 2>/dev/null || echo 'NOT INSTALLED')"
echo "PM2 Version   : $(pm2 -v 2>/dev/null || echo 'NOT INSTALLED')"
echo ""

# ── PM2 Process Info ─────────────────────────────────────
echo "=== PM2 PROCESSES ==="
pm2 jlist 2>/dev/null | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  d.forEach(p => {
    console.log('  Name      : ' + p.name);
    console.log('  PID       : ' + p.pid);
    console.log('  Status    : ' + p.pm2_env.status);
    console.log('  Port      : ' + (p.pm2_env.PORT || p.pm2_env.env?.PORT || 'N/A'));
    console.log('  CWD       : ' + p.pm2_env.pm_cwd);
    console.log('  Script    : ' + p.pm2_env.pm_exec_path);
    console.log('  Uptime    : ' + new Date(p.pm2_env.pm_uptime).toISOString());
    console.log('  Restarts  : ' + p.pm2_env.restart_time);
    console.log('  Memory    : ' + Math.round(p.monit.memory / 1024 / 1024) + ' MB');
    console.log('  CPU       : ' + p.monit.cpu + '%');
    console.log('  User      : ' + (p.pm2_env.username || 'N/A'));
    console.log('  NODE_ENV  : ' + (p.pm2_env.NODE_ENV || 'N/A'));
    console.log('');
  });
" 2>/dev/null || echo "  (Could not read PM2 process list)"
echo ""

# ── Application Info ─────────────────────────────────────
echo "=== APPLICATION ==="
echo "Install Path  : $INSTALL_PATH"
if [[ -f "$INSTALL_PATH/package.json" ]]; then
    echo "App Version   : $(node -p "require('$INSTALL_PATH/package.json').version" 2>/dev/null || echo 'N/A')"
    echo "App Name      : $(node -p "require('$INSTALL_PATH/package.json').name" 2>/dev/null || echo 'N/A')"
else
    echo "App Version   : package.json NOT FOUND"
fi
echo ""

# ── .env Keys (VALUES REDACTED) ──────────────────────────
echo "=== .ENV KEYS (values redacted for security) ==="
if [[ -f "$INSTALL_PATH/.env" ]]; then
    while IFS= read -r line; do
        # Skip comments and blank lines
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$line" ]] && continue
        
        key=$(echo "$line" | cut -d= -f1)
        value=$(echo "$line" | cut -d= -f2-)
        
        # Show values for non-sensitive keys, redact sensitive ones
        case "$key" in
            *PASSWORD*|*SECRET*|*KEY*|*TOKEN*|DATABASE_URL)
                echo "  $key = ********"
                ;;
            PORT|NODE_ENV|APP_URL|BASE_URL|FRONTEND_BASE_URL|LOG_LEVEL|LOG_PRETTY|\
            HIMKOSH_PAYMENT_URL|HIMKOSH_VERIFICATION_URL|HIMKOSH_CHALLAN_PRINT_URL|\
            HIMKOSH_SEARCH_URL|HIMKOSH_MERCHANT_CODE|HIMKOSH_DEPT_ID|HIMKOSH_SERVICE_CODE|\
            HIMKOSH_DDO_CODE|HIMKOSH_HEAD|HIMKOSH_RETURN_URL|HIMKOSH_KEY_FILE_PATH|\
            HIMKOSH_ALLOW_DEV_FALLBACK|HIMKOSH_TEST_MODE|\
            CAPTCHA_ENABLED|CAPTCHA_PROVIDER|\
            HPSSO_ENABLED|HPSSO_ENVIRONMENT|HPSSO_PROD_URL|\
            RATE_LIMIT_*|SECURITY_*|CLAMAV_*|OBJECT_STORAGE_*|LOCAL_OBJECT_*|\
            SESSION_COOKIE_*|SESSION_IDLE_*|SESSION_STORE|\
            ALLOW_PRODUCTION_RESET|ALLOW_RESET_OPERATIONS|ENABLE_TEST_RUNNER|\
            BACKUP_PATH|DB_MAX_CONNECTIONS|USE_MEM_STORAGE|LOCAL_MAX_UPLOAD_BYTES)
                echo "  $key = $value"
                ;;
            *)
                echo "  $key = $value"
                ;;
        esac
    done < "$INSTALL_PATH/.env"
else
    echo "  .env file NOT FOUND at $INSTALL_PATH/.env"
fi
echo ""

# ── Database ─────────────────────────────────────────────
echo "=== DATABASES ==="
sudo -u postgres psql -c "SELECT datname, pg_catalog.pg_get_userbyid(datdba) AS owner, pg_size_pretty(pg_database_size(datname)) AS size FROM pg_database WHERE datistemplate = false ORDER BY datname;" 2>/dev/null || echo "  (Could not query PostgreSQL)"
echo ""

# ── Nginx ────────────────────────────────────────────────
echo "=== NGINX ==="
echo "Nginx Version : $(nginx -v 2>&1 | head -1)"
echo ""
echo "Sites Enabled:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "  (No sites-enabled)"
echo ""
echo "Config Test   : $(nginx -t 2>&1 | tail -1)"
echo ""

# ── SSL Certificates ────────────────────────────────────
echo "=== SSL CERTIFICATES ==="
for cert_path in /opt/ssl-backup/hptourism.crt /etc/nginx/ssl/hptourism.crt; do
    if [[ -f "$cert_path" ]]; then
        echo "Certificate: $cert_path"
        openssl x509 -in "$cert_path" -noout -subject -issuer -dates 2>/dev/null || echo "  (Could not read certificate)"
        echo ""
    fi
done

# ── Ports in Use ─────────────────────────────────────────
echo "=== LISTENING PORTS (app-related) ==="
ss -tlnp 2>/dev/null | grep -E ':(80|443|5050|5055|5432) ' || echo "  (No matching ports)"
echo ""

# ── Folder Structure ─────────────────────────────────────
echo "=== INSTALL DIR STRUCTURE ==="
if [[ -d "$INSTALL_PATH" ]]; then
    ls -la "$INSTALL_PATH/" 2>/dev/null
    echo ""
    echo "dist/ size    : $(du -sh "$INSTALL_PATH/dist" 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "node_mod size : $(du -sh "$INSTALL_PATH/node_modules" 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "storage size  : $(du -sh "$INSTALL_PATH/local-object-storage" 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "logs size     : $(du -sh "$INSTALL_PATH/logs" 2>/dev/null | cut -f1 || echo 'N/A')"
fi
echo ""

# ── Firewall ─────────────────────────────────────────────
echo "=== FIREWALL (UFW) ==="
ufw status 2>/dev/null || echo "  UFW not installed or not accessible"
echo ""

# ── Cron Jobs ────────────────────────────────────────────
echo "=== CRON JOBS ==="
crontab -l 2>/dev/null || echo "  No crontab for $(whoami)"
echo ""

echo "============================================"
echo "CAPTURE COMPLETE — $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "============================================"
} | tee "$OUTPUT"

echo ""
echo "✓ Profile saved to: $(pwd)/$OUTPUT"
echo "  Copy this file back to your DEV machine and update PROD Profile/"
echo ""
