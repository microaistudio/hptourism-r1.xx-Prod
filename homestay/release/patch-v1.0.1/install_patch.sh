#!/bin/bash
set -e

# HP Tourism Homestay Portal - Patch v1.0.1
# Fixes: PM2 Scaling Dashboard Mismatch

echo "========================================"
echo "   Applying Patch v1.0.1 (Hotfix)"
echo "========================================"

TARGET_DIR="/opt/hptourism/homestay"

if [[ ! -d "$TARGET_DIR" ]]; then
    echo "Error: Installation not found at $TARGET_DIR"
    exit 1
fi

# Detect Service User
SERVICE_USER=$(stat -c '%U' "$TARGET_DIR")
if [[ -z "$SERVICE_USER" ]]; then
    SERVICE_USER="hptourism"
fi
echo "Detected Service User: $SERVICE_USER"

# Create Backup
BACKUP_DIR="/opt/backup/homestay/patch_v1.0.1_backup_$(date +%Y%m%d_%H%M%S)"
echo "Creating backup at $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r "$TARGET_DIR/dist" "$BACKUP_DIR/"

# Install Patch
echo "Installing updated application files..."
cp -r dist/* "$TARGET_DIR/dist/"

# Fix Permissions
echo "Fixing permissions..."
chown -R "$SERVICE_USER":"$SERVICE_USER" "$TARGET_DIR/dist"

# Reload PM2 (Zero Downtime)
echo "Reloading application..."
if [[ "$EUID" -eq 0 ]]; then
    # We are root, so run as service user
    if command -v sudo &>/dev/null; then
        sudo -u "$SERVICE_USER" pm2 reload hptourism-prod
    else
        su - "$SERVICE_USER" -c "pm2 reload hptourism-prod"
    fi
else
    # We are presumably the service user or authorized user
    pm2 reload hptourism-prod
fi

echo "========================================"
echo "   Patch Applied Successfully! ✅"
echo "========================================"
