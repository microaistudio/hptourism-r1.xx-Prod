#!/bin/bash
###############################################################################
# HP Tourism Homestay Portal — Production Deploy Script
#
# Usage:  ./deploy.sh <path-to-patch.tar.gz>
# Example: ./deploy.sh /home/hmsusr/setup/hptourism-v1.0.29-patch.tar.gz
#
# This script handles the FULL deployment lifecycle:
#   1. Validates the package
#   2. Stops the running process gracefully
#   3. Kills any zombie processes on the port
#   4. Waits for the port to be fully released
#   5. Extracts the new package
#   6. Runs DB migrations if needed
#   7. Starts the new process with proper PM2 settings
#   8. Verifies the process is healthy
#   9. Saves PM2 config for reboot persistence
###############################################################################

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
APP_NAME="hptourism-prod"
APP_DIR="/opt/hptourism/homestay"
APP_PORT=5055
PM2_KILL_TIMEOUT=8000
PM2_RESTART_DELAY=2000
PM2_MAX_RESTARTS=10
HEALTH_CHECK_RETRIES=10
HEALTH_CHECK_DELAY=2

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()   { echo -e "${CYAN}[DEPLOY]${NC} $1"; }
ok()    { echo -e "${GREEN}[  OK  ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[ WARN ]${NC} $1"; }
fail()  { echo -e "${RED}[FAILED]${NC} $1"; exit 1; }

# ── Validate Arguments ───────────────────────────────────────────────────────
PACKAGE="${1:-}"
if [ -z "$PACKAGE" ]; then
    echo ""
    echo "Usage: $0 <path-to-patch.tar.gz>"
    echo "Example: $0 /home/hmsusr/setup/hptourism-v1.0.29-patch.tar.gz"
    echo ""
    exit 1
fi

if [ ! -f "$PACKAGE" ]; then
    fail "Package not found: $PACKAGE"
fi

log "Starting deployment of: $(basename "$PACKAGE")"
echo "─────────────────────────────────────────────────────"

# ── Step 1: Stop the running process ─────────────────────────────────────────
log "Step 1/7: Stopping $APP_NAME..."

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 stop "$APP_NAME" 2>/dev/null || true
    sleep 1
    pm2 delete "$APP_NAME" 2>/dev/null || true
    ok "PM2 process stopped and deleted"
else
    warn "No existing PM2 process found (clean start)"
fi

# ── Step 2: Kill any zombie processes on the port ────────────────────────────
log "Step 2/7: Releasing port $APP_PORT..."

if fuser "$APP_PORT/tcp" > /dev/null 2>&1; then
    fuser -k "$APP_PORT/tcp" 2>/dev/null || true
    sleep 2
    # Double-check
    if fuser "$APP_PORT/tcp" > /dev/null 2>&1; then
        warn "Port still held, force killing..."
        fuser -k -9 "$APP_PORT/tcp" 2>/dev/null || true
        sleep 2
    fi
fi

if fuser "$APP_PORT/tcp" > /dev/null 2>&1; then
    fail "Cannot release port $APP_PORT — something is stuck. Check with: lsof -i :$APP_PORT"
fi
ok "Port $APP_PORT is free"

# ── Step 3: Extract the package ──────────────────────────────────────────────
log "Step 3/7: Extracting package..."
cd "$APP_DIR"
tar -xzf "$PACKAGE"
ok "Package extracted to $APP_DIR"

# ── Step 4: Run database migrations ──────────────────────────────────────────
log "Step 4/7: Checking database schema..."
if [ -f "$APP_DIR/.env" ]; then
    source "$APP_DIR/.env"
    npx drizzle-kit push 2>&1 | tail -3
    ok "Database schema up to date"
else
    warn "No .env file found, skipping DB migration"
fi

# ── Step 5: Start the new process ────────────────────────────────────────────
log "Step 5/7: Starting $APP_NAME..."
pm2 start dist/index.js \
    --name "$APP_NAME" \
    --kill-timeout "$PM2_KILL_TIMEOUT" \
    --restart-delay "$PM2_RESTART_DELAY" \
    --max-restarts "$PM2_MAX_RESTARTS" \
    --node-args="--enable-source-maps"

# ── Step 6: Health check ─────────────────────────────────────────────────────
log "Step 6/7: Verifying process health..."
HEALTHY=false
for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
    sleep "$HEALTH_CHECK_DELAY"
    STATUS=$(pm2 jlist 2>/dev/null | node -e "
        const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
        const p = d.find(x => x.name === '$APP_NAME');
        console.log(p ? p.pm2_env.status : 'missing');
    " 2>/dev/null || echo "unknown")

    if [ "$STATUS" = "online" ]; then
        HEALTHY=true
        break
    fi
    warn "Attempt $i/$HEALTH_CHECK_RETRIES: status=$STATUS, waiting..."
done

if [ "$HEALTHY" = true ]; then
    ok "Process is online and healthy"
else
    fail "Process failed to start! Check logs with: pm2 logs $APP_NAME --lines 30"
fi

# ── Step 7: Save PM2 config ──────────────────────────────────────────────────
log "Step 7/7: Saving PM2 process list..."
pm2 save
ok "PM2 config saved (survives reboot)"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "─────────────────────────────────────────────────────"
VERSION=$(node -e "console.log(require('$APP_DIR/package.json').version)" 2>/dev/null || echo "unknown")
ok "Deployment complete! Version: $VERSION"
pm2 list
echo ""
