#!/bin/bash
# HP Tourism Portal - Clean Install Script
# Wipes existing installation and database, then does fresh install
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${HPTOURISM_INSTALL_DIR:-/opt/hptourism}"
DB_NAME="${HPTOURISM_DB_NAME:-hptourism}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "============================================"
echo "  HP Tourism Portal - Clean Install"
echo "  Version: 0.7.7"
echo "============================================"
echo ""
echo -e "${RED}⚠️  WARNING: This will DELETE:${NC}"
echo "  - Database: $DB_NAME"
echo "  - Application: $APP_DIR"
echo "  - All uploaded files and data"
echo ""
read -p "Are you SURE you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# Check root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

# ============================================
# 1. Stop Application
# ============================================
log_info "Stopping application..."
pm2 delete hptourism 2>/dev/null || true
pm2 delete hptourism-rc5 2>/dev/null || true
pm2 delete hptourism-rc6 2>/dev/null || true
pm2 save 2>/dev/null || true

# ============================================
# 2. Drop Database
# ============================================
log_info "Dropping database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
    log_success "Database dropped"
else
    log_info "Database $DB_NAME does not exist, skipping"
fi

# Drop user (optional - keep for reuse)
# sudo -u postgres psql -c "DROP USER IF EXISTS hptourism_user;"

# ============================================
# 3. Remove Application Directory
# ============================================
log_info "Removing application directory..."
if [ -d "$APP_DIR" ]; then
    rm -rf "$APP_DIR"
    log_success "Application directory removed"
else
    log_info "Application directory does not exist, skipping"
fi

# ============================================
# 4. Remove Nginx Config
# ============================================
log_info "Removing Nginx config..."
rm -f /etc/nginx/sites-enabled/hptourism 2>/dev/null || true
rm -f /etc/nginx/sites-available/hptourism 2>/dev/null || true
nginx -t && systemctl reload nginx 2>/dev/null || true

log_success "Clean complete!"
echo ""
echo "============================================"
echo "  Starting Fresh Installation..."
echo "============================================"
echo ""

# Run fresh install
source "$SCRIPT_DIR/setup-fresh.sh"
