#!/bin/bash

# HP Tourism PROD Audit Script
# Run this on the PROD VM to check status and upgrade compatibility.

echo "============================================"
echo "   HP TOURISM PROD ENVIRONMENT AUDIT"
echo "============================================"
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo ""

# 1. System Info
echo "[1] System Information"
echo "----------------------"
if command -v lsb_release &> /dev/null; then
    lsb_release -d
else
    cat /etc/os-release | grep PRETTY_NAME
fi
echo "Disk Usage (/): $(df -h / | awk 'NR==2 {print $5}')"
echo "Memory: $(free -h | grep Mem | awk '{print $2}') Total"
echo ""

# 2. Dependencies
echo "[2] Dependencies"
echo "----------------"
echo "Node.js: $(node -v 2>/dev/null || echo 'Not Found')"
echo "NPM: $(npm -v 2>/dev/null || echo 'Not Found')"
echo "PM2: $(pm2 -v 2>/dev/null || echo 'Not Found')"
echo "Nginx: $(nginx -v 2>&1 | awk -F'/' '{print $2}' || echo 'Not Found')"
if command -v psql &> /dev/null; then
    echo "PostgreSQL Client: $(psql --version)"
else
    echo "PostgreSQL Client: Not Found"
fi
# Check Postgres Service
if systemctl is-active --quiet postgresql; then
    echo "PostgreSQL Service: Active"
else
    echo "PostgreSQL Service: Inactive"
fi
echo ""

# 3. Application State
echo "[3] Application Check"
echo "---------------------"
INSTALL_PATH="/opt/hptourism/homestay"
if [ -d "$INSTALL_PATH" ]; then
    echo "Directory exists: $INSTALL_PATH"
    echo "Owner: $(stat -c '%U:%G' $INSTALL_PATH)"
    
    if [ -f "$INSTALL_PATH/.env" ]; then
        echo ".env File: Found"
        echo "Check Env Vars:"
        grep "^NODE_ENV" "$INSTALL_PATH/.env"
        grep "^PORT" "$INSTALL_PATH/.env"
        grep "^APP_URL" "$INSTALL_PATH/.env"
    else
        echo ".env File: MISSING"
    fi
else
    echo "Directory NOT found: $INSTALL_PATH"
    echo "Searching for alternatives..."
    find /opt -maxdepth 2 -name "hptourism" 2>/dev/null
fi
echo ""

# 4. Process Status (PM2)
echo "[4] PM2 Processes"
echo "-----------------"
pm2 list
echo ""

# 5. Database Check
echo "[5] Database Connectivity"
echo "-------------------------"
# Try to extract DB Creds from .env if possible, otherwise rely on peer/default
if [ -f "$INSTALL_PATH/.env" ]; then
    DB_URL=$(grep "^DATABASE_URL=" "$INSTALL_PATH/.env" | cut -d'=' -f2)
    # Basic check to see if database exists
    DB_NAME=$(echo "$DB_URL" | awk -F'/' '{print $NF}')
    DB_USER_RAW=$(echo "$DB_URL" | awk -F':' '{print $2}' | sed 's/\/\///')
    
    echo "Inferred DB Name: $DB_NAME"
    echo "Inferred DB User: $DB_USER_RAW"
    
    if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo "Database '$DB_NAME' EXISTS."
        COUNT=$(sudo -u postgres psql -d "$DB_NAME" -t -c "SELECT count(*) FROM users;" 2>/dev/null)
        if [ $? -eq 0 ]; then
             echo "User Count in DB: $COUNT (Connection Successful)"
        else
             echo "Connection Failed or Table Missing."
        fi
    else
        echo "Database '$DB_NAME' does NOT exist."
    fi
else
    echo "Skipping DB check (No .env file)"
fi
echo ""

# 6. Nginx Check
echo "[6] Nginx Configuration"
echo "-----------------------"
ls -l /etc/nginx/sites-enabled/
echo ""
echo "============================================"
echo "AUDIT COMPLETE"
