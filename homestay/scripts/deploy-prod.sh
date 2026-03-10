#!/bin/bash
set -e

# Ensure running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ This script must be run as root (or with sudo) to kill ghost processes."
  exit 1
fi

APP_DIR=$(pwd)
USER="hptourism"
APP_NAME="hptourism-prod"

echo "🚀 Starting Robust Production Deployment..."
echo "📂 App Directory: $APP_DIR"
echo "👤 Target User: $USER"

# 1. Kill Ghosts
echo "👻 Step 1: Clearing Port Conflicts (Ghostbusters)..."
bash scripts/kill-ghosts.sh

# 2. Fix Permissions
echo "🔧 Step 2: Fixing permissions for '$USER'..."
chown -R $USER:$USER .

# 3. Start App
echo "✅ Step 3: Starting process as '$USER'..."
# Use su to switch user and run pm2
su - $USER -c "cd $APP_DIR && pm2 delete $APP_NAME 2>/dev/null || true"
sleep 2
su - $USER -c "cd $APP_DIR && pm2 start dist/index.js --name $APP_NAME --kill-timeout 8000 --restart-delay 5000 --max-restarts 10 --node-args='--enable-source-maps'"
su - $USER -c "pm2 save"

# 4. Verify
echo "🔍 Step 4: Verifying startup..."
sleep 5
su - $USER -c "pm2 logs $APP_NAME --lines 20 --nostream"

echo "🎉 Deployment Complete! Please check logs above for 'Server listening on port 5055'."
