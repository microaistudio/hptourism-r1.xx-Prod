#!/bin/bash
# Apply HPTourism v1.0.9 Patch
# Usage: sudo ./patch_prod.sh
# Assumes installation at /opt/hptourism/homestay

TARGET_DIR="/opt/hptourism/homestay"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory $TARGET_DIR not found!"
    echo "If running on DEV, use current directory."
    exit 1
fi

echo "Stopping PM2 services..."
pm2 stop hptourism-rc7 || pm2 stop hptourism-prod || true

echo "Backing up current dist..."
cp -r "$TARGET_DIR/dist" "$TARGET_DIR/dist_backup_$(date +%s)"

echo "Copying new files..."
cp -r dist/* "$TARGET_DIR/dist/"
cp package.json "$TARGET_DIR/"

echo "Restarting services..."
pm2 restart hptourism-rc7 || pm2 restart hptourism-prod || echo "Warning: Could not restart PM2 automatically. Please run 'pm2 restart hptourism-prod'"

echo "Patch v1.0.9 Applied Successfully."
