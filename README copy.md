# Minimal Product Catalog — Full-Stack Teaching Application

> **A production-ready, pedagogical starting point for teaching modern full-stack web development to L3 students.**

[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

## 🎯 What Is This?

This is a **minimal but complete** full-stack web application demonstrating:

- ✅ **RESTful API** with Node.js + Express
- ✅ **Modern React** with Hooks and React Router
- ✅ **MySQL database** with proper schema design
- ✅ **Input validation** and error handling
- ✅ **Docker Compose** orchestration
- ✅ **Production-ready patterns** (health checks, logging, PropTypes)

**Perfect for:** Teaching L3 (3rd-year undergraduate) students full-stack development with industry best practices.

---

## 📐 Architecture

```text
Frontend (React + Vite + Tailwind)
         ↓ HTTP/JSON
Backend (Node.js + Express)
         ↓ SQL
Database (MySQL 8.0)
```

**Key Features:**

- 📦 Product catalog with categories
- 🔍 Pagination and filtering
- ✏️ Full CRUD operations
- 🔐 SQL injection protection
- ✅ Input validation
- 🏥 Health monitoring
- 🐳 Docker-first development

See [TEACHING_NOTES.md](./TEACHING_NOTES.md) for detailed learning objectives.

---

## 🚀 Quick Start

### For students (super quick)

From the repository root:

```bash
# Install dependencies for both workspaces (backend + frontend)
npm install

# Start both dev servers at once (uses npm workspaces + concurrently)
npm run dev

# Backend health: http://localhost:4000/health
# Frontend (Vite): http://localhost:5173/
```

To run a single workspace instead of both at once:

```bash
npm run dev:backend   # backend only
npm run dev:frontend  # frontend only
```

Note: copying `.env.example` into `.env` is optional — the compose file and app code include sensible defaults for typical local development.

## 🚀 Student Quick Start

**First Time Setup** (5-10 minutes):
```bash
# 1. Install prerequisites
# - Docker Desktop (docker.com)
# - VS Code (code.visualstudio.com)
# - Dev Containers extension (in VS Code)

# 2. Open project in VS Code
# File > Open Folder... → select minimal-app directory

# 3. Reopen in container
# Click "Reopen in Container" notification
# OR: Cmd/Ctrl+Shift+P → "Dev Containers: Reopen in Container"

# 4. Wait for build (first time: 2-5 minutes)

# 5. Open terminal in VS Code (Ctrl+`) and run:
npm install  # Install dependencies (if not auto-installed)
npm run dev  # Start both frontend and backend

# 6. Open browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

**Daily Workflow**:
```bash
# Open VS Code → it reopens in container automatically
# Terminal already connected to container
npm run dev  # Start development servers
# Code, save, see changes instantly (hot reload)
```

### Option 1: Docker Compose (Recommended for beginners)

You need to install Docker and run:

```bash
cd minimal-app
docker compose up --build
```

- **Frontend:** http://localhost:5173 (development)
- **Backend:** http://localhost:4000
- **Health Check:** http://localhost:4000/health

### Option 2: Manual Setup (For development)

#### 1. Start MySQL

You can run MySQL manually or via Docker:

```bash
docker compose up -d mysql
```

If you run MySQL manually, ensure you create the database and user as per `db/init.sql`.

#### 2. Start Backend

```bash
cd backend
# Optional: copy example to .env to override defaults locally
cp .env.example .env
npm install
npm run dev
```

Backend will run on http://localhost:4000

You can test the health endpoint:

```bash
curl http://localhost:4000/health
```

#### 3. Start Frontend

```bash
cd frontend
# Optional: copy example to .env to override defaults locally
cp .env.example .env
npm install
npm run dev
```

Frontend will run on http://localhost:5173

---

## 📂 Project Structure

```bash
minimal-app/
├── backend/
│   ├── src/
│   │   ├── index.js              # Main server (middleware, routes)
│   │   ├── db.js                 # MySQL connection pool
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Centralized error handling
│   │   │   ├── validators.js     # Input validation rules
│   │   │   └── staticServing.js  # Optional frontend serving
│   │   └── routes/
│   │       ├── products.js       # Product CRUD endpoints
│   │       └── categories.js     # Category endpoints
│   ├── test/
│   │   └── smoke.js              # Smoke tests with assertions
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main component (routing, health check)
│   │   ├── main.jsx              # React entry point
│   │   ├── styles.css            # Tailwind imports
│   │   └── components/
│   │       ├── ProductList.jsx   # Product listing with pagination
│   │       ├── ProductDetail.jsx # Single product view
│   │       └── ProductForm.jsx   # Create/edit form
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── db/
│   └── init.sql                  # Database schema + seed data
├── docker-compose.yml            # Orchestration with health checks
├── README.md                     # This file
└── TEACHING_NOTES.md             # Instructor guide
```

---

## 🔌 API Endpoints

### Products

| Method  | Endpoint                 | Description                         | Query Params                     |
|--------:|:------------------------:|:-----------------------------------:|:--------------------------------:|
| GET     | `/api/products`          | List products (paginated)           | `page`, `per_page`, `category_id` |
| GET     | `/api/products/:id`      | Get single product                  | -                                |
| POST    | `/api/products`          | Create product                      | -                                |
| PUT     | `/api/products/:id`      | Update product                      | -                                |
| DELETE  | `/api/products/:id`      | Delete product                      | -                                |

### Categories

| Method | Endpoint         | Description         |
|:------:|:----------------:|:-------------------:|
| GET    | `/api/categories`| List all categories |

