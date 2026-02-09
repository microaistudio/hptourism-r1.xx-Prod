#!/bin/bash
DOMAIN="dev1.osipl.dev"
PORT="5060"
CONFIG_FILE="/etc/nginx/sites-available/$DOMAIN"

echo "Updating Nginx for $DOMAIN to proxy to port $PORT..."

cat > "$CONFIG_FILE" <<EOF
server {
    server_name $DOMAIN;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    server_tokens off;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Allow large file uploads
        client_max_body_size 50M;
        
        # Proxy Headers
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    if (\$host = $DOMAIN) {
        return 301 https://\$host\$request_uri;
    } 

    listen 80;
    server_name $DOMAIN;
    return 404; 
}
EOF

ln -sf "$CONFIG_FILE" /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "Nginx updated successfully!"
