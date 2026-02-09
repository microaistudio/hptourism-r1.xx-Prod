#!/bin/bash
set -e

# Disaster Recovery Restore Script
# Usage: ./restore.sh <path_to_backup_directory>
# Example: ./restore.sh /mnt/nas/backups

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Backup directory path required${NC}"
    echo "Usage: $0 <path_to_backup_directory>"
    exit 1
fi

BACKUP_DIR="$1"
PROJECT_ROOT=$(pwd) # Assuming script is run from project root, or we can determine it
LOCAL_STORAGE_DIR="$PROJECT_ROOT/local-object-storage"
ENV_FILE="$PROJECT_ROOT/.env"

# Validate Backup Directory
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Directory $BACKUP_DIR does not exist${NC}"
    exit 1
fi

if [ ! -d "$BACKUP_DIR/db" ] || [ ! -d "$BACKUP_DIR/files" ] || [ ! -d "$BACKUP_DIR/config" ]; then
    echo -e "${RED}Error: Invalid backup structure. Expecting 'db', 'files', and 'config' subdirectories.${NC}"
    exit 1
fi

echo -e "${YELLOW}WARNING: This will OVERWRITE your current database, files, and configuration.${NC}"
echo -e "${YELLOW}Ensure you are running this on a fresh or non-production system.${NC}"
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# 1. Restore Configuration
echo -e "\n${GREEN}[1/3] Restoring Configuration...${NC}"
LATEST_ENV="$BACKUP_DIR/config/latest.env"
if [ -f "$LATEST_ENV" ]; then
    cp "$LATEST_ENV" "$ENV_FILE"
    echo "Restored .env from latest backup."
else
    # Try to find the newest .env file
    NEWEST_ENV=$(ls -t "$BACKUP_DIR/config/"*.env | head -n 1)
    if [ -n "$NEWEST_ENV" ]; then
        cp "$NEWEST_ENV" "$ENV_FILE"
        echo "Restored .env from $(basename "$NEWEST_ENV")"
    else
        echo -e "${RED}No .env backup found in $BACKUP_DIR/config${NC}"
    fi
fi

# 2. Restore Database
echo -e "\n${GREEN}[2/3] Restoring Database...${NC}"
# Load DB Config from the JUST RESTORED .env file (quick hack to get vars)
# Note: This relies on simple KEY=VALUE format
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

DB_URL=${DATABASE_URL:-}
if [ -z "$DB_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL not found in restored .env${NC}"
    echo "Please configure .env manually before restoring database."
else
    # Find latest DB dump
    LATEST_DB=$(ls -t "$BACKUP_DIR/db/"*_database.sql.gz | head -n 1)
    
    if [ -n "$LATEST_DB" ]; then
        echo "Restoring from $(basename "$LATEST_DB")..."
        
        # Parse DB connection details for psql (if simple URL)
        # For robustness, we assume psql can handle the URL directly if we pass it as argument
        
        # 1. Drop existing connections/tables (Optional, but safe for restore)
        # We assume empty DB for fresh restore, but let's try to just pipe input.
        
        echo "Importing SQL dump..."
        if gunzip -c "$LATEST_DB" | psql "$DB_URL"; then
            echo "Database restoration complete."
        else
            echo -e "${RED}Database restoration failed.${NC}"
            # Don't exit, might want to continue with files
        fi
    else
        echo -e "${RED}No database backup found in $BACKUP_DIR/db${NC}"
    fi
fi

# 3. Restore Files
echo -e "\n${GREEN}[3/3] Restoring Files (Rsync)...${NC}"
mkdir -p "$LOCAL_STORAGE_DIR"

if rsync -av "$BACKUP_DIR/files/" "$LOCAL_STORAGE_DIR/"; then
    echo "File restoration complete."
else
    echo -e "${RED}File restoration failed.${NC}"
fi

echo -e "\n${GREEN}Restore Process Finished.${NC}"
echo "Please restart your application to ensure all changes take effect."
