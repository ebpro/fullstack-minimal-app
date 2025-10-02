# Dev Container Troubleshooting Guide

## Common Issues and Solutions

### 1. DevContainer Features Not Compatible with Alpine Linux

**Problem**: DevContainer fails to build with error "Linux distro alpine not supported".

**Symptoms**:
- Container build fails during feature installation
- Error message: "Linux distro alpine not supported"
- Node.js feature installation fails

**Solution**:
The DevContainer configuration has been updated to use a separate docker-compose.dev.yml file with Debian-based images:
```bash
# The issue is resolved by using docker-compose.dev.yml instead of the main docker-compose.yml
# which uses Debian-based node:22-bullseye instead of node:22-alpine
```

**Why this happens**:
DevContainer features like Node.js installation only support Debian/Ubuntu-based images, not Alpine Linux.

---

## 2. Permission Errors (EACCES)

**Problem**: Getting permission denied errors when running npm commands or accessing files.

**Symptoms**:
- `npm install` fails with EACCES errors
- Cannot create or modify files in the workspace
- Error messages mentioning permission denied

---

### 3. 🔌 Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
```bash
# Find what's using the port:
lsof -i :4000  # or :5173 or :3306

# Kill the process:
kill -9 <PID>

# Or change ports in docker-compose.yml:
ports:
  - '4001:4000'  # Use 4001 on host instead
```

---

### 4. 🌐 Frontend Opens Browser but Shows No Content

**Problem**: Browser opens automatically but page stays blank or shows connection error.

**Symptoms**:
- VS Code detects frontend and opens browser
- Browser shows "This site can't be reached" or blank page
- Port 5173 forwarding appears to work

**Root Cause**: Vite dev server not binding to correct host in Docker

**Solution**: Ensure Vite config has Docker-compatible settings
```javascript
// In frontend/vite.config.js
export default defineConfig({
  server: {
    port: 5173,
    host: '0.0.0.0',  // CRITICAL: Bind to all interfaces for Docker
    watch: {
      usePolling: true  // Enable file watching in Docker
    }
  }
})
```

**Alternative**: Start frontend with explicit host binding
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

---

### 5. 🔄 Hot Reload Not Working

**Problem**: You save a file but changes don't appear in the browser.

**Symptoms**:
- Frontend doesn't update when you save files
- Need to manually refresh browser
- Vite HMR (Hot Module Replacement) not working

**Solution**: Check volume mounts and enable polling
```yaml
# In docker-compose.yml, ensure frontend volume is mounted correctly:
volumes:
  - ./frontend:/usr/src/app:cached  # :cached improves performance on macOS
```

**Alternative solution**: Enable polling in Vite config (already included in fix above)
```javascript
// In frontend/vite.config.js - usePolling: true enables Docker file watching
export default defineConfig({
  server: {
    watch: {
      usePolling: true,  // Enable polling for Docker
      interval: 1000     // Poll every second
    }
  }
})
```

---

### 4. 💾 MySQL Connection Failed

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
ER_ACCESS_DENIED_ERROR: Access denied for user 'appuser'@'backend'
```

**Solution:**
```bash
# Check MySQL health:
docker compose ps

# Wait for 'healthy' status:
mysql    Up (healthy)

# If unhealthy, check logs:
docker compose logs mysql

# Reset database:
docker compose down -v
docker compose up -d mysql
# Wait 30 seconds for initialization
```

---

### 5. 🧹 Cannot Delete node_modules on Windows

**Symptom:**
- `rm -rf node_modules` fails with "Permission denied"
- Files appear locked

**Solution:**
```bash
# Stop all containers first:
docker compose down

# Then delete (PowerShell):
Remove-Item -Recurse -Force node_modules

# Or use Docker to clean:
docker run --rm -v ${PWD}:/app alpine sh -c "rm -rf /app/node_modules"
```

---

### 6. 🔧 Extensions Not Working

**Symptom:**
- ESLint not showing errors
- Prettier not formatting
- IntelliSense not working

**Solution 1: Reload Window**
```
Cmd/Ctrl + Shift + P → "Developer: Reload Window"
```

**Solution 2: Reinstall Extensions**
```
Cmd/Ctrl + Shift + P → "Dev Containers: Rebuild Container"
```

**Solution 3: Check Extension Settings**
```json
// .vscode/settings.json should have:
{
  "eslint.workingDirectories": [
    { "pattern": "./backend" },
    { "pattern": "./frontend" }
  ]
}
```

---

### 7. 🐳 Docker Compose File Not Found

**Symptom:**
```
Error: docker-compose.yml not found
```

**Solution:**
The devcontainer.json references `../docker-compose.yml` (parent directory).

Ensure your workspace is opened at the **minimal-app** level, not the parent directory.

```
✅ Correct: Open /path/to/minimal-app
❌ Wrong:   Open /path/to/notebooks (parent)
```

---

### 8. 📦 Package Not Found After Update

**Symptom:**
```
Error: Cannot find module 'some-package'
```

**Solution:**
```bash
# Rebuild node_modules:
rm -rf node_modules package-lock.json
npm install

