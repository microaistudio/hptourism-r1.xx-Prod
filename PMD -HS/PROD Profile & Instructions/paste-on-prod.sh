#!/bin/bash
# Paste this entirely into the PROD terminal to create the deploy script then run it

cat > ~/setup/deploy-1.3.0.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -euo pipefail
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
INSTALL_PATH="/opt/hptourism/homestay"
PM2_NAME="hptourism-prod"
APP_USER="hptourism"
APP_PORT="5055"
SETUP_DIR="$HOME/setup"
TARBALL="hptourism-v1.3.0-prod.tar.gz"
PACK_NAME="hptourism-v1.3.0-prod"
ENV_FILE="$INSTALL_PATH/.env"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗"
echo "║     HP TOURISM — v1.3.0 PROD DEPLOYMENT                    ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"

# Pre-flight
[[ ! -f "$SETUP_DIR/$TARBALL" ]] && echo -e "${RED}✗ Tarball not found: $SETUP_DIR/$TARBALL${NC}" && exit 1
[[ ! -f "$ENV_FILE" ]] && echo -e "${RED}✗ .env not found${NC}" && exit 1
echo -e "${GREEN}✓ Pre-flight OK — tarball $(ls -lh $SETUP_DIR/$TARBALL | awk '{print $5}')${NC}"

# Step 1: Kill all zombies
echo -e "\n${BLUE}=== STEP 1: CLEAR ALL ZOMBIES ===${NC}"
pm2 stop all 2>/dev/null || true; pm2 delete all 2>/dev/null || true
sudo -u hmsusr pm2 stop all 2>/dev/null || true; sudo -u hmsusr pm2 delete all 2>/dev/null || true
sudo -u $APP_USER pm2 stop all 2>/dev/null || true; sudo -u $APP_USER pm2 delete all 2>/dev/null || true
pgrep -f "node.*dist/index.js" | xargs kill -9 2>/dev/null || true
ss -tlnp | grep -q ":$APP_PORT" && fuser -k ${APP_PORT}/tcp 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ All processes cleared${NC}"

# Step 2: Fix .env
echo -e "\n${BLUE}=== STEP 2: FIX .ENV FLAGS ===${NC}"
cp "$ENV_FILE" "${ENV_FILE}.bak.$(date +%Y%m%d_%H%M%S)"
sed -i 's/^ALLOW_PRODUCTION_RESET=true/ALLOW_PRODUCTION_RESET=false/' "$ENV_FILE" 2>/dev/null || true
sed -i 's/^ALLOW_RESET_OPERATIONS=true/ALLOW_RESET_OPERATIONS=false/' "$ENV_FILE" 2>/dev/null || true
sed -i 's/^ENABLE_TEST_RUNNER=true/ENABLE_TEST_RUNNER=false/' "$ENV_FILE" 2>/dev/null || true
sed -i '/^NODE_TLS_REJECT_UNAUTHORIZED/d' "$ENV_FILE" 2>/dev/null || true
grep -q "^ALLOW_PRODUCTION_RESET" "$ENV_FILE" || echo "ALLOW_PRODUCTION_RESET=false" >> "$ENV_FILE"
grep -q "^ALLOW_RESET_OPERATIONS" "$ENV_FILE" || echo "ALLOW_RESET_OPERATIONS=false" >> "$ENV_FILE"
grep -q "^ENABLE_TEST_RUNNER" "$ENV_FILE" || echo "ENABLE_TEST_RUNNER=false" >> "$ENV_FILE"
grep -q "^HIMKOSH_TEST_MODE" "$ENV_FILE" || echo "HIMKOSH_TEST_MODE=false" >> "$ENV_FILE"
grep -q "^HIMKOSH_ALLOW_DEV_FALLBACK" "$ENV_FILE" || echo "HIMKOSH_ALLOW_DEV_FALLBACK=false" >> "$ENV_FILE"
echo -e "${GREEN}✓ .env fixed${NC}"
grep -E "(ALLOW_PRODUCTION_RESET|ALLOW_RESET_OPERATIONS|ENABLE_TEST_RUNNER|HIMKOSH_TEST_MODE)" "$ENV_FILE" | sed 's/^/    /'

