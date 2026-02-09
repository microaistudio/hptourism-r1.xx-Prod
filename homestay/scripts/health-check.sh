#!/bin/bash
#
# HP Tourism Homestay Portal - Health Check Script
# Run after deployment or anytime to verify system health
#
# Usage: ./health-check.sh [prod|dev]
# Default: prod
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV="${1:-prod}"
if [ "$ENV" = "prod" ]; then
    APP_NAME="hptourism-prod"
    PORT=5055
    BASE_URL="http://localhost:5055"
    APP_DIR="/opt/hptourism/homestay"
    PM2_CMD="sudo pm2"
elif [ "$ENV" = "dev" ]; then
    APP_NAME="hptourism-dev"
    PORT=5050
    BASE_URL="http://localhost:5050"
    APP_DIR="/home/subhash.thakur.india/Projects/hptourism/homestay"
    PM2_CMD="pm2"
else
    echo -e "${RED}Invalid environment: $ENV. Use 'prod' or 'dev'${NC}"
    exit 1
fi

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Helper functions
pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS_COUNT++)) || true
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL_COUNT++)) || true
}

warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((WARN_COUNT++)) || true
}

info() {
    echo -e "${BLUE}ℹ INFO${NC}: $1"
}

header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Start health check
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     HP Tourism Homestay Portal - Health Check              ║"
echo "║     Environment: $ENV                                       ║"
echo "║     $(date '+%Y-%m-%d %H:%M:%S')                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"

# 1. PM2 Process Check
header "1. PM2 Process Status"

