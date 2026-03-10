#!/bin/bash
# =============================================================================
# PROD FIX: Missing React Imports in DTDO Dashboard
# =============================================================================
# 
# Issue: dashboard.tsx uses useState, useMemo, useCallback, useEffect, useQuery,
#        useQueryClient but imports are missing, causing "useState is not defined"
#
# This is a PERMANENT fix that modifies the source file correctly.
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  DTDO Dashboard Fix - Missing Imports ${NC}"
echo -e "${YELLOW}========================================${NC}"

# Get the directory where the script is run (should be homestay root)
HOMESTAY_DIR="${1:-$(pwd)}"
DASHBOARD_FILE="$HOMESTAY_DIR/client/src/pages/dtdo/dashboard.tsx"

# Verify the file exists
if [ ! -f "$DASHBOARD_FILE" ]; then
    echo -e "${RED}ERROR: Cannot find dashboard.tsx at:${NC}"
    echo -e "${RED}  $DASHBOARD_FILE${NC}"
    echo ""
    echo "Usage: ./fix_dtdo_dashboard.sh /path/to/homestay"
    exit 1
fi

# Check if the fix is already applied
if grep -q 'import { useState, useMemo, useCallback, useEffect' "$DASHBOARD_FILE"; then
    echo -e "${GREEN}✓ Fix already applied! React imports are present.${NC}"
    echo ""
    echo "If you're still seeing issues, try rebuilding:"
    echo "  cd $HOMESTAY_DIR && npm run build && pm2 restart <process-name>"
    exit 0
fi

echo -e "📁 Target file: $DASHBOARD_FILE"
echo ""

# Create backup
BACKUP_FILE="$DASHBOARD_FILE.backup.$(date +%Y%m%d_%H%M%S)"
cp "$DASHBOARD_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"

# The fix: Add imports after the districtRouting import (line 23)
# We need to add these two lines:
#   import { useState, useMemo, useCallback, useEffect, type KeyboardEvent } from "react";
#   import { useQuery, useQueryClient } from "@tanstack/react-query";

# Use sed to insert after the districtRouting import line
sed -i '/import { getDisplayDistrictLabel } from "@shared\/districtRouting";/a\
import { useState, useMemo, useCallback, useEffect, type KeyboardEvent } from "react";\
import { useQuery, useQueryClient } from "@tanstack\/react-query";' "$DASHBOARD_FILE"

# Verify the fix was applied
if grep -q 'import { useState, useMemo, useCallback, useEffect' "$DASHBOARD_FILE"; then
    echo -e "${GREEN}✓ React imports added successfully!${NC}"
else
    echo -e "${RED}ERROR: Failed to add imports. Restoring backup...${NC}"
    cp "$BACKUP_FILE" "$DASHBOARD_FILE"
    exit 1
fi

if grep -q 'import { useQuery, useQueryClient }' "$DASHBOARD_FILE"; then
    echo -e "${GREEN}✓ TanStack Query imports added successfully!${NC}"
else
    echo -e "${RED}ERROR: Failed to add TanStack imports. Restoring backup...${NC}"
    cp "$BACKUP_FILE" "$DASHBOARD_FILE"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  FIX APPLIED SUCCESSFULLY!            ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "  1. Rebuild the frontend:"
echo -e "     ${GREEN}cd $HOMESTAY_DIR && npm run build${NC}"
echo ""
echo "  2. Restart the PM2 process:"
echo -e "     ${GREEN}pm2 restart <your-prod-process-name>${NC}"
echo ""
echo "  3. Test the DTDO login at your PROD URL"
echo ""
echo -e "Backup saved at: ${YELLOW}$BACKUP_FILE${NC}"
echo ""
