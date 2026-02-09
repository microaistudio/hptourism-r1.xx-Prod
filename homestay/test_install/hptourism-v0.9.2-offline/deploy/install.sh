#!/bin/bash

################################################################################
# HP Tourism Homestay Portal - Installer Script (R1)
# 
# This script provides a complete installation, update, backup, and uninstall
# workflow for the HP Tourism Homestay Portal application.
#
# Usage: sudo bash install.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
LOG_FILE="/var/log/hptourism-install.log"
exec > >(tee -a "$LOG_FILE") 2>&1

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           HP TOURISM - HOMESTAY PORTAL INSTALLER             ║"
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

check_system_requirements() {
    print_info "Checking system requirements..."
    
    # Check OS
    if ! grep -q "Ubuntu\|Debian" /etc/os-release; then
        print_warning "This installer is designed for Ubuntu/Debian. Proceed with caution."
    fi
    
    # Check RAM
    total_ram=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $total_ram -lt 4 ]]; then
        print_warning "System has less than 4GB RAM. Application may run slowly."
    fi
    
    # Check disk space
    available_space=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
    if [[ $available_space -lt 20 ]]; then
        print_error "Insufficient disk space. At least 20GB required."
        exit 1
    fi
    
    print_success "System requirements check passed"
}

generate_random_secret() {
    openssl rand -hex 32
}

################################################################################
# Installation Functions
################################################################################

install_postgresql() {
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL already installed"
        return
    fi
    
    print_info "Installing PostgreSQL..."
    apt update
    apt install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    print_success "PostgreSQL installed"
}

install_nodejs() {
    if command -v node &> /dev/null; then
        node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $node_version -ge 20 ]]; then
            print_success "Node.js $(node -v) already installed"
            return
        else
            print_warning "Node.js $(node -v) found but Node 20+ is required"
        fi
    fi
    
    print_info "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    print_success "Node.js $(node -v) installed"
}

install_nginx() {
    if command -v nginx &> /dev/null; then
        print_success "Nginx already installed"
        return
    fi
    
    print_info "Installing Nginx..."
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed"
}

install_pm2() {
    if command -v pm2 &> /dev/null; then
        print_success "PM2 already installed"
        return
    fi
    
    print_info "Installing PM2..."
    npm install -g pm2
    print_success "PM2 installed"
}

################################################################################
# Database Functions
################################################################################

create_database() {
    local db_name=$1
    local db_user=$2
    local db_password=$3
    
    print_info "Creating database and user..."
    
    # Create user (quoted to handle special characters)
    sudo -u postgres psql -c "CREATE USER \"$db_user\" WITH PASSWORD '$db_password';" 2>/dev/null || true
    
    # Create database (quoted to handle hyphens and special characters)
    sudo -u postgres psql -c "CREATE DATABASE \"$db_name\" OWNER \"$db_user\";" 2>/dev/null || true
    
    # Grant privileges (quoted identifiers)
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$db_name\" TO \"$db_user\";"
    
    print_success "Database '$db_name' created"
}

drop_database() {
    local db_name=$1
    
    print_info "Dropping database '$db_name'..."
    sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"$db_name\";"
    print_success "Database dropped"
}

seed_database() {
    local install_path=$1
    local db_name=$2
    local db_user=$3
    local seed_staff=$4
    
    print_info "Seeding database with initial data..."
    
    # Check if Database folder exists
    if [[ -d "$install_path/Database" ]]; then
        # Seed admin accounts (Always seed admins)
        if [[ -f "$install_path/Database/admin_accounts_seed.sql" ]]; then
            sudo -u postgres psql -d "$db_name" -f "$install_path/Database/admin_accounts_seed.sql"
            print_success "Admin accounts seeded"
        fi
        
        # Seed DDO codes (Always seed DDO codes)
        if [[ -f "$install_path/Database/ddo_codes_seed.sql" ]]; then
            sudo -u postgres psql -d "$db_name" -f "$install_path/Database/ddo_codes_seed.sql"
            print_success "DDO codes seeded"
        fi
        
        # Seed district staff (Optional)
        if [[ "$seed_staff" == "true" ]]; then
            if [[ -f "$install_path/Database/district_staff_seed.sql" ]]; then
                print_info "Seeding district staff accounts..."
                sudo -u postgres psql -d "$db_name" -f "$install_path/Database/district_staff_seed.sql"
                print_success "District staff seeded"
            fi
        else
            print_info "Skipping district staff seeding (User opted out)"
        fi
    else
        print_warning "Database folder not found. Skipping seeding."
    fi
    
    print_success "Database seeding completed"
}

################################################################################
# Configuration Functions
################################################################################

