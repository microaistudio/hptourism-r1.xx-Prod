#!/bin/bash

################################################################################
# HP Tourism Homestay Portal - Package Build Script
# 
# This script creates an offline installer package with all required files.
#
# Usage: bash scripts/build-package.sh [VERSION]
# Example: bash scripts/build-package.sh 0.9.0
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default version
VERSION="${1:-$(node -p "require('./package.json').version")}"
PACKAGE_NAME="hptourism-v${VERSION}-offline"

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
RELEASE_DIR="$PROJECT_ROOT/release"
PACKAGE_DIR="$RELEASE_DIR/$PACKAGE_NAME"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           HP TOURISM - PACKAGE BUILD SCRIPT                  ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Version: $VERSION"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

# Step 1: Build production bundle
print_info "Building production bundle..."
cd "$PROJECT_ROOT"

if [[ "$2" != "--skip-build" ]]; then
    npm run build
    print_success "Production bundle built"
else
    print_warning "Skipping build (--skip-build flag)"
fi

# Step 2: Verify dist folder
if [[ ! -d "$PROJECT_ROOT/dist" ]]; then
    print_error "dist/ folder not found. Run 'npm run build' first."
    exit 1
fi

# Step 3: Create package directory
print_info "Creating package directory: $PACKAGE_DIR"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR/deploy"

# Step 4: Copy required files
print_info "Copying application files..."

# Core application files
cp -r "$PROJECT_ROOT/dist" "$PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/node_modules" "$PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/shared" "$PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/migrations" "$PACKAGE_DIR/"
cp -r "$PROJECT_ROOT/Database" "$PACKAGE_DIR/"
cp "$PROJECT_ROOT/package.json" "$PACKAGE_DIR/"
cp "$PROJECT_ROOT/package-lock.json" "$PACKAGE_DIR/"
cp "$PROJECT_ROOT/drizzle.config.ts" "$PACKAGE_DIR/"
cp "$PROJECT_ROOT/ecosystem.config.cjs" "$PACKAGE_DIR/"
cp "$PROJECT_ROOT/.env.example" "$PACKAGE_DIR/"

print_success "Application files copied"

# Step 5: Copy deploy folder
print_info "Copying installer scripts..."
cp "$PROJECT_ROOT/deploy/install.sh" "$PACKAGE_DIR/deploy/"

# Copy README if exists
if [[ -f "$PROJECT_ROOT/deploy/README.md" ]]; then
    cp "$PROJECT_ROOT/deploy/README.md" "$PACKAGE_DIR/deploy/"
fi

# Copy nginx template if exists
if [[ -d "$PROJECT_ROOT/deploy/nginx" ]]; then
    cp -r "$PROJECT_ROOT/deploy/nginx" "$PACKAGE_DIR/deploy/"
fi

# Copy ssl helper if exists
if [[ -d "$PROJECT_ROOT/deploy/ssl" ]]; then
    cp -r "$PROJECT_ROOT/deploy/ssl" "$PACKAGE_DIR/deploy/"
fi

print_success "Installer scripts copied"

# Step 6: Create package manifest
print_info "Creating package manifest..."
cat > "$PACKAGE_DIR/MANIFEST.txt" <<EOF
HP Tourism Homestay Portal - Offline Package
=============================================
Version: $VERSION
Build Date: $(date '+%Y-%m-%d %H:%M:%S')
Build Machine: $(hostname)

Contents:
- deploy/           Installer scripts
- dist/             Compiled application
- node_modules/     Dependencies (offline install)
- shared/           Shared code
- migrations/       Database migrations
- Database/         Seed data SQL files
- package.json      Project metadata
- ecosystem.config.cjs  PM2 configuration
- .env.example      Environment template

Installation:
  sudo bash deploy/install.sh

For detailed instructions, see deploy/README.md
EOF

print_success "Manifest created"

# Step 7: Display package contents
print_info "Package contents:"
echo ""
ls -la "$PACKAGE_DIR"
echo ""

# Step 8: Calculate size
PACKAGE_SIZE=$(du -sh "$PACKAGE_DIR" | cut -f1)
print_info "Package size: $PACKAGE_SIZE"

# Step 9: Create tarball
print_info "Creating tarball..."
cd "$RELEASE_DIR"
tar -czvf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_NAME" > /dev/null 2>&1

TARBALL_SIZE=$(ls -lh "${PACKAGE_NAME}.tar.gz" | awk '{print $5}')
print_success "Tarball created: ${PACKAGE_NAME}.tar.gz ($TARBALL_SIZE)"

# Summary
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    BUILD COMPLETE                            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Package: $RELEASE_DIR/$PACKAGE_NAME/"
echo "Tarball: $RELEASE_DIR/${PACKAGE_NAME}.tar.gz"
echo "Size:    $TARBALL_SIZE"
echo ""
echo "To deploy, copy the tarball to the target server and run:"
echo "  tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "  cd $PACKAGE_NAME"
echo "  sudo bash deploy/install.sh"
echo ""
