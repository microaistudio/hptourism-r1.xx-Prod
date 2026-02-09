# Security Audit Test Points (Ver R.1)

**Version:** 1.0.0
**Status:** 25/25 Checks PASSED
**Date:** 2026-02-01

This document archives the list of 25 Security Checks that were successfully verified during the Release 1.0.0 audit.

## 1. HTTP Security Headers (5 Points)
1.  **Strict-Transport-Security (HSTS)**: Header is present to enforce HTTPS.
2.  **Content-Security-Policy (CSP)**: Header is present to prevent XSS/Injection.
3.  **X-Frame-Options**: Header is present to prevent clickjacking.
4.  **X-Content-Type-Options**: Header is present to prevent MIME sniffing.
5.  **Server Version Hidden**: `Server` header does not disclose Nginx version.

## 2. Blocked Sensitive Files (9 Points)
Direct web access to the following file types/files is explicitly blocked (403/404):
6.  `.md` (Markdown documentation)
7.  `.txt` (Text files)
8.  `.log` (Log files)
9.  `.env` (Environment variables)
10. `.sql` (Database dumps)
11. `.sh` (Shell scripts)
12. `.yml` (YAML config)
13. `.yaml` (YAML config)
14. `package.json` (Dependency manifest)

## 3. HTTP Methods (2 Points)
Unsafe or unnecessary HTTP methods are blocked:
15. **OPTIONS**: Blocked (405 Method Not Allowed).
16. **TRACE**: Blocked (405 Method Not Allowed).
*(Note: PUT, DELETE, PATCH are allowed for API usage but require authentication)*

## 4. Codebase Security Patterns (5 Points)
17. **No Raw SQL**: No usage of `db.execute` with raw strings found (prevents SQL Injection).
18. **No Eval**: No usage of `eval()` found.
19. **Password Hashing**: `bcrypt` is explicitly used for password storage.
20. **Secure Cookie Flag**: Session cookies have `secure: true` enabled.
21. **Rate Limiting**: `authRateLimiter` and `uploadRateLimiter` are implemented.

## 5. Session Security (3 Points)
22. **Session Regeneration**: Session ID is regenerated after login (prevents Session Fixation, HPSDC #1).
23. **Concurrent Login Prevention**: Old sessions are invalidated upon new login (HPSDC #2).
24. **HttpOnly Flag**: Session cookies have `httpOnly: true` (prevents XSS theft).

## 6. Additional Checks (1 Point)
25. **Helmet Middleware**: Validated usage of Helmet for general security headers.

---
**Total Passing Checks:** 25
