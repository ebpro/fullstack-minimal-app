#!/bin/bash
# ==============================================================================
# Git Setup Script for Dev Container
# ==============================================================================
# Purpose: Configure Git properly inside the dev container with minimal output
# ==============================================================================

echo "🔧 Setting up Git..."

# Fix SSH key permissions if SSH directory exists
if [ -d "/home/node/.ssh" ]; then
    chmod 700 /home/node/.ssh
    chmod 600 /home/node/.ssh/* 2>/dev/null || true
fi

# Configure Git if available
if git --version >/dev/null 2>&1; then
    git config --global credential.helper 'cache --timeout=3600' 2>/dev/null || true
    git config --global core.editor 'code --wait' 2>/dev/null || true
    git config --global --add safe.directory /workspace 2>/dev/null || true
    git config --global --add safe.directory /workspace/.. 2>/dev/null || true
    
    # Show warnings only for missing user configuration
    if ! git config --global user.name >/dev/null 2>&1; then
        echo "⚠️  Set Git user: git config --global user.name \"Your Name\""
    fi
    if ! git config --global user.email >/dev/null 2>&1; then
        echo "⚠️  Set Git email: git config --global user.email \"your.email@example.com\""
    fi
fi

# Test Git functionality quietly
cd /workspace
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo 'unknown')
    echo "✅ Git ready (branch: $BRANCH)"
else
    echo "⚠️  Git not working - check mounts in devcontainer.json"
fi