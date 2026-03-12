# 🛡️ Permanent Resolution: Zombie Port Conflicts

## 🚨 The Problem: Root vs. User
Historically, the `hptourism-prod` deployment failed frequently because the process binding to port 5055 (or 5060) was owned by **root**. This typically happens when:
1.  An admin accidentally runs `pm2 start` or `pm2 restart` as root.
2.  A system reboot starts a service as root (if not configured correctly for user).
3.  The port remains locked by this "zombie" process.

Because the deployment script tries to run as the unprivileged `hptourism` user, it lacks the permission to kill the root-owned process or bind to the locked port, resulting in:
`Error: listen EADDRINUSE: address already in use :::5055`

## ✅ The Solution: `deploy-prod.sh`
We have introduced a master deployment script designed to be run as **root**. It handles the necessary cleanup before handing over control to the safe `hptourism` user.

**Location:** `scripts/deploy-prod.sh`

### How it Works
1.  **Ghost Killing**: Calls `scripts/kill-ghosts.sh` to identifying and forcefully kill ANY process holding ports 5055, 5060, or 5040 (regardless of owner).
2.  **Permission Repair**: Runs `chown -R hptourism:hptourism .` to ensure all files are owned by the application user.
3.  **User Switching**: Uses `su - hptourism` to execute `pm2` commands safely as the `hptourism` user.

## 🚀 Deployment Command
To deploy safely without conflicts, always run:

```bash
# Must be run as root
sudo ./scripts/deploy-prod.sh
```

## Maintenance
If you ever encounter "port in use" errors again, it means `deploy-prod.sh` was not used. Run it immediately to resolve the conflict.
