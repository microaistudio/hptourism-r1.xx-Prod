# Production Deployment Guide - v0.9.5
## Target: homestay.hp.gov.in

> [!IMPORTANT]
> This guide assumes the PROD server has v0.8.6 running at `/opt/hptourism`. Follow steps in order.

---

## Phase 1: Pre-Deployment Checks (5 min)

SSH into PROD server and run these checks:

```bash
# 1. Verify current app is running
pm2 list
curl -s -o /dev/null -w "%{http_code}" http://localhost:5060/

# 2. Check disk space (need ~500MB for backup + new package)
df -h /opt

# 3. Note the current Nginx config (for SSL paths)
cat /etc/nginx/sites-enabled/homestay* | grep ssl_certificate
```

---

## Phase 2: Create FULL Backup (10 min)

```bash
# Create dated backup folder
BACKUP_DIR="/opt/backup/hptourism-$(date +%Y%m%d-%H%M)"
sudo mkdir -p "$BACKUP_DIR"

# 1. Backup application files
sudo cp -r /opt/hptourism "$BACKUP_DIR/app"
echo "✓ App files backed up"

# 2. Backup database
sudo -u postgres pg_dump hptourism > "$BACKUP_DIR/database.sql"
echo "✓ Database backed up"

# 3. Backup Nginx config
sudo cp /etc/nginx/sites-available/homestay* "$BACKUP_DIR/" 2>/dev/null || true
echo "✓ Nginx config backed up"

# 4. Save PM2 process list
pm2 save
sudo cp ~/.pm2/dump.pm2 "$BACKUP_DIR/pm2-dump.pm2" 2>/dev/null || true
echo "✓ PM2 state backed up"

# Verify backup
ls -la "$BACKUP_DIR"
du -sh "$BACKUP_DIR"
echo "Backup complete: $BACKUP_DIR"
```

---

## Phase 3: Deploy v0.9.5 (15 min)

### 3.1 Transfer Package
Copy `hptourism-v0.9.5-offline.tar.gz` to PROD server's `/setup/` folder.

### 3.2 Extract and Install

```bash
cd /setup
tar -xzf hptourism-v0.9.5-offline.tar.gz
cd hptourism-v0.9.5-offline

# Run installer - Choose Option [2] Update Existing Installation
sudo bash deploy/install.sh
```

When prompted:
- **Choice**: Enter `2` (Update Existing Installation)
- **Installation path**: Enter `/opt/hptourism/homestay` (or wherever v0.8.6 is)

### 3.3 Verify Deployment

```bash
# Check app is running
pm2 list
pm2 logs hptourism-prod --lines 20 --nostream

# Test HTTP
curl -s -o /dev/null -w "%{http_code}" http://localhost:5060/

# Test HTTPS (should be 200 or 302)
curl -s -o /dev/null -w "%{http_code}" https://homestay.hp.gov.in/
```

---

## Phase 4: SSL Verification

The existing SSL should continue working. If not:

```bash
# Check current SSL paths
sudo nginx -T 2>/dev/null | grep ssl_certificate

# Test Nginx config
sudo nginx -t

# Reload if needed
sudo systemctl reload nginx
```

---

## 🚨 EMERGENCY ROLLBACK PROCEDURE

If v0.9.5 has issues, rollback in under 5 minutes:

```bash
BACKUP_DIR="/opt/backup/hptourism-YYYYMMDD-HHMM"  # Use your actual backup path

# 1. Stop current app
pm2 stop all

# 2. Restore app files
sudo rm -rf /opt/hptourism/homestay
sudo cp -r "$BACKUP_DIR/app/homestay" /opt/hptourism/

# 3. Restore database
sudo -u postgres psql -c "DROP DATABASE hptourism;"
sudo -u postgres psql -c "CREATE DATABASE hptourism;"
sudo -u postgres psql hptourism < "$BACKUP_DIR/database.sql"

# 4. Restart old app
cd /opt/hptourism/homestay
pm2 start ecosystem.config.cjs --env production  # Old v0.8.6 start command
pm2 save

# 5. Verify
curl -s -o /dev/null -w "%{http_code}" https://homestay.hp.gov.in/
```

---

## Quick Reference

| Item | Command |
|------|---------|
| Check app status | `pm2 list` |
| View logs | `pm2 logs hptourism-prod` |
| Restart app | `pm2 restart hptourism-prod` |
| Test local | `curl http://localhost:5060/` |
| Test HTTPS | `curl https://homestay.hp.gov.in/` |
| Nginx reload | `sudo systemctl reload nginx` |

---

## Expected Outcomes

After successful deployment:
- ✓ Site returns HTTP 200/302
- ✓ Login works with `admin` / `Admin@2025`
- ✓ Footer shows `v0.9.5`
- ✓ System Admin only sees User Management + RC Applications
