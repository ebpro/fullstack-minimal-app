# Minimal Product Catalog — Full-Stack Teaching Application

> **A production-ready, pedagogical starting point for teaching modern full-stack web development to L3 students.**

[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/) [![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/) [![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/) [![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

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

See [LEARNING_NOTES.md](./LEARNING_NOTES.md) for detailed learning objectives.

---

## 🚀 Quick Start

### Prerequisites

- If possible install Docker Desktop (docker.com) for easiest setup
- Alternatively, install Node.js 22+ (nodejs.org) and MySQL 8.0+ locally. Create a MySQL database and user as per `db/init.sql` (in code see below).

### Get the Code

Get the source code locally:

- Clone the Git repository using the VS Code UI (Recommended):
  - View > Command Palette… → type and select “Git: Clone” (or on the Welcome page click “Clone Git Repository…”)
  - Paste: `git@github.com:ebpro/fullstack-minimal-app.git`
  - Choose a destination folder, then click “Open” when prompted
  - Tip: If you don’t have SSH keys set up, choose the HTTPS option in the dialog

- Or download ZIP and extract:
  - https://github.com/ebpro/fullstack-minimal-app/archive/refs/heads/develop.zip
  - `cd fullstack-minimal-app-develop/`

### To test the app quickly (No setup)

Run the following command in the application directory to start the app:

   ```bash
   docker compose up --build
   ```

### For modern daily development (Recommended)

**First Time Setup**:

1. Open project in VS Code
   - File > Open Folder... → select minimal-app directory
2. Reopen in container
   - Click "Reopen in Container" notification
   - OR: Cmd/Ctrl+Shift+P → "Dev Containers: Reopen in Container"
3. Wait for build (first time: 2-5 minutes)
4. Open terminal in VS Code (Ctrl+`) and run:

```bash
# From project root (inside container)
npm install  # Install dependencies (if not auto-installed)
npm run dev  # Start both frontend and backend
```

5. Open browser (if not auto-opened)
   Frontend: http://localhost:5173
   Backend API: http://localhost:4000

**Daily Workflow**:

```bash
# Open VS Code → it reopens in container automatically
# Terminal already connected to container
npm run dev  # Start development servers
# Code, save, see changes instantly (hot reload)
```

### For local manual setup (without Docker and Dev Container)

WARNING: This is not the recommended way to run the app. Use Docker and Dev Containers if possible. If you must run locally, ensure you have preceeding prerequisites (node, mysql and database created) installed and configured.

```bash
# Install dependencies for both workspaces (backend + frontend)
npm install

# Start both dev servers at once (uses npm workspaces + concurrently)
npm run dev

# Backend health: http://localhost:4000/health
# Frontend (Vite): http://localhost:5173/
# Scraper service: http://localhost:5000/health
```

Note: copying `.env.example` into `.env` is optional — the compose file and app code include sensible defaults for typical local development.

## 📂 Project Structure

```bash
fullstack-minimal-app/
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
│   ├── eslint.config.js
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
│   ├── index.html                # Vite entry point
│   ├── package.json
│   ├── .env.example
│   ├── eslint.config.js
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   ├── vite.config.js
│   └── Dockerfile
├── scraper-service/
│   ├── src/
│   │   ├── index.js              # Mock review scraper service
│   │   └── mockReviews.js        # Mock review data generator
│   ├── package.json
│   └── Dockerfile
├── db/
│   └── init.sql                  # Database schema + seed data
├── docker-compose.yml            # Orchestration with health checks
├── package.json                  # Root workspace configuration
├── README.md                     # This file
└── LEARNING_NOTES.md             # Student learning guide
```

**Structure Purpose:**

- **`frontend/src/`** - React application with components and styling
- **`backend/src/`** - Express REST API with routes, middleware, and database connection
- **`scraper-service/src/`** - Mock microservice for external data demonstration
- **`db/`** - Database schema and initialization
- **Root `package.json`** - npm workspace configuration for managing all services

---

## 🔌 API Endpoints

### Products

| Method |      Endpoint       |        Description        |           Query Params            |
| -----: | :-----------------: | :-----------------------: | :-------------------------------: |
|    GET |   `/api/products`   | List products (paginated) | `page`, `per_page`, `category_id` |
|    GET | `/api/products/:id` |    Get single product     |                 -                 |
|   POST |   `/api/products`   |      Create product       |                 -                 |
|    PUT | `/api/products/:id` |      Update product       |                 -                 |
| DELETE | `/api/products/:id` |      Delete product       |                 -                 |

### Categories

| Method |     Endpoint      |     Description     |
| :----: | :---------------: | :-----------------: |
|  GET   | `/api/categories` | List all categories |

### System

| Method | Endpoint  |            Description            |
| :----: | :-------: | :-------------------------------: |
|  GET   | `/health` | Health check (includes DB status) |

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

## 🛠️ Development Commands

- To run commands, open a terminal in VS Code (Ctrl+`) inside the Dev Container.

```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start in production mode
npm test       # Run smoke tests
npm run lint   # Run ESLint
```

### Test APIs quickly (REST Client)

- Open the file `api-tests.http` at the repo root.
- Install the "REST Client" VS Code extension (if not already present).
- Click "Send Request" above any request to exercise the Backend and Scraper endpoints.
- Tip: Adjust `@backendUrl` and `@scraperUrl` variables at the top if you changed ports.

- ADVANCED STUDENTS ONLY : To manage dependencies (run from project root):

```bash
npm install  # Install dependencies
npm ci       # Clean install (fresh node_modules)
npm outdated # Check for outdated packages
npm update   # Update packages (use cautiously)
```

---

## 🛠️ Common Dev Container Tasks & Troubleshooting

### Browser opens but frontend shows no content

Cause: When running Vite inside a container, it must bind to `0.0.0.0` (not `localhost`) to be reachable from the host.

Fixes:

- Check `frontend/.env` has `VITE_HOST=0.0.0.0`
- Start the frontend manually inside the container:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

### Ports already in use

If ports 5173, 4000, or 3306 are in use on your host, stop the conflicting services or change port mappings in `docker-compose.yml`.

Cause: Another app is using the same port.

Fixes:

- Stop the other app (e.g., Remove Docker containers from docker desktop UI, stop local MySQL server).

---

## Docker Container

This project uses Docker for easy setup and consistent environments. The easiest way to manage docker is via the Docker Desktop application.

## 🔌 SQLTools (VS Code)

- Dev Containers: SQLTools and the MySQL driver are already installed and preconfigured. Open SQLTools in VS Code and connect using the provided MySQL profile. No manual setup needed.
- Local VS Code (outside the container): if you prefer a local connection, add a profile with these defaults and be sure containers are running:
  - Host: 127.0.0.1, Port: 3306
  - Database: minimal_app_db
  - User/Password: appuser / apppassword

Note: These values come from docker-compose. If you changed MYSQL_DATABASE/USER/PASSWORD, use your custom values. Avoid exposing DB ports in production.

## Additional Resources

- Dev Containers docs: https://code.visualstudio.com/docs/devcontainers/containers
- Express best practices: https://expressjs.com/en/advanced/best-practice-performance.html
- React documentation: https://react.dev/

---

## 🤝 Contributing

This is a teaching project. Contributions that improve pedagogy are welcome. Please keep changes small, comment "why" as well as "what", and update `LEARNING_NOTES.md` for new exercises.

---

## 📚 Tech Stack

|  Layer   |  Technology  | Version |
| :------: | :----------: | :-----: |
| Frontend |    React     |  19.1   |
| Frontend |     Vite     |   7.1   |
| Frontend | Tailwind CSS |   3.4   |
| Frontend | React Router |   7.9   |
| Backend  |   Node.js    |   22    |
| Backend  |   Express    |  4.18   |
| Database |    MySQL     |   8.0   |

---

## 📝 License

MIT License - Free for educational use

---

## 🙋 Support

**For Students:** Read [LEARNING_NOTES.md](./LEARNING_NOTES.md) first.
**Issues:** Open an issue for bugs or pedagogical improvements.
