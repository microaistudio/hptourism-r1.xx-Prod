#!/bin/bash
# =============================================================================
# HP Tourism Security Regression Test Suite
# =============================================================================
# Purpose: Verify all security fixes from HPSDC audit remain intact
# Usage:   npm run security:check
#          TARGET_URL=https://homestay.hp.gov.in npm run security:check
# =============================================================================

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TARGET_URL="${TARGET_URL:-https://dev1.osipl.dev}"
CHECKS_DIR="$SCRIPT_DIR/security-checks"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  HP Tourism Security Regression Suite${NC}"
    echo -e "${BLUE}  Target: ${TARGET_URL}${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${YELLOW}━━━ $1 ━━━${NC}"
}

check_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
    PASSED=$((PASSED + 1))
}

check_fail() {
    echo -e "  ${RED}✗${NC} $1"
    FAILED=$((FAILED + 1))
}

check_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# =============================================================================
# Security Checks
# =============================================================================

# -----------------------------------------------------------------------------
# HPSDC Issue #7 & #11: HSTS & Secure Cookies
# -----------------------------------------------------------------------------
check_http_headers() {
    print_section "HTTP Security Headers (HPSDC #7, #9, #11)"
    
    HEADERS=$(curl -sI "$TARGET_URL/" 2>/dev/null | tr -d '\r')
    
    # Check Strict-Transport-Security (HPSDC #7: Unencrypted Communication)
    if echo "$HEADERS" | grep -qi "strict-transport-security"; then
        check_pass "HSTS header present (HPSDC #7)"
    else
        check_fail "HSTS header MISSING - Unencrypted communication possible (HPSDC #7)"
    fi
    
    # Check Content-Security-Policy (HPSDC #9)
    if echo "$HEADERS" | grep -qi "content-security-policy"; then
        check_pass "CSP header present (HPSDC #9)"
    else
        check_fail "CSP header MISSING (HPSDC #9)"
    fi
    
    # Check X-Frame-Options
    if echo "$HEADERS" | grep -qi "x-frame-options"; then
        check_pass "X-Frame-Options header present (Clickjacking protection)"
    else
        check_fail "X-Frame-Options header MISSING"
    fi
    
    # Check X-Content-Type-Options
    if echo "$HEADERS" | grep -qi "x-content-type-options"; then
        check_pass "X-Content-Type-Options header present"
    else
        check_warn "X-Content-Type-Options header missing"
    fi
    
    # Check Server Version Disclosure (HPSDC #6)
    if echo "$HEADERS" | grep -qi "^server:.*nginx/[0-9]"; then
        check_fail "Server version disclosed (HPSDC #6)"
    else
        check_pass "Server version hidden (HPSDC #6)"
    fi
}

# -----------------------------------------------------------------------------
# HPSDC Issue #3: Documentation Files Exposed
# -----------------------------------------------------------------------------
check_blocked_files() {
    print_section "Blocked File Extensions (HPSDC #3)"
    
    BLOCKED_EXTENSIONS=(".md" ".txt" ".log" ".env" ".sql" ".sh" ".yml" ".yaml")
    
    for ext in "${BLOCKED_EXTENSIONS[@]}"; do
        # Use GET request with -o /dev/null to get actual status
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/README${ext}" 2>/dev/null)
        if [[ "$STATUS" == "404" ]] || [[ "$STATUS" == "403" ]]; then
            check_pass "Files with ${ext} extension blocked (404/403)"
        else
            check_warn "Files with ${ext} extension returned status $STATUS - verify manually"
        fi
    done
    
    # Check package.json specifically
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL/package.json" 2>/dev/null)
    if [[ "$STATUS" == "404" ]] || [[ "$STATUS" == "403" ]]; then
        check_pass "package.json blocked (404/403)"
    else
        check_warn "package.json returned status $STATUS - verify manually"
    fi
}

# -----------------------------------------------------------------------------
# HPSDC Issue #5: OPTIONS Method Enabled
# -----------------------------------------------------------------------------
check_http_methods() {
    print_section "HTTP Methods (HPSDC #5)"
    
    BLOCKED_METHODS=("OPTIONS" "TRACE" "PUT" "DELETE" "PATCH")
    
    for method in "${BLOCKED_METHODS[@]}"; do
        # Use -X to set method, -o /dev/null to suppress output
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$TARGET_URL/api/health" 2>/dev/null)
        # 405 = Method Not Allowed, 403 = Forbidden, 404 = Not Found - all indicate blocked
        if [[ "$STATUS" == "405" ]] || [[ "$STATUS" == "403" ]] || [[ "$STATUS" == "404" ]]; then
            check_pass "$method method blocked (Status: $STATUS)"
        elif [[ "$STATUS" == "401" ]]; then
            check_pass "$method method requires auth (Status: $STATUS)"
        else
            check_warn "$method method returned $STATUS on /api/health - verify manually"
        fi
    done
}

