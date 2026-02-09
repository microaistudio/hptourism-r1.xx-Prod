# HP Tourism Homestay Portal - Installation Guide

## Quick Start

### Prerequisites
- Ubuntu 20.04 LTS or later
- Root/sudo access
- 4GB RAM minimum (8GB recommended)
- 20GB free disk space

### Installation Steps

1. **Extract the installer package**
   ```bash
   tar -xzf hptourism-v0.8.x-offline.tar.gz
   cd hptourism-v0.8.x-offline
   ```

2. **Run the installer**
   ```bash
   sudo bash deploy/install.sh
   ```

3. **Select installation option**
   - Option 1: Fresh Installation (new server)
   - Option 2: Update Existing Installation
   - Option 3: Restore from Backup
   - Option 4: Uninstall / Clean Old Setup

4. **Follow the prompts**
   - Provide domain name, port, database credentials
   - Configure SSL certificates
   - Set rate limits and backup paths

5. **Access your application**
   - Navigate to: `https://your-domain.hp.gov.in`
   - Default super admin credentials will be displayed after installation

## Configuration Details

### Default Values
- **Install Path**: `/opt/hptourism/homestay`
- **Port**: `5050`
- **Database Name**: `hptourism`
- **Database User**: `hptourism_admin`
- **Rate Limit**: `1000 requests/15min`

### Required Information
- Domain name (e.g., `homestay.hp.gov.in`)
- Database password (secure password required)
- SSL certificate paths (or use Certbot)
- Backup directory path (NAS mount recommended)

## Post-Installation

### Verify Installation
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs hptourism-rc8

# Check Nginx status
systemctl status nginx

# Test database connection
psql -U hptourism_admin -d hptourism -c "SELECT version();"
```

### Common Commands
```bash
# Restart application
pm2 restart hptourism-rc8

# View logs
pm2 logs hptourism-rc8 --lines 100

# Reload Nginx
systemctl reload nginx

# Check installation logs
tail -f /var/log/hptourism-install.log
```

## Troubleshooting

### Installation Fails
- Check `/var/log/hptourism-install.log` for detailed error messages
- Ensure all prerequisites are met
- Verify network connectivity (for fresh installations)

### Application Won't Start
- Check PM2 logs: `pm2 logs hptourism-rc8`
- Verify database connection in `.env` file
- Ensure port is not already in use: `netstat -tulpn | grep 5050`

### Database Connection Issues
- Verify PostgreSQL is running: `systemctl status postgresql`
- Check database credentials in `.env`
- Test connection: `psql -U hptourism_admin -d hptourism`

### Nginx Configuration Issues
- Test configuration: `nginx -t`
- Check error logs: `tail -f /var/log/nginx/error.log`
- Verify SSL certificate paths

## Support

For technical support, contact:
- Email: support@hp.gov.in
- Documentation: See `A.PMD/Installation & Setup/` directory

## Version Information

- **Installer Version**: R1
- **Application Version**: 0.8.x
- **Last Updated**: 2026-01-21
