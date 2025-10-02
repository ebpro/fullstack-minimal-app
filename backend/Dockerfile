# Use official Node.js 22 image with Alpine Linux for a small footprint
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Build argument: set to 1 to build the frontend and copy dist into /usr/src/app/public
ARG BUILD_FRONTEND=0

# 📦 npm Workspaces: Copy root workspace configuration
# Install backend deps and utilities (build context is repo root)
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/

# Use npm ci for production-ready, reproducible builds (faster & deterministic)
# npm ci requires package-lock.json and installs exact versions from the lockfile
RUN npm ci --workspace=backend --include=dev --silent && \
	apk add --no-cache curl

# Optionally build frontend into /usr/src/app/public
# Copy full frontend sources so Vite can find index.html and all assets
COPY frontend/ frontend/
RUN if [ "$BUILD_FRONTEND" = "1" ]; then \
		cd frontend && npm ci --silent && VITE_BACKEND_URL=/api npm run build && \
		mkdir -p /usr/src/app/public && cp -r dist/* /usr/src/app/public/ ; \
	fi

# Copy backend source
COPY backend/ backend/

# Set working directory to backend
WORKDIR /usr/src/app/backend

EXPOSE 4000

# Start nodemon dev server
# Note: Docker Compose healthchecks ensure MySQL is ready before backend starts
# The mysql2 connection pool handles retries automatically if needed
CMD ["npm", "run", "dev"]
