#!/bin/bash
# HPTourism Installer Packager
# Usage: ./deploy/build_installer.sh [version]

VERSION=${1:-"v0.9.9.5"}
OUTPUT_DIR="/home/subhash.thakur.india/Projects/setup"
INSTALLER_NAME="hptourism-$VERSION-installer.tar.gz"

echo "📦 Packaging HPTourism Installer ($VERSION)..."

# 1. Clean & Rebuild
echo "🧹 Cleaning dist..."
rm -rf dist
echo "🔨 Building project..."
npm run build

# 2. Verify Critical Components
REQUIRED_DIRS=("dist" "node_modules" "Database" "shared" "deploy")
REQUIRED_FILES=("package.json" "ecosystem.config.cjs" "drizzle.config.ts")

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "❌ Error: Directory '$dir' missing!"
        exit 1
    fi
done

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: File '$file' missing!"
        exit 1
    fi
done

# 3. Create Package
echo "📦 Creating tarball: $OUTPUT_DIR/$INSTALLER_NAME"
mkdir -p "$OUTPUT_DIR"

tar -czvf "$OUTPUT_DIR/$INSTALLER_NAME" \
    -C deploy install.sh \
    -C .. \
    ecosystem.config.cjs \
    package.json \
    package-lock.json \
    drizzle.config.ts \
    shared/ \
    Database/ \
    dist/ \
    node_modules/

# 4. Verification
if [ $? -eq 0 ]; then
    SIZE=$(du -h "$OUTPUT_DIR/$INSTALLER_NAME" | cut -f1)
    echo "✅ Success! Installer created: $OUTPUT_DIR/$INSTALLER_NAME"
    echo "📊 Size: $SIZE"
    echo "📝 Check release_manifest.md for bill of materials."
else
    echo "❌ Error: Tarball creation failed!"
    exit 1
fi
