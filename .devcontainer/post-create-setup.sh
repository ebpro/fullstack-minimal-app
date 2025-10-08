#!/bin/bash
# ==============================================================================
# Post-Create Setup Script for Dev Container
# ==============================================================================
# Purpose: Handle all post-create setup tasks with proper error handling
# ==============================================================================

echo "🔧 Post-create setup..."

# Fix permissions quietly (use sudo only if available)
if command -v sudo >/dev/null 2>&1; then SUDO=sudo; else SUDO=""; fi

# On Windows hosts, volume mounts can map to root-owned dirs; ensure node owns node_modules
$SUDO chown -R node:node /workspace/node_modules 2>/dev/null || true
$SUDO chown -R node:node /workspace/backend/node_modules 2>/dev/null || true
$SUDO chown -R node:node /workspace/frontend/node_modules 2>/dev/null || true

# When using SSH agent forwarding, ~/.ssh may not exist; ignore errors
if [ -d "/home/node/.ssh" ]; then
    $SUDO chown -R node:node /home/node/.ssh 2>/dev/null || true
fi

if [ -f "/home/node/.gitconfig" ]; then
    $SUDO chown node:node /home/node/.gitconfig 2>/dev/null || true
fi

# Run Git setup (handle CRLF)
tmp_git=/tmp/git-setup.sh
tr -d '\r' </workspace/.devcontainer/git-setup.sh > "$tmp_git"
chmod +x "$tmp_git"
"$tmp_git" || echo "⚠️  Git setup had issues but continuing..."

# Install npm dependencies if package.json exists
if [ -f "/workspace/package.json" ]; then
    echo "📦 Installing dependencies..."
    cd /workspace
    if [ -f "package-lock.json" ]; then
        npm ci 2>/dev/null || npm install
    else
        npm install
    fi
    echo "✅ Dependencies installed"
fi

echo "✅ Setup complete! Run 'npm run dev' to start."