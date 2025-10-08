# Dev Container Configuration

## 📦 What is a Dev Container?

A **Development Container** (or Dev Container) is a Docker container specifically configured as a full-featured development environment. When you open this project in VS Code with the **Dev Containers extension**, VS Code runs inside the container, providing:

- **Consistent environment** across all machines (eliminates "works on my machine" issues)
- **Pre-installed tools** (Node.js, npm, git, extensions)
- **Isolated dependencies** (doesn't interfere with your host system)
- **Production-like setup** (same Linux environment as deployment servers)

## 🎓 Student Benefits

1. **Zero Setup Time**: No need to install Node.js, MySQL, or configure environment variables manually
2. **Same Setup for Everyone**: Instructors and all students work in identical environments
3. **Learn Docker**: Hands-on experience with containerized development
4. **Easy Cleanup**: Delete the container when done - no leftover files on your machine

## 🚀 Quick Start

### Prerequisites

1. **Install Docker Desktop**
   - macOS: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

2. **Install VS Code**
   - [Download VS Code](https://code.visualstudio.com/)

3. **Install Dev Containers Extension**
   - Open VS Code
   - Go to Extensions (Cmd/Ctrl+Shift+X)
   - Search for "Dev Containers" by Microsoft
   - Click Install

### Opening the Project in a Dev Container

1. **Open the project folder** in VS Code (`File > Open Folder...`)
2. VS Code will detect the `.devcontainer` configuration
3. Click **"Reopen in Container"** when prompted (or use Command Palette: `Dev Containers: Reopen in Container`)
4. Wait for the container to build (first time takes 2-5 minutes)
5. Once ready, open the integrated terminal (`` Ctrl+` ``)
6. Install dependencies: `npm install` (if not already done by postCreateCommand)
7. Start development servers: `npm run dev`

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **MySQL**: localhost:3306 (use MySQL Workbench or any DB client)

## 📁 Configuration Files

This directory contains two devcontainer configurations:

### 1. `devcontainer.json` (Default - Docker Compose)

**Best for**: Full-stack development with MySQL, backend, and frontend orchestrated together.

**Features**:
- Uses `docker-compose.yml` to start all services (MySQL, backend, frontend)
- VS Code attaches to the backend service
- All services communicate via Docker network
- Includes healthchecks to ensure services start in correct order

**When to use**:
- You want a complete, production-like environment
- You're learning about microservices and service orchestration
- You want to test the full stack together

### 2. `devcontainer-standalone.json` (Alternative - Standalone)

**Best for**: Simpler setup focusing on Node.js development only.

**Features**:
- Single Node.js container (no docker-compose)
- You manage MySQL separately (local install or separate Docker command)
- Lighter weight and faster startup

**When to use**:
- You already have MySQL installed locally
- You want a minimal setup
- You're focusing on frontend/backend code, not infrastructure

**To switch to standalone mode**:
```bash
# Rename current config
mv devcontainer.json devcontainer-compose.json

# Use standalone config
mv devcontainer-standalone.json devcontainer.json

# Reopen in container (Cmd/Ctrl+Shift+P → "Dev Containers: Rebuild Container")
```

## 🛠️ Installed Extensions

The dev container automatically installs these VS Code extensions:

### Essential
- **ESLint**: JavaScript linting (catch errors before runtime)
- **Prettier**: Code formatting (consistent style)

### React Development
- **ES7+ React/Redux Snippets**: Quick React component templates

### Database
- **SQLTools**: SQL client for querying MySQL directly from VS Code
- **SQLTools MySQL Driver**: MySQL connection support

### Docker
- **Docker**: Syntax highlighting and commands for Dockerfiles

### Git
- **GitLens**: Enhanced Git features (blame, history, etc.)

### Utilities

- **Path Intellisense**: Auto-complete file paths in imports
- **Auto Rename Tag**: Rename paired HTML/JSX tags together
- **Tailwind CSS IntelliSense**: Tailwind class suggestions
- **REST Client**: Test API endpoints with `.http` files

## 🔧 Common Tasks

### Install New Package

```bash
# For backend
npm install --workspace=backend <package-name>

# For frontend
npm install --workspace=frontend <package-name>

# Dev dependency
npm install --workspace=backend --save-dev <package-name>
```

### Run Backend Only

```bash
npm run dev:backend
```

### Run Frontend Only

```bash
npm run dev:frontend
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Access MySQL Command Line

```bash
# From host terminal (Docker Desktop must be running)
docker exec -it minimal-app-mysql-1 mysql -u appuser -p
# Password: apppassword (default)
```

Or use SQLTools extension in VS Code (Cmd/Ctrl+Shift+P → "SQLTools: Add New Connection")

## 🐛 Troubleshooting

### Container Build Fails

**Problem**: Docker build errors or timeout

**Solutions**:

- Ensure Docker Desktop is running
- Check internet connection (Docker pulls images from registry)
- Try rebuilding: `Dev Containers: Rebuild Container` (Command Palette)
- Check Docker Desktop has sufficient resources (Settings > Resources)

### Ports Already in Use

**Problem**: `Error: Port 3306/4000/5173 is already allocated`

**Solutions**:

- Stop conflicting services on your host machine
- Change ports in `docker-compose.yml` or `devcontainer.json`
- Find and kill process using port: `lsof -i :3306` (macOS/Linux) or `netstat -ano | findstr :3306` (Windows)

### Hot Reload Not Working

**Problem**: Code changes don't trigger automatic reload

**Solutions**:

- Check volume mounts in `docker-compose.yml` are correct
- Restart the dev server (Ctrl+C and `npm run dev` again)
- On Windows: Ensure WSL 2 backend is enabled in Docker Desktop (Settings → General)
- We've enabled polling watchers (CHOKIDAR_USEPOLLING, WATCHPACK_POLLING) to improve change detection on Windows shares
- Try rebuilding container

### MySQL Connection Refused

**Problem**: Backend can't connect to MySQL

**Solutions**:

- Wait for MySQL healthcheck to complete: `docker compose ps` (should show "healthy")
- Check environment variables in `docker-compose.yml` match your backend `.env`
- View MySQL logs: `docker compose logs mysql`
- Restart services: `docker compose restart`

### Permission Errors

**Problem**: `EACCES` or permission denied errors

**Solutions**:

- The container runs as user `node` (non-root)
- Our post-create script attempts to chown `node_modules` to `node`. On Windows/macOS this is best-effort and usually harmless if it fails.
- On Windows, prefer WSL 2 backend in Docker Desktop. Avoid placing the repo under a Windows network share.
- Check file ownership: `ls -la`
- If needed, inside the container: `sudo chown -R node:node /workspace` (sudo may not be required)

### Git Authentication Issues

**Problem**: Git asks for credentials repeatedly or SSH authentication fails

**Solutions**:

- We use SSH Agent Forwarding via VS Code, so you don't need to mount `~/.ssh` into the container.
- Ensure your SSH agent is running and has keys loaded on the host.
  - macOS: `ssh-add -l` should list your key.
  - Windows: Use OpenSSH Agent or Pageant; VS Code forwards the agent socket automatically.
- **For HTTPS repos**: Git will cache credentials for 1 hour. Use a personal access token instead of password
- **For SSH repos**: Ensure your SSH keys exist in `~/.ssh/` on your host machine
- Check Git configuration: `git config --global --list`
- Set user info if missing:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- For SSH key issues: `ssh -T git@github.com` to test SSH connection
- Rebuild container if Git setup seems broken: `Dev Containers: Rebuild Container`

## 📚 Learning Resources

### Dev Containers
- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Specification](https://containers.dev/)

### Docker
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### This Project
- See main `README.md` in project root for application-specific documentation
- Check `docker-compose.yml` for service configuration details
- Read comments in source files for teaching notes

## 💡 Tips for Students

1. **Explore the Terminal**: The integrated terminal runs inside the container. Try `pwd`, `ls`, `node --version` to see the Linux environment.

2. **Use SQLTools Extension**: Right-click a SQL file or use Command Palette to connect to MySQL and run queries directly in VS Code.

3. **Check Docker Desktop**: Open Docker Desktop to see running containers, logs, and resource usage.

4. **Experiment Safely**: The container is isolated. If you break something, just rebuild the container - your source code on the host is safe.

5. **Learn Docker Commands**: Open a terminal outside the container and try:
   ```bash
   docker compose ps          # List running services
   docker compose logs -f     # Follow all logs
   docker compose restart     # Restart all services
   docker compose down        # Stop and remove containers
   docker compose up --build  # Rebuild and start
   ```

6. **Customize Your Setup**: Edit `devcontainer.json` to add more extensions or change settings. Rebuild the container to apply changes.

## 🎯 Extension Points for Advanced Students

Want to enhance the dev container? Try these challenges:

1. **Add Prettier Configuration**: Create `.prettierrc` with your team's formatting rules
2. **Pre-commit Hooks**: Install Husky to run linters before commits
3. **Add More Extensions**: Database GUI (e.g., MySQL Workbench alternative), REST client alternatives
4. **Custom Shell**: Configure zsh with plugins in `postCreateCommand`
5. **Add Redis**: Extend `docker-compose.yml` to include Redis for caching exercises
6. **Production Build**: Create a separate devcontainer for production testing (optimized images)

---

**Questions?** Ask your instructor or check the [VS Code Dev Containers FAQ](https://code.visualstudio.com/docs/devcontainers/faq).
