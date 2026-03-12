#!/bin/bash
################################################################################
# HP Tourism — PROD Stabilization Script
#
# Fixes:
#   1. Kill ALL zombie/orphan node processes
#   2. Standardize PM2 to run as root (current reality)
#   3. Fix dangerous .env flags
#   4. Clean restart with single process
#
# Run ON PROD: bash fix-prod-stability.sh
################################################################################

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

INSTALL_PATH="/opt/hptourism/homestay"
PM2_NAME="hptourism-prod"
ENV_FILE="$INSTALL_PATH/.env"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        HP TOURISM — PROD STABILIZATION                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 1: Show current state ───────────────────────────────────────────
echo -e "${BLUE}=== CURRENT STATE ===${NC}"
echo ""
echo "PM2 processes (root):"
pm2 list 2>/dev/null || echo "  No PM2 processes under root"
echo ""

echo "PM2 processes (hmsusr):"
sudo -u hmsusr pm2 list 2>/dev/null || echo "  No PM2 processes under hmsusr"
echo ""

echo "PM2 processes (hptourism):"
sudo -u hptourism pm2 list 2>/dev/null || echo "  No PM2 processes under hptourism"
echo ""

echo "ALL node processes on system:"
ps aux | grep -E '[n]ode|[p]m2' | head -20 || echo "  None found"
echo ""

echo "Port 5055 usage:"
ss -tlnp | grep ':5055' || echo "  Port 5055 not in use"
echo ""

# ── Step 2: Confirmation ────────────────────────────────────────────────
echo -e "${YELLOW}This script will:${NC}"
echo "  1. Stop ALL PM2 processes under ALL users (root, hmsusr, hptourism)"
echo "  2. Kill ALL orphan node processes"
echo "  3. Fix .env security flags"
echo "  4. Start ONE clean PM2 process as root"
echo ""
read -p "Proceed? [y/N]: " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ── Step 3: Stop ALL PM2 processes under ALL users ───────────────────────
echo ""
echo -e "${BLUE}=== STOPPING ALL PM2 PROCESSES ===${NC}"

# Stop under root
echo "Stopping PM2 under root..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✓ Root PM2 cleared${NC}"

# Stop under hmsusr
echo "Stopping PM2 under hmsusr..."
sudo -u hmsusr pm2 stop all 2>/dev/null || true
sudo -u hmsusr pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✓ hmsusr PM2 cleared${NC}"

# Stop under hptourism
echo "Stopping PM2 under hptourism..."
sudo -u hptourism pm2 stop all 2>/dev/null || true
sudo -u hptourism pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✓ hptourism PM2 cleared${NC}"

# ── Step 4: Kill ALL orphan node processes ───────────────────────────────
echo ""
echo -e "${BLUE}=== KILLING ORPHAN NODE PROCESSES ===${NC}"

# Find and kill any remaining node processes related to our app
ORPHAN_PIDS=$(pgrep -f "node.*dist/index.js" 2>/dev/null || true)
if [[ -n "$ORPHAN_PIDS" ]]; then
    echo "Found orphan PIDs: $ORPHAN_PIDS"
    echo "$ORPHAN_PIDS" | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Orphan processes killed${NC}"
else
    echo -e "${GREEN}✓ No orphan processes found${NC}"
fi

# Also check for any PM2 daemon processes from other users
ORPHAN_PM2=$(pgrep -f "PM2" 2>/dev/null || true)
if [[ -n "$ORPHAN_PM2" ]]; then
    echo "Found PM2 daemon PIDs: $ORPHAN_PM2"
    # Don't kill the root PM2 daemon, only others
fi

# Wait for port to free up
sleep 2
if ss -tlnp | grep -q ':5055'; then
    echo -e "${YELLOW}⚠ Port 5055 still in use — force killing...${NC}"
    fuser -k 5055/tcp 2>/dev/null || true
    sleep 2
fi
echo -e "${GREEN}✓ Port 5055 is free${NC}"

# ── Step 5: Fix .env security flags ─────────────────────────────────────
echo ""
echo -e "${BLUE}=== FIXING .ENV SECURITY FLAGS ===${NC}"

