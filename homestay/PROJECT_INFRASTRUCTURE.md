# HP Tourism Homestay Infrastructure Manifest

This document tracks the active folders, services, and ports used by the different versions of the HP Tourism Homestay Portal on this server.

## 🚀 Active Services

| Application | Path | Domain | Port | Service Name | DB Name |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEV1 (Primary)** | `/home/subhash.thakur.india/Projects/hptourism/homestay` | `dev1.osipl.dev` | **5040** | `hptourism-dev1` | `hptourism-dev` |
| **R1 (Mirror)** | `/home/subhash.thakur.india/Projects/hptourism-r1` | `dev.osipl.dev` | **5060** | `hptourism-r1` | `hptourism-r1` |
| **Testing (TST)** | `/opt/hptourism/homestay` | `hptourism.osipl.dev` | **5055** | `hptourism-tst` | `hptourism` |

## 🛠 Command Reference

### Starting Services CorrectLY
Always specify the port explicitly to avoid defaults:

```bash
# Start DEV1
cd /home/subhash.thakur.india/Projects/hptourism/homestay
PORT=5040 pm2 start "npm run start" --name "hptourism-dev1"

# Start R1
cd /home/subhash.thakur.india/Projects/hptourism-r1
PORT=5060 pm2 start "npm run start" --name "hptourism-r1"
```

### Stopping Services
```bash
pm2 delete all
# AND check for root-owned ghosts
sudo pm2 list
sudo pm2 delete hptourism-dev (if present)
```

## ⚠️ Known Issues & Fixes

### 1. 502 Bad Gateway
**Cause:** Node.js app is crashing or stuck in a restart loop.
**Fix:** 
- Clear lockfiles: `fuser -k 5040/tcp`
- Wipe Vite cache: `rm -rf node_modules/.vite`
- Rebuild app: `npm run build`

### 2. EADDRINUSE (Port Conflict)
**Cause:** A hidden process is holding the port. Often a `root` PM2 process.
**Fix:**
- Run `sudo pm2 status`. If anything is `online`, run `sudo pm2 delete <name>`.
- Use `fuser -k <port>/tcp` to force-kill whatever is hiding on that port.

## 📂 File Structure
- `/home/subhash.thakur.india/Projects/hptourism/homestay` : Your working directory (90% complete).
- `/home/subhash.thakur.india/Projects/hptourism-r1` : The alternate repo.
- `/home/subhash.thakur.india/Projects/setup` : Release scripts and installer packages.
- `/etc/nginx/sites-available` : Nginx configurations.
