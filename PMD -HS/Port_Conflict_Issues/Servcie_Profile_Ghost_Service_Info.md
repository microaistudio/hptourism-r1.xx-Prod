# Ghost Service & Port Conflict Intelligence Report

This file documents the critical "Ghost Service" incident that occurred on Feb 9, 2026, causing widespread 502 Bad Gateway errors and port conflicts across the HP Tourism environments.

## 🔴 Incident Summary
The system experienced a persistent port conflict on **5060** and **5040**. While the local user's PM2 list appeared healthy or empty, the ports remained locked by a service that wasn't visible in standard diagnostic commands.

## 🕵️ The "Ghost" Culprit: Root-Owned PM2
A PM2 process named `hptourism-dev` was started using `sudo`. 
- **The Problem**: PM2 maintains separate process lists for each user. A process started by `root` is invisible to the `subhash.thakur.india` user's `pm2 list` command.
- **The Result**: The root process held the ports `5040/5060` indefinitely. Any attempt by the local user to start the app resulted in `EADDRINUSE`.

## 📈 Memory & 502 Bad Gateway
The secondary cause of 502 errors was **RAM exhaustion**. 
- **Vite Dev Mode**: Spawns multiple watchers and `esbuild` processes, consuming ~1.5GB to 2.5GB per instance.
- **The Failure**: On this server (~10GB total, ~3GB available), running two dev servers simultaneously caused `esbuild` to panic and crash.
- **Nginx Response**: Because the app was "flapping" (crashing and restarting every few seconds), Nginx could not establish a stable connection to fetch assets, resulting in a **502 Bad Gateway**.

## 🛠 Diagnostic & Recovery Commands

### 1. Check for Ghost Processes
Always check if `root` is holding ports hostage:
```bash
sudo pm2 status
```
If a ghost is found:
```bash
sudo pm2 delete <name_or_id>
```

### 2. Force-Kill Stuck Ports
If a process is hidden or stuck:
```bash
# Finds and kills WHATEVER is on that port
fuser -k 5040/tcp
fuser -k 5060/tcp
```

### 3. Verify Active Listeners
```bash
# Reveals the PID and Process Name of the listener
ss -lntp | grep -E '5040|5060'
```

### 4. Stabilization Strategy
To resolve 502 errors when RAM is low, switch from `dev` to `production` mode:
```bash
# Clean cache
rm -rf node_modules/.vite

# Build and Start stable production server
npm run build
PORT=5040 pm2 start "npm run start" --name "hptourism-dev1"
```

## 📜 Key Folder & Port Mapping
- **DEV1**: `/home/subhash.thakur.india/Projects/hptourism/homestay` (Port **5040**)
- **R1**: `/home/subhash.thakur.india/Projects/hptourism-r1` (Port **5060**)
- **TST**: `/opt/hptourism/homestay` (Port **5055**)
## ♻️ Persistence (Reboot Survival)
To ensure the applications restart automatically after a server reboot:
1. **Save the list**: `pm2 save`
2. **Setup Startup**: `pm2 startup` (and follow the instructions to run the generated sudo command).

Current configuration: **Persistence is ENABLED** as of Feb 9, 2026.