# Step 3: Backup current dist
echo -e "\n${BLUE}=== STEP 3: BACKUP ===${NC}"
BACKUP_NAME="dist_backup_v1.2.x_$(date +%s)"
cp -r "$INSTALL_PATH/dist" "$INSTALL_PATH/$BACKUP_NAME"
echo -e "${GREEN}✓ Backup: $INSTALL_PATH/$BACKUP_NAME${NC}"

# Step 4: Deploy new files
echo -e "\n${BLUE}=== STEP 4: DEPLOY v1.3.0 ===${NC}"
cd "$SETUP_DIR"
tar -xzf "$TARBALL"
cp -r "$PACK_NAME/dist/." "$INSTALL_PATH/dist/"
cp -r "$PACK_NAME/shared/." "$INSTALL_PATH/shared/"
cp "$PACK_NAME/package.json" "$INSTALL_PATH/package.json"
cp -r "$PACK_NAME/migrations/." "$INSTALL_PATH/migrations/" 2>/dev/null || true
echo -e "${GREEN}✓ Files deployed${NC}"

# Step 5: CHOWN — THE CRITICAL STEP
echo -e "\n${BLUE}=== STEP 5: FIX OWNERSHIP (CRITICAL) ===${NC}"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/dist/"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/shared/"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/package.json"
chown -R $APP_USER:$APP_USER "$INSTALL_PATH/migrations/" 2>/dev/null || true
mkdir -p "$INSTALL_PATH/logs" && chown -R $APP_USER:$APP_USER "$INSTALL_PATH/logs/"
echo -e "${GREEN}✓ All files owned by $APP_USER:$APP_USER${NC}"

# Step 6: DB migrations
echo -e "\n${BLUE}=== STEP 6: DB MIGRATIONS ===${NC}"
cd "$INSTALL_PATH"
sudo -u $APP_USER bash -c "cd $INSTALL_PATH && export \$(grep -v '^#' .env | grep -v '^\s*$' | xargs) && npm run db:push" && echo -e "${GREEN}✓ Migrations done${NC}" || echo -e "${YELLOW}⚠ Check migration output above${NC}"

# Step 7: Start PM2 as hptourism
echo -e "\n${BLUE}=== STEP 7: START PM2 AS $APP_USER ===${NC}"
mkdir -p /home/$APP_USER/.pm2 && chown -R $APP_USER:$APP_USER /home/$APP_USER/.pm2 2>/dev/null || true
sudo -u $APP_USER bash -c "cd $INSTALL_PATH && pm2 start ./dist/index.js --name $PM2_NAME --cwd $INSTALL_PATH --node-args '--enable-source-maps' --log-date-format 'YYYY-MM-DD HH:mm:ss Z' --output ./logs/out.log --error ./logs/error.log --max-memory-restart 1G --update-env"
sudo -u $APP_USER pm2 save
PM2_HOME=$(sudo -u $APP_USER bash -c 'echo $HOME')
env PATH=$PATH:/usr/bin pm2 startup systemd -u $APP_USER --hp "$PM2_HOME" 2>/dev/null | grep "sudo\|systemctl" | bash 2>/dev/null || true
echo -e "${GREEN}✓ PM2 started as $APP_USER${NC}"

# Step 8: Verify
echo -e "\n${BLUE}=== STEP 8: VERIFY ===${NC}"
for i in $(seq 1 15); do
    ss -tlnp | grep -q ":$APP_PORT" && break
    echo "  Waiting for port $APP_PORT... ($i/15)"; sleep 2
done
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:$APP_PORT/" 2>/dev/null || echo "000")
[[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "302" ]] && echo -e "${GREEN}✓ Health check PASSED (HTTP $HTTP_CODE)${NC}" || { echo -e "${RED}✗ FAILED (HTTP $HTTP_CODE)${NC}"; sudo -u $APP_USER pm2 logs $PM2_NAME --nostream --lines 30; exit 1; }

sudo -u $APP_USER pm2 list
rm -rf "$SETUP_DIR/$PACK_NAME"

echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════╗"
echo "║         v1.3.0 DEPLOYMENT COMPLETE ✅                       ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${NC}"
echo "  Version  : 1.3.0  |  User: $APP_USER  |  Port: $APP_PORT  |  HTTP: $HTTP_CODE"
echo "  Logs     : sudo -u $APP_USER pm2 logs $PM2_NAME"
DEPLOY_SCRIPT

chmod +x ~/setup/deploy-1.3.0.sh
echo "Script created. Running now..."
bash ~/setup/deploy-1.3.0.sh
