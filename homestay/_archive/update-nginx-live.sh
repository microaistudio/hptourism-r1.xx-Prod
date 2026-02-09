#!/bin/bash
# Nginx Update Script for HP Tourism (Security Fixes #3 & #6)

set -e

NGINX_CONF="/etc/nginx/sites-available/hptourism"

# Verify we are root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo)"
  exit 1
fi

echo "Updating Nginx configuration..."

# Create the new config
cat > "$NGINX_CONF" << 'EOF'
# HP Tourism Portal - Nginx Configuration
# Updated for Security Issues #3 and #6

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name 10.126.117.27 localhost _;

    # Security: Hide Nginx version (HPSDC Issue #6)
    server_tokens off;

    # Enable Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    gzip_proxied any;

    # Max upload size
    client_max_body_size 25M;

    # Security: Block sensitive files (HPSDC Issue #3)
    # Using ~* for case-insensitive matching
    location ~* /\.(env|git) {
        deny all;
        return 404;
    }
    location ~* \.(md|sql|sh|txt|log)$ {
        deny all;
        return 404;
    }

    # Proxy settings
    location / {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://127.0.0.1:5050;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }
}
EOF

echo "Testing configuration..."
nginx -t

echo "Reloading Nginx..."
systemctl reload nginx

echo "✅ Nginx updated successfully! (Issues #3 & #6 Patched)"