PM2_STATUS=$($PM2_CMD jlist 2>/dev/null | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.status" 2>/dev/null || echo "error")
PM2_VERSION=$($PM2_CMD jlist 2>/dev/null | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.version" 2>/dev/null || echo "unknown")
PM2_UPTIME=$($PM2_CMD jlist 2>/dev/null | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.pm_uptime" 2>/dev/null || echo "0")
PM2_RESTARTS=$($PM2_CMD jlist 2>/dev/null | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.restart_time" 2>/dev/null || echo "0")
PM2_MEMORY=$($PM2_CMD jlist 2>/dev/null | jq -r ".[] | select(.name==\"$APP_NAME\") | .monit.memory" 2>/dev/null || echo "0")

if [ "$PM2_STATUS" = "online" ]; then
    pass "PM2 process is online"
    info "Version: $PM2_VERSION"
    
    # Calculate uptime
    if [ "$PM2_UPTIME" != "0" ] && [ "$PM2_UPTIME" != "null" ]; then
        UPTIME_SEC=$(( ($(date +%s%3N) - PM2_UPTIME) / 1000 ))
        UPTIME_MIN=$((UPTIME_SEC / 60))
        info "Uptime: ${UPTIME_MIN} minutes"
    fi
    
    # Memory check
    if [ "$PM2_MEMORY" != "0" ] && [ "$PM2_MEMORY" != "null" ]; then
        MEMORY_MB=$((PM2_MEMORY / 1024 / 1024))
        if [ "$MEMORY_MB" -lt 500 ]; then
            pass "Memory usage: ${MEMORY_MB}MB (healthy)"
        else
            warn "Memory usage: ${MEMORY_MB}MB (high)"
        fi
    fi
    
    # Restart check
    if [ "$PM2_RESTARTS" -gt 50 ]; then
        warn "High restart count: $PM2_RESTARTS (may indicate instability)"
    else
        info "Restart count: $PM2_RESTARTS"
    fi
else
    fail "PM2 process is not online (status: $PM2_STATUS)"
fi

# 2. Port Binding Check
header "2. Port Binding"

PORT_CHECK=$(lsof -i :$PORT -sTCP:LISTEN 2>/dev/null | grep -c "node" 2>/dev/null || echo "0")
PORT_CHECK="${PORT_CHECK//[^0-9]/}"  # Remove any non-numeric chars
PORT_CHECK="${PORT_CHECK:-0}"
if [ "$PORT_CHECK" -ge 1 ] 2>/dev/null; then
    pass "Port $PORT is bound to node process"
else
    fail "Port $PORT is not bound or not by node"
fi

# 3. API Endpoints Check
header "3. API Endpoints"

# Public settings
SETTINGS_RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/settings/public" --max-time 5 2>/dev/null || echo "000")
if [ "$SETTINGS_RESP" = "200" ]; then
    pass "GET /api/settings/public (HTTP $SETTINGS_RESP)"
else
    fail "GET /api/settings/public (HTTP $SETTINGS_RESP)"
fi

# Auth check (should return 401 without session)
AUTH_RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/auth/me" --max-time 5 2>/dev/null || echo "000")
if [ "$AUTH_RESP" = "401" ] || [ "$AUTH_RESP" = "200" ]; then
    pass "GET /api/auth/me (HTTP $AUTH_RESP - auth working)"
else
    fail "GET /api/auth/me (HTTP $AUTH_RESP - unexpected)"
fi

# Static assets
STATIC_RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" --max-time 5 2>/dev/null || echo "000")
if [ "$STATIC_RESP" = "200" ]; then
    pass "GET / (Static files serving)"
else
    fail "GET / (HTTP $STATIC_RESP)"
fi

# 4. Database Connectivity
header "4. Database Connectivity"

# Check if we can query via API (settings endpoint reads from DB)
SETTINGS_JSON=$(curl -s "$BASE_URL/api/settings/public" --max-time 5 2>/dev/null || echo "{}")
if echo "$SETTINGS_JSON" | jq -e '.serviceVisibility' > /dev/null 2>&1; then
    pass "Database query successful (settings loaded)"
else
    fail "Database query failed or returned invalid data"
fi

# 5. Key Services Check
header "5. Key Services"

# Check if payment gateways are configured (from logs)
if $PM2_CMD logs $APP_NAME --lines 50 --nostream 2>/dev/null | grep -q "Payment gateway routes registered"; then
    pass "Payment gateway routes registered"
else
    warn "Payment gateway routes may not be registered"
fi

# Check if scraper is running
if $PM2_CMD logs $APP_NAME --lines 50 --nostream 2>/dev/null | grep -q "Scheduler started"; then
    pass "Stats scraper scheduler running"
else
    warn "Stats scraper may not be running"
fi

# Check if backup scheduler is running
if $PM2_CMD logs $APP_NAME --lines 50 --nostream 2>/dev/null | grep -q "Backup scheduler started"; then
    pass "Backup scheduler running"
else
    warn "Backup scheduler may not be running"
fi

# 6. Recent Errors Check
header "6. Recent Errors"

RECENT_ERRORS=$($PM2_CMD logs $APP_NAME --err --lines 20 --nostream 2>/dev/null | grep -c "Error:" || echo "0")
if [ "$RECENT_ERRORS" -eq 0 ]; then
    pass "No recent errors in log"
elif [ "$RECENT_ERRORS" -lt 5 ]; then
    warn "Found $RECENT_ERRORS recent errors (check logs)"
else
    fail "Found $RECENT_ERRORS recent errors (high - investigate!)"
fi

# 7. Disk Space Check
header "7. System Resources"

DISK_USAGE=$(df -h "$APP_DIR" 2>/dev/null | awk 'NR==2 {print $5}' | tr -d '%')
if [ -n "$DISK_USAGE" ]; then
    if [ "$DISK_USAGE" -lt 80 ]; then
        pass "Disk usage: ${DISK_USAGE}% (healthy)"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        warn "Disk usage: ${DISK_USAGE}% (getting high)"
    else
        fail "Disk usage: ${DISK_USAGE}% (critical!)"
    fi
fi

# Summary
header "SUMMARY"
echo ""
echo -e "  ${GREEN}Passed${NC}: $PASS_COUNT"
echo -e "  ${YELLOW}Warnings${NC}: $WARN_COUNT"
echo -e "  ${RED}Failed${NC}: $FAIL_COUNT"
echo ""

if [ "$FAIL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ HEALTH CHECK PASSED - System is healthy!               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ HEALTH CHECK FAILED - $FAIL_COUNT issue(s) found!                  ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
