#!/bin/bash
# PROD Deployment Script for Homestay v1.2.5
# Run this from the directory where you uploaded dist-v1.2.5.tar.gz

echo "=== Homestay Portal v1.2.5 Deployment ==="

# 1. Verify the archive exists
if [ ! -f "dist-v1.2.5.tar.gz" ]; then
    echo "ERROR: dist-v1.2.5.tar.gz not found in current directory!"
    exit 1
fi

# 2. Backup existing dist (Fail safely if backing up fails)
echo "Backing up current dist to /opt/hptourism/homestay/dist.bak.v1.2.0..."
mv /opt/hptourism/homestay/dist /opt/hptourism/homestay/dist.bak.v1.2.0 || { echo "ERROR: Failed to backup. Exiting."; exit 1; }

# 3. Extract the new dist
echo "Extracting new dist..."
tar -xzvf dist-v1.2.5.tar.gz -C /opt/hptourism/homestay/ || { echo "ERROR: Extraction failed. Exiting."; exit 1; }

# 4. Restart Process
echo "Restarting application using PM2..."
pm2 restart hptourism
pm2 save

echo "=== Deployment Complete ==="
echo "Please run 'pm2 status' and 'pm2 logs hptourism --lines 20' to verify health."
