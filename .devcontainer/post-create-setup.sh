#!/bin/bash
# ==============================================================================
# Post-Create Setup Script for Dev Container
# ==============================================================================
# Purpose: Handle all post-create setup tasks with proper error handling
# ==============================================================================

echo "🔧 Post-create setup..."

# Fix permissions quietly
sudo chown -R node:node /workspace/node_modules 2>/dev/null || true
sudo chown -R node:node /workspace/backend/node_modules 2>/dev/null || true
sudo chown -R node:node /workspace/frontend/node_modules 2>/dev/null || true

if [ -d "/home/node/.ssh" ]; then
    sudo chown -R node:node /home/node/.ssh
fi

if [ -f "/home/node/.gitconfig" ]; then
    sudo chown node:node /home/node/.gitconfig
fi

# Run Git setup
chmod +x /workspace/.devcontainer/git-setup.sh
/workspace/.devcontainer/git-setup.sh || echo "⚠️  Git setup had issues but continuing..."

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