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
# User & Permissions Functions
################################################################################

create_service_user() {
    local user=$1
    print_info "Checking service user '$user'..."
    
    if id "$user" &>/dev/null; then
        print_success "User '$user' already exists"
    else
        print_info "Creating service user '$user'..."
        # Create user with home directory at /opt/$user if not specified
        useradd -r -m -d /opt/"$user" -s /bin/bash "$user"
        print_success "User '$user' created"
    fi
}

set_permissions() {
    local install_path=$1
    local user=$2
    print_info "Setting permissions for $install_path..."
    
    # Ensure parent directory exists
    mkdir -p "$(dirname "$install_path")"
    
    # Set ownership recursively
    chown -R "$user":"$user" "$install_path"
    
    # Set permissions (755 for dirs, 644 for files)
    find "$install_path" -type d -exec chmod 755 {} \;
    find "$install_path" -type f -exec chmod 644 {} \;
    
    # Make scripts executable
    chmod +x "$install_path/install.sh" 2>/dev/null || true
    
    print_success "Permissions set to $user:$user"
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

install_certbot() {
    if command -v certbot &> /dev/null; then
        print_success "Certbot already installed"
        return
    fi
    
    print_info "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
}

setup_letsencrypt() {
    local domain=$1
    local email=$2
    
    print_info "Setting up Let's Encrypt SSL for $domain..."
    
    # Check if we are reachable on port 80 (basic check)
    if ! curl -Is "http://$domain" >/dev/null; then
        print_warning "Domain $domain does not seem reachable locally. Ensure DNS is propagated."
    fi
    
    # Run Certbot
    # --nginx: Use Nginx plugin
    # --non-interactive: No prompts
    # --agree-tos: Agree to terms
    # --redirect: Force HTTPS
    # --register-unsafely-without-email: Use if no email provided (or use dummy)
    
    local email_arg="--register-unsafely-without-email"
    if [[ -n "$email" ]]; then
        email_arg="--email $email"
    fi
    
    if certbot --nginx -d "$domain" --non-interactive --agree-tos $email_arg --redirect; then
        print_success "Let's Encrypt SSL configured successfully!"
        return 0
    else
        print_error "Certbot failed to obtain certificate."
        print_warning "Falling back to self-signed certificate configuration..."
        return 1
    fi
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
    # IMPORTANT: Grant schema privileges to allow table creation
    sudo -u postgres psql -d "$db_name" -c "GRANT ALL ON SCHEMA public TO \"$db_user\"; ALTER SCHEMA public OWNER TO \"$db_user\";"
    
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

# Preserve existing .env configuration - CRITICAL for upgrades
preserve_env_config() {
    local install_path=$1
    local env_file="$install_path/.env"
    local backup_file="$install_path/.env.backup.$(date +%Y%m%d-%H%M%S)"
    
    if [[ -f "$env_file" ]]; then
        print_warning "Existing .env file found - creating backup..."
        cp "$env_file" "$backup_file"
        print_success "Backup created: $backup_file"
        
        # Extract custom configurations that should be preserved
        # These are configurations not in the default template
        echo "# Preserved Custom Configurations" > "$install_path/.env.preserved"
        
        # Preserve HPSSO configs
        grep "^HPSSO_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        
        # Preserve SMS configs  
        grep "^SMS_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^TWILIO_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^MSG91_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        
        # Preserve Email configs
        grep "^SMTP_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^EMAIL_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^MAIL_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        
        # Preserve any other custom configs (lines not matching standard template)
        grep "^LOG_TRACE" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^OBJECT_STORAGE" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^LOCAL_OBJECT" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        grep "^CAPTCHA_" "$env_file" >> "$install_path/.env.preserved" 2>/dev/null || true
        
        print_info "Custom configurations saved for restoration"
    fi
}

# Restore preserved configurations after new .env is created
restore_preserved_config() {
    local install_path=$1
    local preserved_file="$install_path/.env.preserved"
    local env_file="$install_path/.env"
    
    if [[ -f "$preserved_file" ]]; then
        print_info "Restoring preserved configurations..."
        echo "" >> "$env_file"
        echo "# === Restored Custom Configurations ===" >> "$env_file"
        cat "$preserved_file" >> "$env_file"
        rm -f "$preserved_file"
        print_success "Custom configurations restored (SSO, SMS, Email, etc.)"
    fi
}

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
    
    local nginx_config="/etc/nginx/sites-available/$domain"
    
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
    
    # Prompt for Service User
    read -p "Service User (runs app process) [hptourism]: " service_user
    service_user=${service_user:-hptourism}
    
    # Create service user first
    create_service_user "$service_user"
    
    # Prompt for configuration
    read -p "Install path [/opt/hptourism/homestay]: " install_path
    install_path=${install_path:-/opt/hptourism/homestay}
    
    read -p "Domain name [homestay.hp.gov.in]: " domain
    domain=${domain:-homestay.hp.gov.in}
    
    # Auto-detect standard port based on domain
    DEFAULT_PORT=5050
    if [[ "$domain" == "homestay.hp.gov.in" ]]; then
        DEFAULT_PORT=5050
        print_info "Detected PROD environment -> Defaulting to port 5050"
    elif [[ "$domain" == "hptourism.osipl.dev" ]]; then
        DEFAULT_PORT=5040
        print_info "Detected STG environment -> Defaulting to port 5040"
    elif [[ "$domain" == "dev.osipl.dev" ]]; then
        DEFAULT_PORT=5030
        print_info "Detected DEV environment -> Defaulting to port 5030"
    fi
    
    read -p "Port [$DEFAULT_PORT]: " port
    port=${port:-$DEFAULT_PORT}
    
    read -p "Database name [hptourism]: " db_name
    db_name=${db_name:-hptourism}
    
    read -p "Database username [hptourism_admin]: " db_user
    db_user=${db_user:-hptourism_admin}
    
    read -sp "Database password: " db_password
    echo
    
    # Validate Database Credentials immediately
    print_info "Verifying database credentials..."
    if ! PGPASSWORD="$db_password" psql -h localhost -U "$db_user" -c '\q' 2>/dev/null; then
        print_warning "Authentication failed for user '$db_user'."
        read -p "User '$db_user' might not exist. Do you want the installer to create this user? [Y/n]: " create_db_user_choice
        if [[ ! "$create_db_user_choice" =~ ^[Nn]$ ]]; then
             print_info "Installer will create user '$db_user' during installation."
        else
             print_error "Please restart and provide correct credentials."
             exit 1
        fi
    else
        print_success "Database credentials verified."
    fi
    
    read -p "Rate limit (requests/15min) [1000]: " rate_limit
    rate_limit=${rate_limit:-1000}
    
    read -p "Backup directory [/mnt/nas-backup/homestay]: " backup_path
    backup_path=${backup_path:-/mnt/nas-backup/homestay}
    
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
    # Copy only files that exist in the installer package
    for file in dist ecosystem.config.cjs package.json shared drizzle.config.ts Database node_modules; do
        if [ -e "$file" ]; then
            cp -r "$file" "$install_path/"
        fi
    done
    print_success "Application files copied"
    
    # Create database
    db_url="postgresql://$db_user:$db_password@localhost:5432/$db_name"
    create_database "$db_name" "$db_user" "$db_password"
    
    # CRITICAL: Preserve existing .env configurations before overwriting
    preserve_env_config "$install_path"
    
    # Create .env file
    create_env_file "$install_path" "$port" "$domain" "$db_url" "$rate_limit" "$backup_path"
    
    # Restore any preserved custom configurations (SSO, SMS, Email, etc.)
    restore_preserved_config "$install_path"
    
    # Run migrations
    print_info "Running database migrations..."
    cd "$install_path"
    
    # Drizzle Kit is needed for migrations but is a dev dependency
    print_info "Installing migration tools..."
    npm install drizzle-kit pg --no-save
    
    # Ensure ALL binaries in node_modules are executable (Critical for esbuild/drizzle)
    # Recursively +x avoids issues with symlinks and nested deps
    print_info "Fixing executable permissions..."
    chmod -R +x node_modules 2>/dev/null || true
    
    print_info "Pushing schema to database..."
    # Export env vars so drizzle.config.ts can read DATABASE_URL
    if export $(grep -v '^#' .env | xargs) && npm run db:push; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed!"
        print_warning "Review the error above. Ensure database credentials are correct."
        exit 1
    fi
    
    # Seed database with initial data
    seed_database "$install_path" "$db_name" "$db_user" "$seed_staff"
    
    # Configure SSL
    print_info "Configuring SSL..."
    
    echo -e "${YELLOW}Select SSL Configuration:${NC}"
    echo "  [1] Let's Encrypt (Certbot) - Requires Internet & Public DNS"
    echo "  [2] Self-Signed Certificate - For Offline/Internal Networks"
    echo "  [3] No SSL (HTTP Only)      - For running behind an External Proxy/Gateway"
    echo
    read -p "Enter choice [1]: " modules_choice
    modules_choice=${modules_choice:-1}
    
    case $modules_choice in
        1)
            # LET'S ENCRYPT
            print_info "Selected: Let's Encrypt"
            # Install Certbot if needed
            install_certbot
            
            # Configure Basic Nginx first (Port 80)
            cat > "/etc/nginx/sites-available/$domain" <<EOF
server {
    listen 80;
    server_name $domain;
    location / {
        proxy_pass http://localhost:$port;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
            ln -sf "/etc/nginx/sites-available/$domain" /etc/nginx/sites-enabled/
            systemctl reload nginx
            
            # Try Certbot
            if setup_letsencrypt "$domain" ""; then
                 print_success "SSL setup complete via Let's Encrypt"
            else
                 print_error "Let's Encrypt failed. Falling back to Self-Signed."
                 print_warning "Review network/DNS settings."
                 configure_nginx "$domain" "$port" "$ssl_cert" "$ssl_key"
            fi
            ;;
            
        2)
            # SELF-SIGNED
            print_info "Selected: Self-Signed Certificate"
            if [[ -f "$ssl_cert" && -f "$ssl_key" ]]; then
                configure_nginx "$domain" "$port" "$ssl_cert" "$ssl_key"
            else
                print_warning "SSL certificates not found matching defaults."
                print_info "Please ensure $ssl_cert and $ssl_key exist."
                # Fallback to bare Nginx if certs missing, or maybe gen them?
                # For now, just warn and configure standard HTTP temporarily
                print_warning "Skipping Nginx SSL config due to missing files."
            fi
            ;;
            
        3)
            # HTTP ONLY (Proxy Mode)
            print_info "Selected: HTTP Only (Proxy Mode)"
            # Configure Nginx for Port 80 only
            cat > "/etc/nginx/sites-available/$domain" <<EOF
server {
    listen 80;
    server_name $domain;
    
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
            ln -sf "/etc/nginx/sites-available/$domain" /etc/nginx/sites-enabled/
            nginx -t && systemctl reload nginx
            print_success "Nginx configured for HTTP Only (Port 80)"
            ;;
            
        *)
            print_error "Invalid choice. Skipping SSL configuration."
            ;;
    esac
    
    # Create production PM2 ecosystem config
    print_info "Creating PM2 configuration..."
    cat > "$install_path/ecosystem.production.cjs" <<PMEOF
module.exports = {
  apps: [{
    name: 'hptourism-prod',
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
    
    # Set permissions for service user
    set_permissions "$install_path" "$service_user"
    
    # Start application with PM2 as service user
    print_info "Starting application with PM2 (as $service_user)..."
    cd "$install_path"
    
    # Ensure service user can write to PM2 directory
    mkdir -p /opt/"$service_user"/.pm2
    chown -R "$service_user":"$service_user" /opt/"$service_user"/.pm2
    
    # Start PM2 as service user using robust CLI args (bypassing ecosystem file issues)
    # This explicit command ensures the process is named correctly and env vars are passed
    sudo -u "$service_user" bash -c "cd $install_path && \
    PORT=$port \
    NODE_ENV=production \
    pm2 start ./dist/index.js \
    --name hptourism-prod \
    --log-date-format 'YYYY-MM-DD HH:mm:ss Z' \
    --output ./logs/out.log \
    --error ./logs/error.log \
    --update-env"
    
    sudo -u "$service_user" pm2 save
    
    # Setup startup script for service user
    print_info "Configuring PM2 startup for $service_user..."
    env PATH=$PATH:/usr/bin pm2 startup systemd -u "$service_user" --hp /opt/"$service_user" | tail -n 1 | bash 2>/dev/null || true
    
    # ========== STARTUP VERIFICATION ==========
    print_info "Verifying application startup..."
    
    # Wait for port to bind (max 30 seconds)
    MAX_RETRIES=10
    RETRY_DELAY=3
    PORT_BOUND=false
    
    for i in $(seq 1 $MAX_RETRIES); do
        if ss -tlpn | grep -q ":$port "; then
            PORT_BOUND=true
            break
        fi
        print_warning "Waiting for port $port... (attempt $i/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    done
    
    if [ "$PORT_BOUND" = false ]; then
        print_error "FATAL: Application failed to bind to port $port after 30 seconds!"
        print_error "Check logs: sudo -u $service_user pm2 logs hptourism-prod"
        sudo -u "$service_user" pm2 logs hptourism-prod --lines 20 --nostream
        exit 1
    fi
    
    print_success "Port $port is bound"
    
    # Health check - test HTTP response
    sleep 2  # Allow app to fully initialize
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:$port/" 2>/dev/null || echo "000")
    
    if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "302" ]]; then
        print_success "Health check passed (HTTP $HTTP_CODE)"
    else
        print_error "FATAL: Health check failed (HTTP $HTTP_CODE)!"
        print_error "Application is running but not responding correctly."
        sudo -u "$service_user" pm2 logs hptourism-prod --lines 20 --nostream
        exit 1
    fi
    
    print_success "Application started and verified on port $port"
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              INSTALLATION COMPLETE  ✅                       ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  Application:   HP Tourism Homestay Portal"
    echo -e "  Status:        ${GREEN}Running${NC}"
    echo -e "  Service User:  $service_user"
    echo -e "  Port:          $port"
    echo -e "  Domain:        https://$domain"
    echo -e "  Database:      $db_name"
    echo ""
    echo -e "${BLUE}ℹ Access URL:    https://$domain${NC}"
    echo -e "${BLUE}ℹ Local Access:  http://localhost:$port${NC}"
    echo -e "${BLUE}ℹ View Logs:     sudo -u $service_user pm2 logs hptourism-prod${NC}"
    echo -e "${BLUE}ℹ Check Status:  sudo -u $service_user pm2 status${NC}"
    echo ""
}

################################################################################
# Update Installation
################################################################################

update_installation() {
    print_header
    echo -e "${YELLOW}Starting Update Process${NC}\n"
    
    # Prompt for Service User (for updates, default to existing if known, else prompt)
    read -p "Service User (runs app process) [hptourism]: " service_user
    service_user=${service_user:-hptourism}
    
    # Ensure service user exists
    create_service_user "$service_user"
    
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
    
    # Stop PM2 (Handle migration from root to service user)
    print_info "Stopping application..."
    # Try stopping as current user (root) - handles legacy setup
    pm2 stop hptourism-prod 2>/dev/null || true
    pm2 delete hptourism-prod 2>/dev/null || true
    # Try stopping as service user - handles proper setup
    sudo -u "$service_user" pm2 stop hptourism-prod 2>/dev/null || true
    sudo -u "$service_user" pm2 delete hptourism-prod 2>/dev/null || true
    
    # Update files
    print_info "Updating application files..."
    cp -r dist node_modules package.json package-lock.json shared "$install_path/"
    
    # Set permissions (Critical step for migration)
    set_permissions "$install_path" "$service_user"
    
    # Run migrations
    print_info "Running database migrations..."
    cd "$install_path"
    npm run db:push
    
    # Re-seed admin accounts
    print_info "Updating system accounts..."
    if [[ -f "$install_path/.env" ]]; then
        db_url=$(grep "^DATABASE_URL=" "$install_path/.env" | cut -d'=' -f2)
        # Extract last part after /
        db_name=$(echo "$db_url" | awk -F'/' '{print $NF}')
        
        if [[ -n "$db_name" && -f "$install_path/Database/admin_accounts_seed.sql" ]]; then
             sudo -u postgres psql -d "$db_name" -f "$install_path/Database/admin_accounts_seed.sql"
             print_success "System accounts updated"
        fi
    fi
    
    # Get port from .env
    port=$(grep "^PORT=" "$install_path/.env" | cut -d'=' -f2)
    port=${port:-5050}
    
    # Restart PM2 as service user
    print_info "Restarting application (as $service_user)..."
    cd "$install_path"
    
    # Ensure PM2 dir permissions
    mkdir -p /opt/"$service_user"/.pm2
    chown -R "$service_user":"$service_user" /opt/"$service_user"/.pm2
    
    sudo -u "$service_user" pm2 start ./dist/index.js --name hptourism-prod --cwd "$install_path" -i 1 --time
    sudo -u "$service_user" pm2 save
    
    # Ensure startup script is set for service user
    env PATH=$PATH:/usr/bin pm2 startup systemd -u "$service_user" --hp /opt/"$service_user" | tail -n 1 | bash 2>/dev/null || true
    
    # ========== STARTUP VERIFICATION ==========
    print_info "Verifying application startup..."
    
    MAX_RETRIES=10
    RETRY_DELAY=3
    PORT_BOUND=false
    
    for i in $(seq 1 $MAX_RETRIES); do
        if ss -tlpn | grep -q ":$port "; then
            PORT_BOUND=true
            break
        fi
        print_warning "Waiting for port $port... (attempt $i/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    done
    
    if [ "$PORT_BOUND" = false ]; then
        print_error "FATAL: Application failed to bind to port $port!"
        sudo -u "$service_user" pm2 logs hptourism-prod --lines 20 --nostream
        exit 1
    fi
    
    sleep 2
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:$port/" 2>/dev/null || echo "000")
    
    if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "302" ]]; then
        print_success "Health check passed (HTTP $HTTP_CODE)"
    else
        print_error "FATAL: Health check failed (HTTP $HTTP_CODE)!"
        sudo -u "$service_user" pm2 logs hptourism-prod --lines 20 --nostream
        exit 1
    fi
    
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
