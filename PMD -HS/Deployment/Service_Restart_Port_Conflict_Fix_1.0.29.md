# Service Restart & Port Conflict Fix — v1.0.29

**Date:** 12 February 2026  
**Server:** `homstyshmapp` (PROD — homestay.hp.gov.in)  
**Application:** HP Tourism Homestay Portal  
**Port:** 5055  
**Version:** 1.0.29  
**Status:** ✅ RESOLVED — 3+ hours stable, 0 restarts  

---

## Problem Summary

The PROD application experienced **continuous crash loops** (35–232+ restarts in rapid succession) with `EADDRINUSE: address already in use 0.0.0.0:5055`. The application would start, run for 10–30 seconds, crash, and PM2 would restart it — only to hit the port conflict again. This created a cycle where the site was intermittently accessible (during the brief windows the app was online) but fundamentally unstable.

---

## Root Causes (Three Overlapping Issues)

### 1. Dual PM2 Daemons — THE PRIMARY CAUSE

**Discovery:** The application was being managed by PM2 under **two different Linux users simultaneously**:

| User | PM2 Process | Port | Effect |
|------|------------|------|--------|
| `hptourism` | `hptourism-prod` (PID 580812) | 5055 | ✅ The intended process manager |
| `root` | `hptourism-prod` (various PIDs) | 5055 | ❌ A competing, duplicate process |

Each Linux user runs a **completely independent PM2 daemon** with its own process list, dump file, and PID tracking. When we ran `pm2 start` as `root`, it created a second Node.js process that tried to bind to the same port 5055 — causing EADDRINUSE.

**Why it was hard to find:**
- `pm2 list` as root showed only root's PM2 processes
- `pm2 delete` as root only removed root's entry — the `hptourism` PM2 process kept running
- `killall -9 node` returned "no process found" because the process name contained a space (`node\x20/`, not `node`)
- Even `fuser -k -9 5055/tcp` would kill the process, but the `hptourism` PM2 daemon would **immediately respawn it**

**Diagnostic command that revealed it:**
```bash
su - hptourism -c "pm2 list"
```
This showed the `hptourism` user had a separate PM2 instance with its own `hptourism-prod` process already running — the one we couldn't see or kill from root's PM2.

### 2. `reusePort: true` in server.listen() — AMPLIFYING FACTOR

The server code included `reusePort: true` in the `server.listen()` options:

```typescript
// BEFORE (broken)
server.listen({
    port,
    host: config.server.host,
    reusePort: true,  // ← THIS
}, () => { ... });
```

`reusePort` maps to Linux's `SO_REUSEPORT` socket option, which allows **multiple processes to bind to the same port simultaneously**. This is designed for cluster/load-balancing mode with multiple workers — NOT for fork mode with a single process. In our case, it allowed the two competing PM2 processes to occasionally both bind successfully, creating unpredictable behavior where some connections went to the dying process and others to the new one.

### 3. Broken EADDRINUSE Error Handler — WORSENING THE LOOP

An initial attempt to fix the crash loop added an `EADDRINUSE` error handler that would retry `server.listen()` after 3 seconds. However, the handler contained a bug:

```typescript
// BEFORE (broken handler)
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        setTimeout(() => {
            server.close();  // ← BUG: server never started, so this emits
                             //    ERR_SERVER_NOT_RUNNING
            server.listen({ port, host });
        }, 3000);
    } else {
        process.exit(1);  // ← ERR_SERVER_NOT_RUNNING hits this branch → CRASH
    }
});
```

Calling `server.close()` on a server that never successfully started listening causes Node.js to emit an `ERR_SERVER_NOT_RUNNING` error event. Since this error code is NOT `EADDRINUSE`, it hit the `else` branch which called `process.exit(1)` — **defeating the entire purpose of the retry handler** and causing an immediate crash.

---

## Fix Applied

### Fix 1: Single PM2 User (hptourism only)

All PM2 processes on PROD must run under the `hptourism` Linux user. Root and hmsusr PM2 instances were cleaned up:

```bash
# Kill root PM2 processes
pm2 delete all; pm2 save --force

# Clean hmsusr PM2 dump
echo '[]' > /home/hmsusr/.pm2/dump.pm2

# ALL PM2 commands now use:
su - hptourism -c "pm2 list"
su - hptourism -c "pm2 restart hptourism-prod"
su - hptourism -c "pm2 logs hptourism-prod --lines 20"
su - hptourism -c "pm2 save"
```

### Fix 2: Remove `reusePort: true`

```typescript
// AFTER (fixed)
server.listen({
    port,
    host: config.server.host,
    // reusePort removed — unnecessary in fork mode
    // Node.js already sets SO_REUSEADDR by default for TIME_WAIT handling
}, () => { ... });
```

### Fix 3: Correct EADDRINUSE Error Handler

```typescript
// AFTER (fixed handler)
let retryCount = 0;
const MAX_RETRIES = 10;

server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
        retryCount++;
        if (retryCount > MAX_RETRIES) {
            logger.error({ port, retryCount }, "[server] port still in use after max retries, exiting");
            process.exit(1);
        }
        logger.warn({ port, retryCount }, "[server] port in use, retrying in 3 seconds...");
        setTimeout(() => {
            // No server.close() — server never started, nothing to close
            server.listen({ port, host: config.server.host });
        }, 3000);
    } else if (err.code === "ERR_SERVER_NOT_RUNNING") {
        // Ignore — happens during cleanup, not a real error
    } else {
        logger.error({ err }, "[server] fatal error");
        process.exit(1);
    }
});
```

