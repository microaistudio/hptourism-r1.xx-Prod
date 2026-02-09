# Release Notes - v0.7.6

**Release Date:** 2026-01-07  
**Package:** `hptourism-v0.7.6-offline.tar.gz`

## Security Audit - All 11 Issues Resolved ✅

Full compliance with HPSDC Pre-Hosting WASA Report (December 2025):

| # | Issue | Status |
|---|-------|--------|
| 1 | Session Fixation | ✅ Fixed - `session.regenerate()` |
| 2 | Concurrent Login | ⚠️ Accepted Risk |
| 3 | Doc File Exposure | ✅ Safe |
| 4 | Clear Text UserID | ✅ Safe - UUIDs |
| 5 | OPTIONS Method | ✅ Fixed - 405 Blocked |
| 6 | Server Version | ✅ Fixed - `x-powered-by` disabled |
| 7 | HSTS Header | ✅ Fixed - maxAge=31536000 |
| 8 | AutoComplete | ✅ Fixed |
| 9 | CSP Header | ⚠️ Accepted Risk (Staging) |
| 10 | Email Disclosure | ✅ Safe |
| 11 | Secure Cookie | ✅ Fixed |

## New Features (Since v0.7.1)

### Document Forms Redesign
- Professional government-style Form-C Undertaking
- Affidavit U/S 29 with elegant typography
- Single A4 page layout with proper borders
- Extended address field support

### Session Security Enhancement
- Fixed race condition in login redirect
- Session verification before redirect

### Two-Tier Grievance System (v0.7.5)
- Version badge display
- UI improvements

## Rate Limiting Configuration

```env
# Disabled for testing (current)
SECURITY_ENABLE_RATE_LIMIT=false

# Production recommendation
SECURITY_ENABLE_RATE_LIMIT=true
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_WINDOW_MS=900000
```

## Deployment Instructions

1. **Copy Package** to server:
   ```bash
   scp hptourism-v0.7.6-offline.tar.gz user@server:/tmp/
   ```

2. **Extract**:
   ```bash
   tar -xzf hptourism-v0.7.6-offline.tar.gz
   cd hptourism-v0.7.6-offline
   ```

3. **Install**:
   ```bash
   sudo ./install.sh
   # Select "Option 2: Fresh Install" or "Option 3: Upgrade"
   ```

4. **Verify Security**:
   ```bash
   bash scripts/security-audit-test.sh https://your-server-url
   ```
