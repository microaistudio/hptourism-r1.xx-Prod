#!/bin/bash

################################################################################
# SSL Certificate Setup Helper
# 
# This script helps set up SSL certificates using either:
# 1. Generate self-signed certificate (for testing)
# 2. Certbot (Let's Encrypt) - requires internet
# 3. Manual certificate files - for offline installations with real certs
################################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              SSL Certificate Setup                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo

echo "Select SSL setup method:"
echo "  [1] Generate self-signed certificate (for testing)"
echo "  [2] Use Certbot (Let's Encrypt) - requires internet"
echo "  [3] Use existing certificate files (production)"
echo "  [4] Skip SSL setup"
echo

read -p "Enter choice: " choice

case $choice in
    1)
        # Self-signed certificate for testing
        read -p "Enter domain name [localhost]: " domain
        domain=${domain:-localhost}
        
        print_info "Generating self-signed certificate for $domain..."
        
        mkdir -p /etc/ssl/certs /etc/ssl/private
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/ssl/private/homestay.key \
            -out /etc/ssl/certs/homestay.crt \
            -subj "/C=IN/ST=Himachal Pradesh/L=Shimla/O=HP Tourism/CN=$domain"
        
        chmod 644 /etc/ssl/certs/homestay.crt
        chmod 600 /etc/ssl/private/homestay.key
        
        print_success "Self-signed SSL certificate generated"
        print_warning "This certificate is for TESTING only. Browsers will show security warnings."
        print_info "Certificate: /etc/ssl/certs/homestay.crt"
        print_info "Key: /etc/ssl/private/homestay.key"
        
        # Export paths for use by installer
        echo "/etc/ssl/certs/homestay.crt"
        ;;
        
    2)
        # Certbot setup
        print_info "Installing Certbot..."
        
        if ! command -v certbot &> /dev/null; then
            apt update
            apt install -y certbot python3-certbot-nginx
        fi
        
        read -p "Enter domain name: " domain
        read -p "Enter email for certificate notifications: " email
        
        print_info "Obtaining SSL certificate..."
        certbot --nginx -d "$domain" --email "$email" --agree-tos --non-interactive
        
        print_success "SSL certificate obtained and configured"
        print_info "Certificate will auto-renew via cron"
        print_info "Certificate: /etc/letsencrypt/live/$domain/fullchain.pem"
        print_info "Key: /etc/letsencrypt/live/$domain/privkey.pem"
        
        # Export paths
        echo "/etc/letsencrypt/live/$domain/fullchain.pem"
        ;;
        
    3)
        # Manual certificate
        read -p "Enter path to SSL certificate (.crt/.pem): " cert_path
        read -p "Enter path to SSL private key (.key): " key_path
        
        if [[ ! -f "$cert_path" ]]; then
            print_error "Certificate file not found: $cert_path"
            exit 1
        fi
        
        if [[ ! -f "$key_path" ]]; then
            print_error "Key file not found: $key_path"
            exit 1
        fi
        
        # Copy to standard location
        mkdir -p /etc/ssl/certs /etc/ssl/private
        cp "$cert_path" /etc/ssl/certs/homestay.crt
        cp "$key_path" /etc/ssl/private/homestay.key
        chmod 644 /etc/ssl/certs/homestay.crt
        chmod 600 /etc/ssl/private/homestay.key
        
        print_success "SSL certificates installed"
        print_info "Certificate: /etc/ssl/certs/homestay.crt"
        print_info "Key: /etc/ssl/private/homestay.key"
        
        echo "/etc/ssl/certs/homestay.crt"
        ;;
        
    4)
        print_warning "Skipping SSL setup. Application will run on HTTP only."
        print_info "You can run this script later to configure SSL."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_success "SSL setup completed"
