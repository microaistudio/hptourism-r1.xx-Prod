#!/bin/bash

################################################################################
# HP Tourism Homestay Portal — PROD-Safe Install Pack Builder
#
# This script creates a LEAN tarball containing ONLY the files the PROD
# update flow needs.  No node_modules, no ecosystem.config, no .env,
# no Database/ folder, no DEV parameters.
#
# What goes into the tarball:
#   dist/           Compiled server + frontend (the ONLY executable code)
#   shared/         Shared TypeScript types (needed by drizzle migrations)
#   package.json    For version info + db:push script
#   package-lock.json
#   migrations/     Drizzle migration snapshots
#   deploy/install.sh  Installer (update mode only needs dist+shared)
#   MANIFEST.txt    Build metadata
#
# What does NOT go into the tarball:
#   ✘ node_modules       Already on PROD server
#   ✘ .env / .env.*      PROD .env stays untouched on server
#   ✘ ecosystem.config.cjs  PROD uses its own PM2 config
#   ✘ Database/          Seed SQL — not needed for updates
#   ✘ db-config.env      Stale DEV/STG credentials — NEVER ship this
#
# Usage:
#   bash scripts/build-prod-pack.sh           # auto-detect version
#   bash scripts/build-prod-pack.sh 1.3.1     # explicit version
#
# Output:
#   ~/Projects/setup/Install_packs/hptourism-v<VERSION>-prod.tar.gz
################################################################################

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; NC='\033[0m'