### Fix 4: Graceful Shutdown Handler

Ensures the port is properly released when PM2 sends SIGTERM/SIGINT during restarts:

```typescript
let shuttingDown = false;

function gracefulShutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "[server] received shutdown signal, closing gracefully...");

    server.close((err) => {
        if (err) {
            logger.error({ err }, "[server] error during shutdown");
            process.exit(1);
        }
        logger.info("[server] all connections closed, exiting cleanly");
        process.exit(0);
    });

    // Force exit after 5 seconds if connections don't close
    setTimeout(() => {
        logger.warn("[server] forcefully shutting down after timeout");
        process.exit(1);
    }, 5000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
```

### Fix 5: Crash Diagnostics

Added `uncaughtException` and `unhandledRejection` handlers at the top of `server/index.ts` so that future crashes log the REAL error before exit (instead of only showing EADDRINUSE from subsequent restarts):

```typescript
process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught Exception:", err);
    logger.fatal({ err: err.message, stack: err.stack }, "[server] uncaught exception");
    process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
    console.error("[FATAL] Unhandled Rejection:", reason);
    logger.fatal({ reason: String(reason) }, "[server] unhandled promise rejection");
    process.exit(1);
});
```

### Fix 6: PM2 Startup Persistence

Configured the `pm2-hptourism` systemd service for auto-start on reboot:

```bash
# Generate startup script (run as hptourism, then execute the sudo command it outputs)
su - hptourism -c "pm2 startup"
# → outputs: sudo env PATH=... pm2 startup systemd -u hptourism --hp /home/hptourism

# Enable the service
systemctl enable pm2-hptourism

# Verify
systemctl is-enabled pm2-hptourism  # → enabled
```

---

## Deployment Procedure (Updated)

⚠️ **CRITICAL: ALL PM2 commands on PROD must run as the `hptourism` user!**

```bash
# 1. Stop the running process (as hptourism)
su - hptourism -c "pm2 stop hptourism-prod; pm2 delete hptourism-prod"
sleep 3

# 2. Extract new code
cd /opt/hptourism/homestay
tar -xzf /home/hmsusr/setup/hptourism-v{VERSION}-patch.tar.gz

# 3. Run migrations if schema changed
source .env && npx drizzle-kit push

# 4. Start fresh (as hptourism)
su - hptourism -c "cd /opt/hptourism/homestay && pm2 start dist/index.js --name hptourism-prod --kill-timeout 8000 --restart-delay 5000 --max-restarts 10 --node-args='--enable-source-maps'"
su - hptourism -c "pm2 save"

# 5. Verify
su - hptourism -c "pm2 list"
```

---

## Verification

After applying all fixes:

```
┌────┬───────────────────┬──────┬──────┬───────────┬──────────┬──────────┐
│ id │ name              │ mode │ ↺    │ status    │ cpu      │ memory   │
├────┼───────────────────┼──────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ hptourism-prod    │ fork │ 0    │ online    │ 0%       │ 146.4mb  │
└────┴───────────────────┴──────┴──────┴───────────┴──────────┴──────────┘
```

- **Uptime:** 3+ hours continuous
- **Restarts:** 0 (previously 35–232+ in minutes)
- **Port conflicts:** None
- **Graceful shutdown:** Confirmed working (logs show "all connections closed, exiting cleanly")

---

## If the Problem Returns — Diagnostic Checklist

1. **Check for multiple PM2 daemons:**
   ```bash
   pm2 list                          # root's PM2
   su - hptourism -c "pm2 list"     # hptourism's PM2
   su - hmsusr -c "pm2 list"        # hmsusr's PM2
   ```
   Only `hptourism` should have processes.

2. **Check what's on port 5055:**
   ```bash
   lsof -i :5055
   ```
   Should show exactly ONE process owned by `hptourism`.

3. **Check ALL node processes:**
   ```bash
   ps aux | grep node | grep -v grep
   ```
   Should show only the one PM2 and one app process under `hptourism`.

4. **Check PM2 dump files (saved process lists):**
   ```bash
   cat /home/hmsusr/.pm2/dump.pm2    # Should be []
   cat /home/hptourism/.pm2/dump.pm2 # Should have hptourism-prod
   ```

5. **Check crash logs for the REAL error:**
   ```bash
   su - hptourism -c "pm2 logs hptourism-prod --err --lines 20 --nostream"
   ```
   Look for `[FATAL]` lines — these show the actual crash cause, not just EADDRINUSE symptoms.

---

## Files Changed in v1.0.29

| File | Change |
|------|--------|
| `server/index.ts` | Removed `reusePort: true`, added EADDRINUSE retry handler, added graceful shutdown, added crash diagnostics |
| `server/routes/admin/users.ts` | Changed session `estimatedLastActive` to `secondsAgo` (timezone fix) |
| `client/src/pages/admin/super-admin-dashboard.tsx` | Updated to use `secondsAgo` for session display |
| `client/src/lib/dateUtils.ts` | Added `formatDbTimestamp` utility for correct IST display |
| `client/src/pages/admin/super-admin-console.tsx` | Used `formatDbTimestamp` for HimKosh transaction dates |
| `client/src/pages/admin/payment-reports.tsx` | Used `formatDbTimestamp` for payment report dates |
| `.agent/workflows/build-release.md` | Updated deployment instructions to use `hptourism` user |

---

*Document prepared by: Development Team*  
*Incident resolved: 12 February 2026, ~01:30 UTC (07:00 IST)*