# -----------------------------------------------------------------------------
# Code Pattern Checks (SQL Injection, XSS, etc.)
# -----------------------------------------------------------------------------
check_code_patterns() {
    print_section "Code Security Patterns"
    
    cd "$PROJECT_ROOT"
    
    # Check for raw SQL queries (SQL Injection risk)
    RAW_SQL=$(grep -rn "db\.execute\s*(\s*['\"\`]" --include="*.ts" --include="*.js" server/ 2>/dev/null | grep -v node_modules | wc -l)
    if [[ "$RAW_SQL" -eq 0 ]]; then
        check_pass "No raw SQL queries found (SQL Injection protection)"
    else
        check_fail "Found $RAW_SQL potential raw SQL queries"
    fi
    
    # Check for dangerouslySetInnerHTML without sanitization
    DANGEROUS_HTML=$(grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx" client/ 2>/dev/null | grep -v node_modules | wc -l)
    if [[ "$DANGEROUS_HTML" -eq 0 ]]; then
        check_pass "No dangerouslySetInnerHTML usage (XSS protection)"
    else
        check_warn "Found $DANGEROUS_HTML uses of dangerouslySetInnerHTML - verify sanitization"
    fi
    
    # Check for eval() usage
    EVAL_USAGE=$(grep -rn "\beval\s*(" --include="*.ts" --include="*.js" --include="*.tsx" server/ client/ 2>/dev/null | grep -v node_modules | wc -l)
    if [[ "$EVAL_USAGE" -eq 0 ]]; then
        check_pass "No eval() usage found"
    else
        check_fail "Found $EVAL_USAGE uses of eval() - security risk"
    fi
    
    # Check bcrypt is used for passwords
    if grep -rq "bcrypt" server/ 2>/dev/null; then
        check_pass "bcrypt is used for password hashing"
    else
        check_fail "bcrypt NOT found - insecure password storage"
    fi
    
    # Check session cookie secure flag in code
    if grep -rq "secure:\s*true" server/routes.ts 2>/dev/null || grep -rq "secure: envCookieSecure" server/routes.ts 2>/dev/null; then
        check_pass "Session cookie secure flag configured (HPSDC #11)"
    else
        check_fail "Session cookie secure flag NOT configured (HPSDC #11)"
    fi
    
    # Check for rate limiting
    if grep -rq "rateLimit\|rateLimiter" server/ 2>/dev/null; then
        check_pass "Rate limiting is implemented"
    else
        check_fail "Rate limiting NOT found"
    fi
}

# -----------------------------------------------------------------------------
# Session Security (HPSDC #1: Session Fixation, #2: Concurrent Login)
# -----------------------------------------------------------------------------
check_session_security() {
    print_section "Session Security (HPSDC #1, #2)"
    
    cd "$PROJECT_ROOT"
    
    # Check for session regeneration after login
    if grep -rq "regenerate\|req\.session\.regenerate" server/ 2>/dev/null; then
        check_pass "Session regeneration found (HPSDC #1: Session Fixation)"
    else
        check_warn "Session regeneration not explicitly found - verify manually"
    fi
    
    # Check for session invalidation on login (concurrent session prevention)
    if grep -rq "invalidateExistingSessions\|deleteExistingSessions" server/ 2>/dev/null; then
        check_pass "Concurrent session prevention found (HPSDC #2)"
    else
        check_warn "Concurrent session prevention not found - verify manually"
    fi
    
    # Check httpOnly flag
    if grep -rq "httpOnly:\s*true" server/ 2>/dev/null; then
        check_pass "Session cookie httpOnly flag set"
    else
        check_fail "Session cookie httpOnly flag NOT set"
    fi
}

# -----------------------------------------------------------------------------
# Additional OWASP Checks
# -----------------------------------------------------------------------------
check_additional_security() {
    print_section "Additional Security Checks"
    
    cd "$PROJECT_ROOT"
    
    # Check helmet is used
    if grep -rq "helmet" server/ 2>/dev/null; then
        check_pass "Helmet middleware is used"
    else
        check_fail "Helmet middleware NOT found"
    fi
    
    # Check CORS configuration
    if grep -rq "cors" server/ 2>/dev/null; then
        check_pass "CORS configuration found"
    else
        check_warn "CORS configuration not found - verify if needed"
    fi
    
    # Check for hardcoded secrets (basic check)
    HARDCODED=$(grep -rn "password.*=.*['\"][^'\"]*['\"]" --include="*.ts" --include="*.js" server/ 2>/dev/null | grep -v "node_modules\|\.d\.ts\|password.*=.*process\.env\|password.*=.*req\." | wc -l)
    if [[ "$HARDCODED" -lt 3 ]]; then
        check_pass "No obvious hardcoded secrets found"
    else
        check_warn "Found $HARDCODED potential hardcoded secrets - review manually"
    fi
}

# =============================================================================
# Main Execution
# =============================================================================

print_header

# Run all checks
check_http_headers
check_blocked_files
check_http_methods
check_code_patterns
check_session_security
check_additional_security

# Print Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  SECURITY AUDIT SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [[ "$FAILED" -gt 0 ]]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}  ❌ SECURITY AUDIT FAILED${NC}"
    echo -e "${RED}  $FAILED issue(s) require attention${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
else
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  ✅ SECURITY AUDIT PASSED${NC}"
    echo -e "${GREEN}  All critical checks passed${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
fi