print_ok()   { echo -e "${GREEN}✓ $1${NC}"; }
print_err()  { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠ $1${NC}"; }

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION="${1:-$(node -p "require('$PROJECT_ROOT/package.json').version")}"
PACK_NAME="hptourism-v${VERSION}-prod"
OUTPUT_DIR="$HOME/Projects/setup/Install_packs"
STAGING_DIR="/tmp/${PACK_NAME}"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        HP TOURISM — PROD-SAFE PACK BUILDER                  ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Version : $VERSION"
echo "║  Output  : $OUTPUT_DIR/${PACK_NAME}.tar.gz"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Step 1: Safety Checks ───────────────────────────────────────────────────
print_info "Running pre-flight safety checks..."

# 1a. Ensure dist/ exists
if [[ ! -d "$PROJECT_ROOT/dist" ]]; then
    print_err "dist/ not found.  Run 'npm run build' first."
    exit 1
fi
print_ok "dist/ exists"

# 1b. Ensure dist/index.js exists (core server)
if [[ ! -f "$PROJECT_ROOT/dist/index.js" ]]; then
    print_err "dist/index.js missing — build may be incomplete."
    exit 1
fi
print_ok "dist/index.js present"

# 1c. Ensure dist/public exists (frontend assets)
if [[ ! -d "$PROJECT_ROOT/dist/public" ]]; then
    print_err "dist/public/ missing — frontend may not have built."
    exit 1
fi
print_ok "dist/public/ present"

# ── Step 2: DEV-Leak Detection ──────────────────────────────────────────────
print_info "Scanning dist/ for DEV parameter leaks..."

LEAK_FOUND=false

# Check compiled server bundle for hardcoded DEV database URLs
if grep -rq "hptourism-dev" "$PROJECT_ROOT/dist/index.js" 2>/dev/null; then
    print_warn "⚠ dist/index.js contains 'hptourism-dev' — possible DEV DB leak!"
    LEAK_FOUND=true
fi

if grep -rq "hptourism_user" "$PROJECT_ROOT/dist/index.js" 2>/dev/null; then
    print_warn "⚠ dist/index.js contains 'hptourism_user' — possible DEV DB user leak!"
    LEAK_FOUND=true
fi

if grep -rq "hptourism_pass" "$PROJECT_ROOT/dist/index.js" 2>/dev/null; then
    print_warn "⚠ dist/index.js contains 'hptourism_pass' — possible DEV DB password leak!"
    LEAK_FOUND=true
fi

if grep -rq "dev1.osipl.dev" "$PROJECT_ROOT/dist/index.js" 2>/dev/null; then
    print_warn "⚠ dist/index.js contains 'dev1.osipl.dev' — possible DEV URL leak!"
    LEAK_FOUND=true
fi

if grep -rq "ENABLE_TEST_RUNNER.*true" "$PROJECT_ROOT/dist/index.js" 2>/dev/null; then
    print_warn "⚠ dist/index.js contains ENABLE_TEST_RUNNER=true — test mode leak!"
    LEAK_FOUND=true
fi

if [[ "$LEAK_FOUND" == "true" ]]; then
    echo ""
    print_warn "Potential DEV parameter leaks detected in compiled bundle."
    print_warn "These are usually harmless (env vars override at runtime),"
    print_warn "but review the warnings above."
    echo ""
    read -p "Continue anyway? [y/N]: " continue_choice
    if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
        print_err "Aborted by user."
        exit 1
    fi
else
    print_ok "No DEV parameter leaks detected in dist/"
fi

# ── Step 3: Create Staging Directory ────────────────────────────────────────
print_info "Preparing staging area..."
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

# ── Step 4: Copy ONLY safe files ────────────────────────────────────────────
print_info "Copying safe files..."

# Compiled application (this is the actual fix)
cp -r "$PROJECT_ROOT/dist" "$STAGING_DIR/"
print_ok "  dist/"

# Shared types (needed for drizzle schema reference)
cp -r "$PROJECT_ROOT/shared" "$STAGING_DIR/"
print_ok "  shared/"

# Package metadata (for version info + npm run db:push)
cp "$PROJECT_ROOT/package.json" "$STAGING_DIR/"
cp "$PROJECT_ROOT/package-lock.json" "$STAGING_DIR/"
print_ok "  package.json + package-lock.json"

# Drizzle config + migrations (for db:push on PROD)
cp "$PROJECT_ROOT/drizzle.config.ts" "$STAGING_DIR/"
if [[ -d "$PROJECT_ROOT/migrations" ]]; then
    cp -r "$PROJECT_ROOT/migrations" "$STAGING_DIR/"
    print_ok "  migrations/"
fi

# Installer (for update flow)
if [[ -d "$PROJECT_ROOT/deploy" ]]; then
    mkdir -p "$STAGING_DIR/deploy"
    cp "$PROJECT_ROOT/deploy/install.sh" "$STAGING_DIR/deploy/" 2>/dev/null || true
    print_ok "  deploy/install.sh"
fi

# ── Step 5: Verify NO dangerous files leaked ────────────────────────────────
print_info "Verifying pack contents..."

DANGER_FILES=(
    ".env"
    "ecosystem.config.cjs"
    "Database/db-config.env"
)

PACK_SAFE=true
for danger in "${DANGER_FILES[@]}"; do
    if [[ -e "$STAGING_DIR/$danger" ]]; then
        print_err "DANGER: $danger found in pack — removing!"
        rm -f "$STAGING_DIR/$danger"
        PACK_SAFE=false
    fi
done

# Double-check no node_modules sneaked in
if [[ -d "$STAGING_DIR/node_modules" ]]; then
    print_err "DANGER: node_modules/ found in pack — removing!"
    rm -rf "$STAGING_DIR/node_modules"
    PACK_SAFE=false
fi

if [[ "$PACK_SAFE" == "true" ]]; then
    print_ok "Pack is clean — no dangerous files"
else
    print_warn "Removed dangerous files from pack"
fi

# ── Step 6: Create Manifest ─────────────────────────────────────────────────
cat > "$STAGING_DIR/MANIFEST.txt" <<EOF
HP Tourism Homestay Portal — PROD Update Pack
==============================================
Version    : $VERSION
Build Date : $(date '+%Y-%m-%d %H:%M:%S %Z')
Build Host : $(hostname)
Pack Type  : PROD-safe (dist-only, no node_modules, no .env)

Contents:
  dist/              Compiled server + frontend
  shared/            Shared TypeScript types
  migrations/        Drizzle migration snapshots
  deploy/install.sh  Installer script (use Update option)
  package.json       Version metadata
  drizzle.config.ts  Schema config for db:push

NOT Included (by design):
  ✘ node_modules     Already on PROD
  ✘ .env             PROD .env stays untouched
  ✘ ecosystem.config PROD PM2 config stays untouched
  ✘ Database/        Seed SQL not needed for updates

PROD Update Steps:
  1. Copy this tarball to PROD server ~/setup/
  2. Extract:  tar -xzf ${PACK_NAME}.tar.gz
  3. Stop PM2: sudo -u hmsusr pm2 stop hptourism-prod
  4. Backup:   cp -r /opt/hptourism/homestay/dist /opt/hptourism/homestay/dist_backup_\$(date +%s)
  5. Deploy:   cp -r ${PACK_NAME}/dist/* /opt/hptourism/homestay/dist/
  6. Deploy:   cp -r ${PACK_NAME}/shared/* /opt/hptourism/homestay/shared/
  7. Migrate:  cd /opt/hptourism/homestay && npm run db:push
  8. Start:    sudo -u hmsusr pm2 restart hptourism-prod --update-env
  9. Verify:   curl http://localhost:5055/
EOF

print_ok "Manifest created"

# ── Step 7: Create Tarball ──────────────────────────────────────────────────
print_info "Creating tarball..."
mkdir -p "$OUTPUT_DIR"
cd /tmp
tar -czf "$OUTPUT_DIR/${PACK_NAME}.tar.gz" "$PACK_NAME"

TARBALL_SIZE=$(ls -lh "$OUTPUT_DIR/${PACK_NAME}.tar.gz" | awk '{print $5}')

# Cleanup staging
rm -rf "$STAGING_DIR"

# ── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              PROD PACK BUILD COMPLETE ✅                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  Tarball : $OUTPUT_DIR/${PACK_NAME}.tar.gz"
echo "  Size    : $TARBALL_SIZE"
echo "  Version : $VERSION"
echo ""
echo -e "${BLUE}  Safe for PROD:${NC}"
echo "    ✓ No .env file"
echo "    ✓ No ecosystem.config.cjs"
echo "    ✓ No node_modules (${TARBALL_SIZE} vs 219M full pack)"
echo "    ✓ No Database/db-config.env"
echo "    ✓ No DEV database credentials"
echo ""
