#!/bin/bash
set -e


# Auto-detect version from package.json
VERSION=$(node -p "require('./package.json').version")
RELEASE_DIR="release/v${VERSION}"
mkdir -p "$RELEASE_DIR"

echo "📦 Packaging HP Tourism Portal v${VERSION}..."

# 1. Source Code Pack (For Security Audit)
echo "🔒 Creating Source Code Audit Pack..."
SOURCE_AR="${RELEASE_DIR}/hptourism-v${VERSION}-source-audit.tar.gz"
tar -czf "$SOURCE_AR" \
  --exclude="node_modules" \
  --exclude="dist" \
  --exclude="release" \
  --exclude=".git" \
  --exclude="logs" \
  --exclude="backups" \
  --exclude="tests" \
  --exclude="test-results" \
  --exclude="*.log" \
  --exclude=".env" \
  --exclude="local-object-storage" \
  .

echo "✅ Source pack created: $SOURCE_AR"

# 2. Installer Pack (For Data Center Deployment)
echo "🚀 Building for Installer Pack..."
npm run build

INSTALLER_DIR="${RELEASE_DIR}/hptourism-installer"
rm -rf "$INSTALLER_DIR"
mkdir -p "$INSTALLER_DIR"

# Copy Runtime Files
cp package.json package-lock.json ecosystem.config.cjs drizzle.config.ts "$INSTALLER_DIR/"
cp -r dist "$INSTALLER_DIR/"
cp -r migrations "$INSTALLER_DIR/"
cp -r shared "$INSTALLER_DIR/"
cp -r Database "$INSTALLER_DIR/"
cp -r node_modules "$INSTALLER_DIR/"

# Use the robust installer script
cp deploy/install.sh "$INSTALLER_DIR/"
chmod +x "$INSTALLER_DIR/install.sh"

# Create README for Installer
cat > "$INSTALLER_DIR/README.md" << EOF
# HP Tourism Portal v${VERSION} - Installer

## Prerequisites
- Node.js v20+
- PostgreSQL 16+
- Redis (Optional, for session caching)

## Installation
1. Run \`./install.sh\` to install dependencies.
2. Configure \`.env\` file (use \`.env.example\` as reference).
3. Run migrations (requires database connection).

## Starting the App
- **Direct:** \`npm start\`
- **PM2:** \`pm2 start ecosystem.config.cjs\`

## Environment Variables
Ensure the following are set in \`.env\`:
- \`DATABASE_URL\`
- \`SESSION_SECRET\` (Min 32 chars)
- \`PORT\` (Default: 5000)
EOF

cp .env.example "$INSTALLER_DIR/"

# Zip Installer
echo "📦 Zipping Installer Pack..."
cd "$RELEASE_DIR"
tar -czf "hptourism-v${VERSION}-installer.tar.gz" "hptourism-installer"
rm -rf "hptourism-installer"
cd -

echo "✅ Installer pack created: ${RELEASE_DIR}/hptourism-v${VERSION}-installer.tar.gz"
echo "🎉 Release Preparation Complete!"
