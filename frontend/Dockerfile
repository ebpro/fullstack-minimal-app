FROM node:22-bookworm-slim

WORKDIR /usr/src/app

# 📦 npm Workspaces: Copy workspace configuration files
# The root package.json defines workspaces, and package-lock.json manages all dependencies
# Build context must be parent directory (set in docker-compose.yml: context: .)
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/

# Use npm ci for production-ready, reproducible builds (faster & deterministic)
# npm ci requires package-lock.json and installs exact versions from the lockfile
# Install only frontend workspace dependencies (not backend)
# ---------------------------------------------------------------------------
# Student notes:
# - We copy the root `package-lock.json` because this repo uses npm workspaces.
#   The root lockfile pins versions for all workspaces (frontend + backend).
# - The `--workspace=frontend` flag tells npm to install only the frontend deps
#   from the lockfile. `--include=dev` includes devDependencies which are useful
#   for running the dev server inside the container (HMR, tooling). In production
#   images you can omit `--include=dev` and run `npm run build` instead.
# - Build locally (from repo root):
#     docker build -f frontend/Dockerfile -t minimal-app-frontend .
#   With Docker Compose the compose file already sets the correct context.
# - If you change dependencies, re-run `npm install` at repo root and commit the
#   updated `package-lock.json` (this project teaches why lockfiles are important).
# ---------------------------------------------------------------------------
RUN apt-get update \
	&& apt-get install -y --no-install-recommends curl ca-certificates \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm ci --workspace=frontend --include=dev --silent

# Copy rest of the frontend app
COPY frontend/ ./frontend/

# Set working directory to frontend
WORKDIR /usr/src/app/frontend

# Fix permissions for the node user (Student Notes)
# This ensures the node user can write to node_modules and create Vite temp files
# The chown command changes ownership of all files to the node user (UID 1000)
RUN chown -R node:node /usr/src/app

EXPOSE 5173

# Default to dev server. For production builds, override the command to `npm run build`.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
