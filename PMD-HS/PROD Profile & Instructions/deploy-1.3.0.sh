#!/bin/bash
################################################################################
# HP Tourism — PROD Deploy Script for v1.3.0
#
# Run ON PROD server as root:
#   bash ~/setup/deploy-1.3.0.sh
#
# What this does:
#   1. Kill ALL zombie PM2 processes under all users
#   2. Fix .env security flags
#   3. Deploy new dist/ from tarball
#   4. Fix file ownership (the step that was always missing)
#   5. Start ONE clean PM2 process as hptourism
#   6. Verify the site is up
################################################################################

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

INSTALL_PATH="/opt/hptourism/homestay"
PM2_NAME="hptourism-prod"
APP_USER="hptourism"
APP_PORT="5055"
SETUP_DIR="$HOME/setup"
TARBALL="hptourism-v1.3.0-prod.tar.gz"
PACK_NAME="hptourism-v1.3.0-prod"
ENV_FILE="$INSTALL_PATH/.env"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     HP TOURISM — v1.3.0 PROD DEPLOYMENT                    ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Target : $INSTALL_PATH"
echo "║  App    : $PM2_NAME (as $APP_USER)"
echo "║  Port   : $APP_PORT"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Pre-flight checks ─────────────────────────────────────────────────────
echo -e "${BLUE}=== PRE-FLIGHT CHECKS ===${NC}"

if [[ ! -f "$SETUP_DIR/$TARBALL" ]]; then
    echo -e "${RED}✗ Tarball not found: $SETUP_DIR/$TARBALL${NC}"
    echo "  Copy it first: scp hptourism-v1.3.0-prod.tar.gz root@homstyshmapp:~/setup/"
    exit 1
fi
echo -e "${GREEN}✓ Tarball found: $(ls -lh $SETUP_DIR/$TARBALL | awk '{print $5}')${NC}"

if [[ ! -d "$INSTALL_PATH" ]]; then
    echo -e "${RED}✗ Install path not found: $INSTALL_PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Install path exists${NC}"

