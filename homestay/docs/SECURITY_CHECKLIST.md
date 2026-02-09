# HP Tourism Security Checklist

**Purpose:** Ensure all security fixes from HPSDC audit remain intact before production deployment.

**Usage:** Run `npm run security:check` before every deployment.

---

## HPSDC Audit Issues (11)

| # | Issue | Severity | Fix | Verified By |
|---|-------|----------|-----|-------------|
| 1 | Session Fixation | HIGH | Session regeneration after login | Code pattern check |
| 2 | Concurrent Login | Medium | Single session policy | Code pattern check |
| 3 | Documentation Files | Medium | Nginx blocks .md, .txt, etc. | HTTP 404 test |
| 4 | Cleartext USERID | Medium | Server-side UUIDs | By design |
| 5 | OPTIONS Method | Low | Middleware blocks methods | HTTP 405 test |
| 6 | Server Version | Low | `server_tokens off` | Header check |
| 7 | Unencrypted Comms | Low | HSTS enabled | Header check |
| 8 | Autocomplete | Low | `autocomplete="off"` | Manual |
| 9 | CSP Missing | Low | Content-Security-Policy | Header check |
| 10 | Email Disclosure | Low | No public emails | Manual |
| 11 | Cookie Secure Flag | Low | `secure: true` | Code check |

---

## Additional OWASP Checks (5)

| # | Check | Fix | Verified By |
|---|-------|-----|-------------|
| 12 | SQL Injection | Parameterized queries (Drizzle ORM) | Code pattern |
| 13 | XSS | No unsafe innerHTML | Code pattern |
| 14 | Rate Limiting | authRateLimiter middleware | Code check |
| 15 | Password Hashing | bcrypt | Code check |
| 16 | CORS | Proper origin config | Code check |

---

## Pre-Deployment Checklist

```bash
# 1. Run security audit
npm run security:check

# 2. Verify all checks pass
# If any FAIL, DO NOT DEPLOY until fixed
```

---

## Manual Verification

Some checks require manual verification:

1. **Session Fixation (HPSDC #1)**
   - Login, check session cookie value changes

2. **Concurrent Login (HPSDC #2)**
   - Login from two browsers, verify first is logged out

3. **Autocomplete (HPSDC #8)**
   - Inspect login form, verify `autocomplete="off"`

4. **Email Disclosure (HPSDC #10)**
   - Check all public pages for exposed emails

---

## Contact

Security issues: Report to development team immediately.
