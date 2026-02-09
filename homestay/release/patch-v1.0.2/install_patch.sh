#!/bin/bash
set -e

# Configuration
APP_DIR="/opt/hptourism/homestay"
BACKUP_DIR="/opt/backup/homestay"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PATCH_VERSION="v1.0.2"

echo "=================================================="
echo "Installing HPTourism Patch ${PATCH_VERSION}"
echo "Timestamp: ${TIMESTAMP}"
echo "=================================================="

# 1. Verify User
if [ "$USER" != "root" ]; then
    echo "Error: This script must be run as root."
    exit 1
fi

# 2. Backup Existing Dist
echo "[1/5] Creating backup..."
mkdir -p "${BACKUP_DIR}/patch_backups"
if [ -d "${APP_DIR}/dist" ]; then
    tar -czf "${BACKUP_DIR}/patch_backups/dist_backup_${TIMESTAMP}.tar.gz" -C "${APP_DIR}" dist
    echo "Backup saved to: ${BACKUP_DIR}/patch_backups/dist_backup_${TIMESTAMP}.tar.gz"
else
    echo "Warning: No existing dist directory found. Skipping backup."
fi

# 3. Apply Patch
echo "[2/5] Applying patch files..."
if [ ! -d "dist" ]; then
    echo "Error: 'dist' directory not found in patch source."
    exit 1
fi

# Remove old dist clean to ensure no stale files
rm -rf "${APP_DIR}/dist"
cp -r dist "${APP_DIR}/"

# 4. Fix Permissions
echo "[3/5] Fixing permissions..."
chown -R hptourism:hptourism "${APP_DIR}/dist"
chmod -R 755 "${APP_DIR}/dist"

# 5. Restart Application (FORCE CLEAN RESTART)
echo "[4/5] Reloading Application..."
echo "Stopping any existing processes..."
# We use 'delete' instead of 'restart' to ensure a complete flush of memory/cache
sudo -u hptourism pm2 delete hptourism-prod 2>/dev/null || true
sudo -u hptourism pm2 delete hptourism-rc8 2>/dev/null || true

# Wait a moment for ports to clear
sleep 2

echo "Starting fresh process..."
cd "${APP_DIR}"
# Use the ecosystem config to start (ensure correct environment/ports)
sudo -u hptourism pm2 start ecosystem.config.cjs

echo "[5/5] Patch ${PATCH_VERSION} installed successfully!"
echo "=================================================="
echo "Verification:"
echo "1. Check status: sudo -u hptourism pm2 status"
echo "2. Check logs:   sudo -u hptourism pm2 logs hptourism-prod --lines 20"
echo "=================================================="