create_env_file() {
    local install_path=$1
    local port=$2
    local domain=$3
    local db_url=$4
    local rate_limit=$5
    local backup_path=$6
    
    local session_secret=$(generate_random_secret)
    
    cat > "$install_path/.env" <<EOF
# Database
DATABASE_URL=$db_url

# Application
NODE_ENV=production
PORT=$port
SESSION_SECRET=$session_secret

# Domain
APP_URL=https://$domain

# Rate Limiting
RATE_LIMIT_GLOBAL=$rate_limit
RATE_LIMIT_AUTH=100
RATE_LIMIT_UPLOAD=50

# Backup
BACKUP_PATH=$backup_path

# Logging
LOG_LEVEL=info
EOF

    print_success ".env file created"
}

configure_nginx() {
    local domain=$1
    local port=$2
    local ssl_cert=$3
    local ssl_key=$4
    
    local nginx_config="/etc/nginx/sites-available/hptourism"
    
    cat > "$nginx_config" <<EOF
server {
    listen 80;
    server_name $domain;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $domain;

    ssl_certificate $ssl_cert;
    ssl_certificate_key $ssl_key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:$port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    ln -sf "$nginx_config" /etc/nginx/sites-enabled/
    nginx -t && systemctl reload nginx
    
    print_success "Nginx configured for $domain"
}

################################################################################
# Fresh Installation
################################################################################

fresh_installation() {
    print_header
    echo -e "${GREEN}Starting Fresh Installation${NC}\n"
    
    # Prompt for configuration
    read -p "Install path [/opt/hptourism/homestay]: " install_path
    install_path=${install_path:-/opt/hptourism/homestay}
    
    read -p "Domain name [homestay.hp.gov.in]: " domain
    domain=${domain:-homestay.hp.gov.in}
    
    read -p "Port [5050]: " port
    port=${port:-5050}
    
    read -p "Database name [hptourism]: " db_name
    db_name=${db_name:-hptourism}
    
    read -p "Database username [hptourism_admin]: " db_user
    db_user=${db_user:-hptourism_admin}
    
    read -sp "Database password: " db_password
    echo
    
    read -p "Rate limit (requests/15min) [1000]: " rate_limit
    rate_limit=${rate_limit:-1000}
    
    read -p "Backup directory [/mnt/nas-backup/homestay]: " backup_path
    backup_path=${backup_path:-/mnt/nas-backup/homestay}
    
    read -p "SSL certificate path [/etc/ssl/certs/homestay.crt]: " ssl_cert
    ssl_cert=${ssl_cert:-/etc/ssl/certs/homestay.crt}
    
    read -p "SSL key path [/etc/ssl/private/homestay.key]: " ssl_key
    ssl_key=${ssl_key:-/etc/ssl/private/homestay.key}
    
    read -p "Seed dummy DA/DTDO accounts? [y/N]: " seed_choice
    if [[ "$seed_choice" =~ ^[Yy]$ ]]; then
        seed_staff="true"
    else
        seed_staff="false"
    fi
    
    # Check system requirements
    check_system_requirements
    
    # Install dependencies
    install_postgresql
    install_nodejs
    install_nginx
    install_pm2
    
    # Create installation directory
    mkdir -p "$install_path"
    
    # Copy application files
    print_info "Copying application files..."
    cp -r dist node_modules package.json package-lock.json shared drizzle.config.ts ecosystem.config.cjs Database migrations "$install_path/"
    print_success "Application files copied"
    
    # Create database
    db_url="postgresql://$db_user:$db_password@localhost:5432/$db_name"
    create_database "$db_name" "$db_user" "$db_password"
    
    # Create .env file
    create_env_file "$install_path" "$port" "$domain" "$db_url" "$rate_limit" "$backup_path"
    
    # Run migrations
    print_info "Running database migrations..."
    cd "$install_path"
    npm run db:push
    print_success "Database migrations completed"
    
    # Seed database with initial data
    seed_database "$install_path" "$db_name" "$db_user" "$seed_staff"
    
    # Configure Nginx
    if [[ -f "$ssl_cert" && -f "$ssl_key" ]]; then
        configure_nginx "$domain" "$port" "$ssl_cert" "$ssl_key"
    else
        print_warning "SSL certificates not found. Skipping Nginx configuration."
        print_info "You can configure SSL later using certbot or manual certificates."
    fi
    
    # Create production PM2 ecosystem config
    print_info "Creating PM2 configuration..."
    cat > "$install_path/ecosystem.production.cjs" <<PMEOF
module.exports = {
  apps: [{
    name: 'hptourism',
    script: './dist/index.js',
    cwd: '$install_path',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: $port
    },
    max_memory_restart: '500M',
    error_file: '$install_path/logs/error.log',
    out_file: '$install_path/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
PMEOF
    
    # Create logs directory
    mkdir -p "$install_path/logs"
    
    # Start application with PM2
    print_info "Starting application with PM2..."
    cd "$install_path"
    # Start app using the config file correctly
    pm2 start ecosystem.production.cjs
    pm2 save
    pm2 startup | tail -n 1 | bash 2>/dev/null || true
    print_success "Application started on port $port"
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              INSTALLATION COMPLETE                           ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}ℹ Access your application at: https://$domain${NC}"
    echo -e "${BLUE}ℹ Direct access: http://localhost:$port${NC}"
    echo -e "${BLUE}ℹ Logs: pm2 logs hptourism${NC}"
    echo -e "${BLUE}ℹ Status: pm2 status${NC}"
    echo ""
}

################################################################################
# Update Installation
################################################################################

update_installation() {
    print_header
    echo -e "${YELLOW}Starting Update Process${NC}\n"
    
    read -p "Installation path [/opt/hptourism/homestay]: " install_path
    install_path=${install_path:-/opt/hptourism/homestay}
    
    if [[ ! -d "$install_path" ]]; then
        print_error "Installation not found at $install_path"
        exit 1
    fi
    
    # Create backup
    backup_dir="/tmp/hptourism-backup-$(date +%Y%m%d-%H%M%S)"
    print_info "Creating backup at $backup_dir..."
    cp -r "$install_path" "$backup_dir"
    print_success "Backup created"
    
    # Stop PM2
    print_info "Stopping application..."
    pm2 stop hptourism-rc8 || true
    
    # Update files
    print_info "Updating application files..."
    cp -r dist node_modules package.json package-lock.json shared "$install_path/"
    
    # Run migrations
    print_info "Running database migrations..."
    cd "$install_path"
    npm run db:push
    
    # Restart PM2
    print_info "Restarting application..."
    pm2 restart hptourism-rc8
    pm2 save
    
    print_success "Update completed successfully!"
    print_info "Backup saved at: $backup_dir"
}

################################################################################
# Restore from Backup
################################################################################

restore_from_backup() {
    print_header
    echo -e "${BLUE}Restore from Backup${NC}\n"
    
    read -p "Backup directory path: " backup_dir
    
    if [[ ! -d "$backup_dir" ]]; then
        print_error "Backup directory not found"
        exit 1
    fi
    
    read -p "Restore to path [/opt/hptourism/homestay]: " install_path
    install_path=${install_path:-/opt/hptourism/homestay}
    
    # Stop PM2
    pm2 stop hptourism-rc8 || true
    
    # Restore files
    print_info "Restoring application files..."
    rm -rf "$install_path"
    cp -r "$backup_dir" "$install_path"
    
    # Restart PM2
    print_info "Restarting application..."
    cd "$install_path"
    pm2 start ecosystem.config.cjs --env production
    pm2 save
    
    print_success "Restore completed successfully!"
}

################################################################################
# Uninstall / Clean
################################################################################

uninstall() {
    print_header
    echo -e "${RED}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    UNINSTALL / CLEAN                         ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║                                                              ║"
    echo "║  ⚠️  WARNING: This will remove ALL data!                     ║"
    echo "║                                                              ║"
    echo "║  [x] Stop and remove PM2 process                             ║"
    echo "║  [x] Drop database                                           ║"
    echo "║  [x] Remove application files                                ║"
    echo "║  [x] Remove Nginx config                                     ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    read -p "Type 'DELETE' to confirm: " confirmation
    
    if [[ "$confirmation" != "DELETE" ]]; then
        print_info "Uninstall cancelled"
        exit 0
    fi
    
    read -p "Installation path [/opt/hptourism/homestay]: " install_path
    install_path=${install_path:-/opt/hptourism/homestay}
    
    read -p "Database name [hptourism]: " db_name
    db_name=${db_name:-hptourism}
    
    # Stop and remove PM2
    print_info "Stopping PM2 process..."
    pm2 stop hptourism-rc8 || true
    pm2 delete hptourism-rc8 || true
    pm2 save
    
    # Drop database
    drop_database "$db_name"
    
    # Remove application files
    print_info "Removing application files..."
    rm -rf "$install_path"
    
    # Remove Nginx config
    print_info "Removing Nginx configuration..."
    rm -f /etc/nginx/sites-enabled/hptourism
    rm -f /etc/nginx/sites-available/hptourism
    nginx -t && systemctl reload nginx
    
    print_success "Uninstall completed"
}

################################################################################
# Main Menu
################################################################################

main_menu() {
    print_header
    echo
    echo "  [1] Fresh Installation"
    echo "  [2] Update Existing Installation"
    echo "  [3] Restore from Backup"
    echo "  [4] Uninstall / Clean Old Setup"
    echo "  [5] Exit"
    echo
    read -p "  Enter choice: " choice
    echo
    
    case $choice in
        1)
            fresh_installation
            ;;
        2)
            update_installation
            ;;
        3)
            restore_from_backup
            ;;
        4)
            uninstall
            ;;
        5)
            print_info "Exiting installer. Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

################################################################################
# Entry Point
################################################################################

check_root
main_menu