# Or rebuild container:
# Cmd/Ctrl + Shift + P → "Dev Containers: Rebuild Container"
```

---

### 9. 🚀 Services Start but Pages Don't Load

**Symptom:**
- Backend returns 200 on `/health`
- But browser shows "Cannot reach" or ERR_CONNECTION_REFUSED

**Solution:**
Check port forwarding in VS Code:
```
1. Open "PORTS" tab in VS Code bottom panel
2. Verify ports 4000, 5173, 3306 are listed
3. If not, add manually: Click "+" → Enter port → Forward
4. Check "Local Address" column shows localhost:PORT
```

**Alternative:** Access via Docker IP directly:
```bash
docker inspect minimal-app-backend-1 | grep IPAddress
# Use that IP instead of localhost
```

---

### 10. 💾 Changes Lost After Container Restart

**Symptom:**
- Code changes disappear when reopening VS Code
- Database data is lost

**Solution:**
This indicates volumes are not persisting. Check:

```yaml
# docker-compose.yml should have:
volumes:
  db_data:              # Named volume for MySQL
  backend_node_modules: # Named volume for backend deps
  frontend_node_modules: # Named volume for frontend deps
```

Ensure mounts use host paths:
```yaml
volumes:
  - ./backend:/usr/src/app:rw  # Maps to host directory
```

---

## 🔍 General Debugging Steps

### 1. Check Container Status
```bash
docker compose ps
# All services should show "Up" or "Up (healthy)"
```

### 2. View Logs
```bash
docker compose logs -f backend   # Follow backend logs
docker compose logs -f frontend
docker compose logs -f mysql
```

### 3. Access Container Shell
```bash
docker compose exec backend sh
# Or from VS Code: Open integrated terminal (already in container)
```

### 4. Verify Environment Variables
```bash
# Inside container:
printenv | grep DB_
printenv | grep VITE_
```

### 5. Nuclear Option: Full Reset
```bash
# Stop and remove everything:
docker compose down -v

# Remove all images:
docker compose down --rmi all

# Remove node_modules on host:
rm -rf node_modules backend/node_modules frontend/node_modules

# Rebuild:
docker compose build --no-cache
docker compose up -d

# Or in VS Code:
# Cmd/Ctrl + Shift + P → "Dev Containers: Rebuild Container Without Cache"
```

---

## 📚 Useful Commands

### Docker Compose
```bash
docker compose up -d          # Start all services in background
docker compose down           # Stop and remove containers
docker compose down -v        # Also remove volumes (⚠️ deletes data)
docker compose ps             # List running services
docker compose logs -f SERVICE # Follow logs for a service
docker compose restart SERVICE # Restart a single service
docker compose exec SERVICE sh # Open shell in service
```

### Docker
```bash
docker ps                     # List running containers
docker images                 # List images
docker system prune -a        # Clean up everything (use with caution)
docker volume ls              # List volumes
docker volume rm VOLUME_NAME  # Remove a volume
```

### npm Workspace Commands (from repo root)
```bash
npm install                   # Install all workspaces
npm run dev                   # Start both backend and frontend
npm run dev:backend           # Start backend only
npm run dev:frontend          # Start frontend only
npm test --workspace=backend  # Run backend tests
npm run lint                  # Lint all code
```

---

## 🆘 Still Having Issues?

1. **Check Docker Desktop** is running and has enough resources:
   - Settings → Resources → Memory: At least 4GB
   - Settings → Resources → Disk: At least 20GB free

2. **Update Docker Desktop** to the latest version

3. **Check Docker logs**:
   ```bash
   docker compose logs
   ```

4. **Verify Docker Compose version**:
   ```bash
   docker compose version
   # Should be v2.x or higher
   ```

5. **Check VS Code Dev Containers extension** is installed and updated

6. **Search the logs** for specific errors:
   ```bash
   docker compose logs 2>&1 | grep -i error
   ```

7. **Report the issue** with:
   - Full error message
   - Output of `docker compose ps`
   - Output of `docker compose logs`
   - Your OS and Docker version

---

## 📖 Additional Resources

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Troubleshooting Docker on Windows](https://docs.docker.com/desktop/troubleshoot/overview/)
- [Troubleshooting Docker on Mac](https://docs.docker.com/desktop/troubleshoot/overview/)

---

**Last Updated:** October 1, 2025  
**Maintainer:** Teaching Team  
**For Students:** Read this document when you encounter issues before asking for help!
