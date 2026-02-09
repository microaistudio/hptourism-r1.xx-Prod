#!/bin/bash

################################################################################
# HP Tourism Homestay Portal - Uninstall Script
# 
# This script completely removes the HPTourism installation from a specified
# environment (TST/DEV/PROD compatible).
#
# Usage: sudo bash uninstall.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper Functions
print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           HP TOURISM - HOMESTAY PORTAL UNARINSTALLER         ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

check_root

print_header
echo -e "${RED}WARNING: This script will DESTROY data!${NC}"
echo -e "It will verify details before proceeding.\n"

# 1. Gather Information
read -p "Service User (runs app process) [hptourism-tst]: " service_user
service_user=${service_user:-hptourism-tst}

read -p "Install path [/opt/hptourism/homestay]: " install_path
install_path=${install_path:-/opt/hptourism/homestay}

read -p "PM2 Process Name [hptourism-prod]: " pm2_name
pm2_name=${pm2_name:-hptourism-prod}

read -p "Database Name to DROP [hptourism-tst]: " db_name
db_name=${db_name:-hptourism-tst}

# Default DB user is usually same as DB name in our scripts, but allow override
read -p "Database Owner User to DROP [hptourism-tst]: " db_user
db_user=${db_user:-$db_name} 

read -p "Nginx Domain to remove (e.g. hptourism.osipl.dev): " domain
domain=${domain:-hptourism.osipl.dev}

echo -e "\n${YELLOW}REVIEW DESTRUCTION PLAN:${NC}"
echo "------------------------------------------------"
echo -e "  Service User:  ${RED}$service_user${NC}"
echo -e "  PM2 Process:   ${RED}$pm2_name${NC}"
echo -e "  Install Path:  ${RED}$install_path${NC}"
echo -e "  Database:      ${RED}$db_name${NC} (and user ${RED}$db_user${NC})"
echo -e "  Nginx Config:  ${RED}/etc/nginx/sites-available/$domain${NC}"
echo "------------------------------------------------"
read -p "Type 'DESTROY' (all caps) to proceed: " confirm
if [[ "$confirm" != "DESTROY" ]]; then
    print_error "Aborted by user."
    exit 0
fi

# 2. Stop & Delete PM2 Process
print_info "Stopping PM2 process..."
if id "$service_user" &>/dev/null; then
    # Try stopping/deleting as the service user
    sudo -u "$service_user" pm2 delete "$pm2_name" 2>/dev/null || true
    sudo -u "$service_user" pm2 save 2>/dev/null || true
    
    # Also try global stop just in case
    pm2 delete "$pm2_name" 2>/dev/null || true
    print_success "PM2 process stopped/deleted"
else
    print_warning "Service user '$service_user' usually runs PM2, but user not found. Skipping user-specific PM2 stop."
fi

# 3. Remove Application Files
if [[ -d "$install_path" ]]; then
    print_info "Removing installation directory..."
    # Backup logs just in case? No, "fully test new build" usually implies clean slate.
    rm -rf "$install_path"
    print_success "Directory $install_path removed"
else
    print_warning "Directory $install_path not found, skipping."
fi

# 4. Drop Database & DB User
print_info "Dropping Database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
    sudo -u postgres psql -c "DROP DATABASE \"$db_name\";" 2>/dev/null || true
    print_success "Database $db_name dropped"
else
    print_warning "Database $db_name not found."
fi

print_info "Dropping Database User..."
if sudo -u postgres psql -t -c '\du' | cut -d \| -f 1 | grep -qw "$db_user"; then
    sudo -u postgres psql -c "DROP USER \"$db_user\";" 2>/dev/null || true
    print_success "Database user $db_user dropped"
else
    print_warning "Database user $db_user not found."
fi

# 5. Remove Nginx Config
print_info "Removing Nginx configuration..."
if [[ -f "/etc/nginx/sites-available/$domain" ]]; then
    rm -f "/etc/nginx/sites-enabled/$domain"
    rm -f "/etc/nginx/sites-available/$domain"
    nginx -t && systemctl reload nginx
    print_success "Nginx config removed and reloaded"
else
    print_warning "Nginx config for $domain not found."
fi

# 6. Optional: Remove SSL Certs
read -p "Remove Let's Encrypt certificates for $domain? [y/N]: " remove_certs
if [[ "$remove_certs" =~ ^[Yy]$ ]]; then
    print_info "Removing certificates..."
    certbot delete --cert-name "$domain" --non-interactive 2>/dev/null || true
    print_success "Certificates removed (if existed)"
fi

# 7. Optional: Remove Service User
read -p "Remove System User '$service_user' completely? [y/N]: " remove_user
if [[ "$remove_user" =~ ^[Yy]$ ]]; then
    if id "$service_user" &>/dev/null; then
        print_info "Removing user $service_user..."
        # Kill any processes owned by user
        pkill -u "$service_user" 2>/dev/null || true
        # Remove user and home directory
        userdel -r "$service_user" 2>/dev/null || true
        # Remove PM2 folder just in case userdel didn't catch it
        rm -rf /opt/"$service_user" 2>/dev/null || true
        print_success "User $service_user removed"
    else
        print_warning "User $service_user not found."
    fi
fi

print_header
echo -e "${GREEN}Cleanup Complete!${NC}"
echo "You can now run install.sh to test a fresh installation."
