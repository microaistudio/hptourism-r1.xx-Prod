#!/bin/bash
set -e

# Auto-detect version from package.json
VERSION=$(node -p "require('./package.json').version")
RELEASE_DIR="release"
mkdir -p "$RELEASE_DIR"

echo "🚀 Building Installer Pack Only (v${VERSION})"

# Installer Pack (For Data Center Deployment)
echo "🔨 Building project..."
npm run build

INSTALLER_DIR="${RELEASE_DIR}/hptourism-installer"
rm -rf "$INSTALLER_DIR"
mkdir -p "$INSTALLER_DIR"

echo "📂 Copying files..."
# Copy Runtime Files
cp package.json package-lock.json ecosystem.config.cjs drizzle.config.ts "$INSTALLER_DIR/"
cp -r node_modules "$INSTALLER_DIR/"
cp -r dist "$INSTALLER_DIR/"
cp -r migrations "$INSTALLER_DIR/"
cp -r shared "$INSTALLER_DIR/"

# Copy comprehensive installer script
if [ -f "deploy/install.sh" ]; then
    echo "📜 Using comprehensive installer from deploy/install.sh"
    cp deploy/install.sh "$INSTALLER_DIR/"
else
    echo "⚠️  deploy/install.sh not found! Falling back to simplified installer."
    # Create simple Install Script
    cat > "$INSTALLER_DIR/install.sh" << 'EOF'
#!/bin/bash
echo "🔧 Installing dependencies..."
npm ci --omit=dev

echo "⚠️  NOTE: Database migration requires 'drizzle-kit' which is a dev dependency."
echo "If you need to run migrations, please run: npm install drizzle-kit -D"
echo "Then: npm run db:push"

echo "✅ Installation complete."
echo "To start the server: npm run start"
echo "To using PM2: pm2 start ecosystem.config.cjs"
EOF
fi

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
echo "📦 Packaging Installer..."
cd "$RELEASE_DIR"
tar -czf "hptourism-v${VERSION}-offline.tar.gz" "hptourism-installer"
rm -rf "hptourism-installer"
cd -

echo "✅ Installer pack created: ${RELEASE_DIR}/hptourism-v${VERSION}-offline.tar.gz"