if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}✗ .env not found — PROD .env must exist before deploying${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env exists${NC}"

echo ""
read -p "Ready to deploy v1.3.0 to PROD? This will restart the app. [y/N]: " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ── Step 1: Kill ALL zombie PM2 processes ────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 1: CLEAR ALL PM2 ZOMBIES ===${NC}"

echo "Clearing PM2 under root..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo "Clearing PM2 under hmsusr..."
sudo -u hmsusr pm2 stop all 2>/dev/null || true
sudo -u hmsusr pm2 delete all 2>/dev/null || true

echo "Clearing PM2 under $APP_USER..."
sudo -u $APP_USER pm2 stop all 2>/dev/null || true
sudo -u $APP_USER pm2 delete all 2>/dev/null || true

echo "Killing any orphan node processes..."
ORPHAN_PIDS=$(pgrep -f "node.*dist/index.js" 2>/dev/null || true)
if [[ -n "$ORPHAN_PIDS" ]]; then
    echo "$ORPHAN_PIDS" | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ Orphan PIDs killed${NC}"
fi

# Free the port
if ss -tlnp | grep -q ":$APP_PORT"; then
    fuser -k ${APP_PORT}/tcp 2>/dev/null || true
    sleep 2
fi
echo -e "${GREEN}✓ All zombie processes cleared${NC}"

# ── Step 2: Fix .env security flags ─────────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 2: FIX .ENV SECURITY FLAGS ===${NC}"

cp "$ENV_FILE" "${ENV_FILE}.bak.$(date +%Y%m%d_%H%M%S)"

# Fix dangerous flags
sed -i 's/^ALLOW_PRODUCTION_RESET=true/ALLOW_PRODUCTION_RESET=false/' "$ENV_FILE" 2>/dev/null || true
sed -i 's/^ALLOW_RESET_OPERATIONS=true/ALLOW_RESET_OPERATIONS=false/' "$ENV_FILE" 2>/dev/null || true
sed -i 's/^ENABLE_TEST_RUNNER=true/ENABLE_TEST_RUNNER=false/' "$ENV_FILE" 2>/dev/null || true
sed -i '/^NODE_TLS_REJECT_UNAUTHORIZED=0/d' "$ENV_FILE" 2>/dev/null || true

# Add missing flags if not present
grep -q "^ALLOW_PRODUCTION_RESET" "$ENV_FILE" || echo "ALLOW_PRODUCTION_RESET=false" >> "$ENV_FILE"
grep -q "^ALLOW_RESET_OPERATIONS" "$ENV_FILE" || echo "ALLOW_RESET_OPERATIONS=false" >> "$ENV_FILE"
grep -q "^ENABLE_TEST_RUNNER" "$ENV_FILE" || echo "ENABLE_TEST_RUNNER=false" >> "$ENV_FILE"
grep -q "^HIMKOSH_TEST_MODE" "$ENV_FILE" || echo "HIMKOSH_TEST_MODE=false" >> "$ENV_FILE"
grep -q "^HIMKOSH_ALLOW_DEV_FALLBACK" "$ENV_FILE" || echo "HIMKOSH_ALLOW_DEV_FALLBACK=false" >> "$ENV_FILE"

echo -e "${GREEN}✓ .env security flags fixed${NC}"
echo "  Current flags:"
grep -E "(ALLOW_PRODUCTION_RESET|ALLOW_RESET_OPERATIONS|ENABLE_TEST_RUNNER|HIMKOSH_TEST_MODE|NODE_TLS)" "$ENV_FILE" | sed 's/^/    /'

# ── Step 3: Backup current dist ──────────────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 3: BACKUP CURRENT DIST ===${NC}"

BACKUP_NAME="dist_backup_v1.2.x_$(date +%s)"
cp -r "$INSTALL_PATH/dist" "$INSTALL_PATH/$BACKUP_NAME"
echo -e "${GREEN}✓ Backup created: $INSTALL_PATH/$BACKUP_NAME${NC}"

# ── Step 4: Extract and deploy new dist ──────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 4: DEPLOY v1.3.0 ===${NC}"

cd "$SETUP_DIR"
echo "Extracting tarball..."
tar -xzf "$TARBALL"

echo "Deploying dist/..."
cp -r "$PACK_NAME/dist/." "$INSTALL_PATH/dist/"

echo "Deploying shared/..."
cp -r "$PACK_NAME/shared/." "$INSTALL_PATH/shared/"

echo "Updating package.json..."
cp "$PACK_NAME/package.json" "$INSTALL_PATH/package.json"

echo "Updating migrations/..."
cp -r "$PACK_NAME/migrations/." "$INSTALL_PATH/migrations/" 2>/dev/null || true

echo -e "${GREEN}✓ Files deployed${NC}"

# ── Step 5: THE CRITICAL STEP — Fix ownership ────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 5: FIX FILE OWNERSHIP (CRITICAL) ===${NC}"
echo "This step was missing in all previous deployments."

chown -R $APP_USER:$APP_USER "$INSTALL_PATH/dist/"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/shared/"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/migrations/"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/package.json"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/logs/" 2>/dev/null || mkdir -p "$INSTALL_PATH/logs" && chown -R $APP_USER:$APP_USER "$INSTALL_PATH/logs/"

echo -e "${GREEN}✓ All deployed files owned by $APP_USER:$APP_USER${NC}"

# ── Step 6: Run DB migrations ────────────────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 6: DATABASE MIGRATIONS ===${NC}"

cd "$INSTALL_PATH"
echo "Running db:push..."
if sudo -u $APP_USER bash -c "cd $INSTALL_PATH && export \$(grep -v '^#' .env | xargs) && npm run db:push"; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${YELLOW}⚠ db:push had warnings — check output above${NC}"
fi

# ── Step 7: Start PM2 as hptourism ───────────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 7: START PM2 AS $APP_USER ===${NC}"

# Ensure PM2 home exists for app user
mkdir -p /home/$APP_USER/.pm2 2>/dev/null || mkdir -p /opt/$APP_USER/.pm2
chown -R $APP_USER:$APP_USER /home/$APP_USER/.pm2 2>/dev/null || chown -R $APP_USER:$APP_USER /opt/$APP_USER/.pm2

sudo -u $APP_USER bash -c "cd $INSTALL_PATH && \
    pm2 start ./dist/index.js \
    --name $PM2_NAME \
    --cwd $INSTALL_PATH \
    --node-args '--enable-source-maps' \
    --log-date-format 'YYYY-MM-DD HH:mm:ss Z' \
    --output ./logs/out.log \
    --error ./logs/error.log \
    --max-memory-restart 1G \
    --update-env"

sudo -u $APP_USER pm2 save
echo -e "${GREEN}✓ PM2 started as $APP_USER${NC}"

# Register systemd startup
PM2_HOME=$(sudo -u $APP_USER bash -c 'echo $HOME')
env PATH=$PATH:/usr/bin pm2 startup systemd -u $APP_USER --hp "$PM2_HOME" 2>/dev/null | grep "sudo" | bash 2>/dev/null || true
echo -e "${GREEN}✓ PM2 startup registered for $APP_USER${NC}"

# ── Step 8: Verify ───────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}=== STEP 8: VERIFICATION ===${NC}"

MAX_WAIT=15
PORT_BOUND=false
for i in $(seq 1 $MAX_WAIT); do
    if ss -tlnp | grep -q ":$APP_PORT"; then
        PORT_BOUND=true
        break
    fi
    echo "  Waiting for port $APP_PORT... ($i/$MAX_WAIT)"
    sleep 2
done

if [[ "$PORT_BOUND" == "false" ]]; then
    echo -e "${RED}✗ FATAL: App did not bind to port $APP_PORT${NC}"
    sudo -u $APP_USER pm2 logs $PM2_NAME --nostream --lines 30
    exit 1
fi
echo -e "${GREEN}✓ Port $APP_PORT is bound${NC}"

sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:$APP_PORT/" 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "302" ]]; then
    echo -e "${GREEN}✓ Health check PASSED (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ FATAL: Health check FAILED (HTTP $HTTP_CODE)${NC}"
    sudo -u $APP_USER pm2 logs $PM2_NAME --nostream --lines 30
    exit 1
fi

# Final PM2 status
echo ""
sudo -u $APP_USER pm2 list

# Cleanup extracted tarball
rm -rf "$SETUP_DIR/$PACK_NAME"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         v1.3.0 DEPLOYMENT COMPLETE ✅                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Version  : 1.3.0"
echo "  App User : $APP_USER (NOT root)"
echo "  Port     : $APP_PORT"
echo "  HTTP     : $HTTP_CODE"
echo "  Restarts : 0 (fresh start)"
echo "  Backup   : $INSTALL_PATH/$BACKUP_NAME"
echo ""
echo "  View logs : sudo -u $APP_USER pm2 logs $PM2_NAME --lines 50"
echo "  Monitor   : sudo -u $APP_USER pm2 monit"
echo ""