### System

| Method | Endpoint | Description                         |
|:------:|:--------:|:-----------------------------------:|
| GET    | `/health`| Health check (includes DB status)   |

**Example Request:**

```bash
curl http://localhost:4000/api/products?page=1&per_page=10
```

**Example Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "USB-C Charger",
      "description": "Fast 30W USB-C charger",
      "price": 19.99,
      "image_url": "https://placehold.co/600x400?text=USB-C+Charger",
      "category_id": 1,
      "category_name": "Electronics",
      "created_at": "2025-10-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "per_page": 10,
    "total_pages": 2
  }
}
```

---

## 🧪 Testing

### Backend Smoke Tests

```bash
cd backend
npm test
```

Tests include:

- ✅ Health endpoint
- ✅ Product listing
- ✅ Category listing
- ✅ 404 handling
- ✅ Invalid ID handling

---

## 🛠️ Development Commands

### Backend

```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start in production mode
npm test       # Run smoke tests
npm run lint   # Run ESLint
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## � Dev Container Configuration

This project includes a VS Code Dev Container setup to give students a reproducible development environment. The configuration lives in the `.devcontainer/` directory and supports two modes:

- Compose mode (`devcontainer.json`): orchestrates `mysql`, `backend`, and `frontend` via Docker Compose. Best for full-stack exercises.
- Standalone mode (`devcontainer-standalone.json`): single Node.js container for lightweight development (manage MySQL separately).

### Quick Dev Container Start

Prerequisites:

- Docker Desktop
- VS Code with the "Dev Containers" extension

Steps:

1. Open the `minimal-app` folder in VS Code.
2. When prompted, click "Reopen in Container" (or run: Command Palette → "Dev Containers: Reopen in Container").
3. Wait for the container to build (first time may take a few minutes).
4. Open the integrated terminal and, if needed, run `npm install`.
5. Start the servers manually from the integrated terminal (recommended for teaching):

```bash
# Start backend (inside container)
cd backend
npm run dev

# In a separate terminal inside the container: start frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173

Backend API: http://localhost:4000

### Key Dev Container Notes

- The Dev Container runs a non-root `node` user for safety. If you see permission errors, fix ownership inside the container:

```bash
sudo chown -R node:node /usr/src/app
```

- The `.devcontainer/docker-compose.dev.yml` file provides a Debian-based environment (Node 22 on bullseye) compatible with Dev Container features. The project's main `docker-compose.yml` uses Alpine images for smaller production images; Dev Container features require Debian/Ubuntu in some cases.

- The Dev Container installs recommended VS Code extensions such as ESLint, Prettier, SQLTools (MySQL driver), Docker, GitLens, Path Intellisense, Auto Rename Tag, Tailwind IntelliSense, and REST Client.

---

## 🛠️ Common Dev Container Tasks & Troubleshooting

### Dev Container build fails with "Linux distro alpine not supported"

Cause: The Dev Container Node feature does not support Alpine base images.

Fix: Use `.devcontainer/docker-compose.dev.yml` which uses Debian-based Node images (for example `node:22-bullseye`) and ensure `devcontainer.json` references it.

### Browser opens but frontend shows no content

Cause: When running Vite inside a container, it must bind to `0.0.0.0` (not `localhost`) to be reachable from the host.

Fixes:

- Ensure `frontend/vite.config.js` contains:

```javascript
server: {
  port: 5173,
  host: '0.0.0.0', // Bind to all interfaces for Docker
  watch: { usePolling: true }
}
```

- Start the frontend manually inside the container:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

### Permission errors (EACCES)

If `npm install` fails with EACCES errors, the mounted workspace may be owned by root while the container runs as `node`. Fix ownership:

```bash
sudo chown -R node:node /usr/src/app
npm install
```

### Ports already in use

If ports 5173, 4000, or 3306 are in use on your host, stop the conflicting services or change port mappings in `docker-compose.yml`.

### MySQL health / connection issues

- Wait for the MySQL healthcheck to report healthy with `docker compose ps`.
- Check logs: `docker compose logs mysql`.

---

## 📚 Useful Commands (Dev Container / Docker)

```bash
docker compose -f .devcontainer/docker-compose.dev.yml up -d
docker compose -f .devcontainer/docker-compose.dev.yml down
docker compose ps
docker compose logs -f
```

---

## 📖 Additional Resources

- Dev Containers docs: https://code.visualstudio.com/docs/devcontainers/containers
- Express best practices: https://expressjs.com/en/advanced/best-practice-performance.html
- React documentation: https://react.dev/

---

## 🤝 Contributing

This is a teaching project. Contributions that improve pedagogy are welcome. Please keep changes small, comment "why" as well as "what", and update `TEACHING_NOTES.md` for new exercises.

---

## 📚 Tech Stack

| Layer    | Technology       | Version |
|:--------:|:----------------:|:-------:|
| Frontend | React            | 19.1    |
| Frontend | Vite             | 7.1     |
| Frontend | Tailwind CSS     | 3.4     |
| Frontend | React Router     | 7.9     |
| Backend  | Node.js          | 22      |
| Backend  | Express          | 4.18    |
| Database | MySQL            | 8.0     |

---

## 📝 License

MIT License - Free for educational use

---

## 🙋 Support

**For Students:** Read [TEACHING_NOTES.md](./TEACHING_NOTES.md) first.
**For Instructors:** See teaching strategies and common issues in `TEACHING_NOTES.md`.
**Issues:** Open an issue for bugs or pedagogical improvements.