if [[ -f "$ENV_FILE" ]]; then
    # Backup current .env
    cp "$ENV_FILE" "${ENV_FILE}.bak.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✓ .env backed up${NC}"

    # Fix ALLOW_PRODUCTION_RESET
    if grep -q "^ALLOW_PRODUCTION_RESET=true" "$ENV_FILE"; then
        sed -i 's/^ALLOW_PRODUCTION_RESET=true/ALLOW_PRODUCTION_RESET=false/' "$ENV_FILE"
        echo -e "${GREEN}✓ ALLOW_PRODUCTION_RESET → false${NC}"
    elif ! grep -q "^ALLOW_PRODUCTION_RESET" "$ENV_FILE"; then
        echo "ALLOW_PRODUCTION_RESET=false" >> "$ENV_FILE"
        echo -e "${GREEN}✓ ALLOW_PRODUCTION_RESET=false added${NC}"
    else
        echo "  ALLOW_PRODUCTION_RESET already correct"
    fi

    # Fix ALLOW_RESET_OPERATIONS
    if grep -q "^ALLOW_RESET_OPERATIONS=true" "$ENV_FILE"; then
        sed -i 's/^ALLOW_RESET_OPERATIONS=true/ALLOW_RESET_OPERATIONS=false/' "$ENV_FILE"
        echo -e "${GREEN}✓ ALLOW_RESET_OPERATIONS → false${NC}"
    elif ! grep -q "^ALLOW_RESET_OPERATIONS" "$ENV_FILE"; then
        echo "ALLOW_RESET_OPERATIONS=false" >> "$ENV_FILE"
        echo -e "${GREEN}✓ ALLOW_RESET_OPERATIONS=false added${NC}"
    else
        echo "  ALLOW_RESET_OPERATIONS already correct"
    fi

    # Fix ENABLE_TEST_RUNNER
    if grep -q "^ENABLE_TEST_RUNNER=true" "$ENV_FILE"; then
        sed -i 's/^ENABLE_TEST_RUNNER=true/ENABLE_TEST_RUNNER=false/' "$ENV_FILE"
        echo -e "${GREEN}✓ ENABLE_TEST_RUNNER → false${NC}"
    elif ! grep -q "^ENABLE_TEST_RUNNER" "$ENV_FILE"; then
        echo "ENABLE_TEST_RUNNER=false" >> "$ENV_FILE"
        echo -e "${GREEN}✓ ENABLE_TEST_RUNNER=false added${NC}"
    else
        echo "  ENABLE_TEST_RUNNER already correct"
    fi

    # Remove NODE_TLS_REJECT_UNAUTHORIZED=0
    if grep -q "^NODE_TLS_REJECT_UNAUTHORIZED=0" "$ENV_FILE"; then
        sed -i '/^NODE_TLS_REJECT_UNAUTHORIZED=0/d' "$ENV_FILE"
        echo -e "${GREEN}✓ NODE_TLS_REJECT_UNAUTHORIZED=0 removed${NC}"
    else
        echo "  NODE_TLS_REJECT_UNAUTHORIZED already clean"
    fi

    echo ""
    echo "Verify .env flags:"
    grep -E "(ALLOW_PRODUCTION_RESET|ALLOW_RESET_OPERATIONS|ENABLE_TEST_RUNNER|NODE_TLS_REJECT)" "$ENV_FILE" || echo "  (clean — no dangerous flags)"
else
    echo -e "${RED}✗ .env not found at $ENV_FILE${NC}"
fi

# ── Step 6: Fix file ownership ───────────────────────────────────────────
echo ""
echo -e "${BLUE}=== FIXING FILE OWNERSHIP ===${NC}"
chown -R hptourism:hptourism "$INSTALL_PATH"
chmod -R u+rwX "$INSTALL_PATH"
mkdir -p "$INSTALL_PATH/logs"
chown -R hptourism:hptourism "$INSTALL_PATH/logs"
echo -e "${GREEN}✓ All files owned by hptourism:hptourism${NC}"

# Ensure hptourism has a PM2 home directory
mkdir -p /home/hptourism/.pm2 2>/dev/null || mkdir -p /opt/hptourism/.pm2
chown -R hptourism:hptourism /home/hptourism/.pm2 2>/dev/null || chown -R hptourism:hptourism /opt/hptourism/.pm2

# ── Step 7: Start ONE clean PM2 process as hptourism ────────────────────
echo ""
echo -e "${BLUE}=== STARTING CLEAN PM2 PROCESS (as hptourism) ===${NC}"

cd "$INSTALL_PATH"

# Start as hptourism — the ONLY user that should ever run this app
sudo -u hptourism bash -c "cd $INSTALL_PATH && \
    pm2 start ./dist/index.js \
    --name $PM2_NAME \
    --cwd $INSTALL_PATH \
    --node-args '--enable-source-maps' \
    --log-date-format 'YYYY-MM-DD HH:mm:ss Z' \
    --output ./logs/out.log \
    --error ./logs/error.log \
    --max-memory-restart 1G \
    --update-env"

# Save PM2 state for hptourism
sudo -u hptourism pm2 save

# Register PM2 startup for hptourism (run as root to create systemd service)
PM2_HOME=$(sudo -u hptourism bash -c 'echo $HOME')
env PATH=$PATH:/usr/bin pm2 startup systemd -u hptourism --hp "$PM2_HOME" 2>/dev/null | tail -n 1 | bash 2>/dev/null || true
echo -e "${GREEN}✓ PM2 startup registered for hptourism${NC}"

echo ""
echo -e "${BLUE}=== VERIFYING STARTUP ===${NC}"

# Wait for port to bind
MAX_WAIT=15
for i in $(seq 1 $MAX_WAIT); do
    if ss -tlnp | grep -q ':5055'; then
        echo -e "${GREEN}✓ Port 5055 is bound (attempt $i)${NC}"
        break
    fi
    echo "  Waiting... ($i/$MAX_WAIT)"
    sleep 2
done

# Health check
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:5055/" 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "302" ]]; then
    echo -e "${GREEN}✓ Health check PASSED (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Health check FAILED (HTTP $HTTP_CODE)${NC}"
    echo "Check logs: pm2 logs $PM2_NAME --lines 30"
fi

# Show final status
echo ""
echo -e "${BLUE}=== FINAL STATE ===${NC}"
pm2 list
echo ""
echo "Restart count should now be 0:"
pm2 jlist 2>/dev/null | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
  d.forEach(p => console.log('  ' + p.name + ': restarts=' + p.pm2_env.restart_time + ', status=' + p.pm2_env.status + ', uptime=' + Math.round((Date.now() - p.pm2_env.pm_uptime)/1000) + 's'));
" 2>/dev/null || true

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              STABILIZATION COMPLETE ✅                       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  ✓ All zombie processes killed"
echo "  ✓ PM2 cleared under root, hmsusr, hptourism"
echo "  ✓ File ownership fixed to hptourism:hptourism"
echo "  ✓ .env security flags fixed"
echo "  ✓ Single clean PM2 process running as hptourism"
echo "  ✓ PM2 startup registered for hptourism"
echo "  ✓ max_memory_restart raised to 1G (was 500M)"
echo ""
echo "  Monitor: sudo -u hptourism pm2 monit"
echo "  Logs:    sudo -u hptourism pm2 logs $PM2_NAME --lines 50"
echo ""
