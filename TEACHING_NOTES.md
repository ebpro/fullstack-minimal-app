# Teaching Notes — Minimal Product Catalog

## 🎯 Learning Objectives

This application is designed as a **complete, production-ready starting point** for teaching full-stack web development to L3 (3rd-year undergraduate) students. It demonstrates modern best practices while remaining simple enough to understand completely.

### Core Concepts Covered

#### 1. **Backend (Node.js + Express + MySQL)**

- RESTful API design (proper HTTP methods, status codes, resource naming)
- Database connection pooling (`mysql2/promise`)
- SQL JOIN queries and pagination
- Input validation with `express-validator`
- Centralized error handling
- Request logging with `morgan`
- Environment configuration with `dotenv`
- Parameterized queries (SQL injection prevention)

#### 2. **Frontend (React + Vite + Tailwind CSS)**

- React Hooks (`useState`, `useEffect`)
- Client-side routing with React Router
- Form handling and validation
- Loading states and error handling
- PropTypes for runtime type checking
- Component composition
- API communication with `fetch`
- Backend health monitoring

#### 3. **Database (MySQL)**

- Schema design with foreign keys
- ON DELETE CASCADE/SET NULL strategies
- Seed data for development
- LEFT JOIN queries

#### 4. **DevOps & Tooling**

- Docker Compose orchestration
- Health checks and service dependencies
- Environment variables
- ESLint for code quality
- Smoke testing

**Key Teaching Point — Service Dependencies:**

This project uses **Docker Compose healthchecks** to manage service startup order:

```yaml
backend:
  depends_on:
    mysql:
      condition: service_healthy
```

This ensures MySQL is fully ready before the backend starts. **We don't use wait scripts** (like `wait-for-it.sh` or custom `wait-for-db.js`) because:

1. **Separation of concerns** — Infrastructure handles infrastructure (compose), application handles application logic (Node.js)
2. **Industry standard** — Healthchecks are used in production (Kubernetes readiness/liveness probes)
3. **Simpler debugging** — `docker compose ps` shows service health status visually
4. **Resilient by design** — The mysql2 connection pool automatically retries connections

**Teaching moment for students:** "If the backend starts and MySQL isn't ready, the connection pool will retry automatically. Compose healthchecks just optimize startup order to avoid unnecessary retries."

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│                    http://localhost:5173                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                        │
│                  http://localhost:4000                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Logging    │  │  Validation  │  │Error Handler │       │
│  │   (morgan)   │  │(express-     │  │              │       │
│  └──────────────┘  │ validator)   │  └──────────────┘       │
│                    └──────────────┘                         │
│                                                             │
│  Routes:                                                    │
│  • GET    /health                                           │
│  • GET    /api/products                                     │
│  • GET    /api/products/:id                                 │
│  • POST   /api/products                                     │
│  • PUT    /api/products/:id                                 │
│  • DELETE /api/products/:id                                 │
│  • GET    /api/categories                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ SQL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                           │
│                                                             │
│  Tables:                                                    │
│  • categories (id, name)                                    │
│  • products (id, name, description, price, image_url,       │
│              category_id [FK], created_at)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Teaching Points by File

### Backend

#### `src/index.js` (Main Server File)

**Teaching points:**

- Middleware order matters (logging → parsing → routes → error handling)
- Health checks for monitoring
- Separation of concerns (routes in separate files)
- CORS configuration for security

#### `src/middleware/errorHandler.js`

**Teaching points:**

- Centralized error handling (DRY principle)
- Custom error classes
- Async error handling with wrapper
- Consistent error response format
- Development vs production error messages

**Guided exercise:** Ask students to add a new `ValidationError` class for a specific HTTP 422 status.

#### `src/middleware/validators.js`

**Teaching points:**

- Never trust client input
- Validation chains for reusability
- Clear error messages
- Type coercion (string → number)
- Optional vs required fields

**Guided exercise:** Add validation for a new field (e.g., `stock_quantity` must be >= 0).

#### `src/routes/products.js`

**Teaching points:**

- RESTful conventions (GET for read, POST for create, PUT for update, DELETE for delete)
- Pagination implementation
- SQL JOIN for related data
- Error handling with `asyncHandler`
- Status codes (200, 201, 204, 400, 404, 500)

**Guided exercise:** Add search functionality with `LIKE` queries.

#### `src/db.js`

**Teaching points:**

- Connection pooling for performance
- Environment variables for configuration
- Reusable database client

### Frontend

#### `src/App.jsx` (Main Component)

**Teaching points:**

- React Router setup
- Lifting state up (categories shared across routes)
- Backend health monitoring
- Conditional rendering
- useEffect for side effects

**Guided exercise:** Add dark mode toggle with `useState`.

#### `src/components/ProductForm.jsx`

**Teaching points:**

- Controlled form inputs
- Loading states to prevent double-submit
- Error handling with user feedback
- Reusable components (create vs edit mode)
- PropTypes for component contracts
- Form validation (client-side)

**Guided exercise:** Add image preview when URL is entered.

#### `src/components/ProductList.jsx`

**Teaching points:**

- Pagination with state management
- Filtering with query parameters
- Grid layout with Tailwind
- Loading indicators
- Delete confirmation

**Guided exercise:** Add sorting (by price, by name).

#### `src/components/ProductDetail.jsx`

**Teaching points:**

- URL parameters with `useParams`
- Navigation with `useNavigate`
- Error boundaries
- Conditional rendering

---

## 🧪 Common Student Exercises

### Beginner Level

1. **Add a new field** to products (e.g., `stock_quantity`)
   - Update database schema
   - Update backend validation
   - Update frontend forms

2. **Change styling** with Tailwind CSS
   - Modify colors, spacing, typography
   - Make it responsive

3. **Add confirmation dialogs** for delete operations

### Intermediate Level

4. **Implement product search**
   - Add search input in ProductList
   - Create backend endpoint with LIKE query
   - Handle debouncing

5. **Add category management**
   - Create, edit, delete categories
   - Prevent deleting categories with products

6. **Implement sorting**
   - Sort products by price, name, date
   - Add UI for sort selection

### Advanced Level

7. **Add authentication**
   - JWT tokens
   - Login/register pages
   - Protected routes

8. **Add image upload**
   - File upload endpoint
   - Store in cloud storage (AWS S3, Cloudinary)
   - Image optimization

9. **Add unit tests**
   - Jest for React components
   - Supertest for API routes
   - Mock database calls

---

## 🚨 Common Student Mistakes & How to Address

### 1. **SQL Injection**

❌ **Wrong:**
```javascript
const sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
```

✅ **Correct:**
```javascript
const sql = 'SELECT * FROM products WHERE id = ?';
await pool.query(sql, [req.params.id]);
```

**Teaching moment:** Show [XKCD Little Bobby Tables](https://xkcd.com/327/)

### 2. **Missing Error Handling**

❌ **Wrong:**
```javascript
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows); // What if query fails?
});
```

✅ **Correct:**
```javascript
router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
}));
```

### 3. **Not Validating Input**

❌ **Wrong:**
```javascript
const price = req.body.price; // Could be anything!
```

✅ **Correct:**
```javascript
router.post('/', validateProductCreate, asyncHandler(async (req, res) => {
  // price is validated and converted to number
  const price = req.body.price;
}));
```

### 4. **Hardcoding URLs**

❌ **Wrong:**
```javascript
fetch('http://localhost:4000/api/products')
```

✅ **Correct:**
```javascript
const BACKEND = import.meta.env.VITE_BACKEND_URL || '/api';
fetch(`${BACKEND}/api/products`)
```

### 5. **Not Committing `package-lock.json`**

❌ **Wrong:**

```bash
# Adding package-lock.json to .gitignore
echo "package-lock.json" >> .gitignore
```

✅ **Correct:**

```bash
# Always commit the lockfile
git add package-lock.json
git commit -m "chore: update dependencies"
```

**Teaching moment:** Explain that `package-lock.json` ensures reproducible builds — everyone gets identical dependency versions. This prevents "works on my machine" issues and protects against supply-chain attacks. In production/Docker, we use `npm ci` (not `npm install`) to leverage the lockfile for faster, deterministic installs.

**Common student question:** "Why is the lockfile so big?"  
**Answer:** It includes every transitive dependency with exact versions, checksums, and registry URLs. This is intentional — it's what makes builds reproducible.

---

## 📝 Assessment Ideas

### Quiz Questions

1. What is the purpose of `asyncHandler`?
2. Why do we use parameterized queries?
3. What HTTP status code should we return when creating a resource?
4. What is the difference between `useState` and `useEffect`?
5. Why validate on both client and server?

### Coding Assignments

1. **Add Reviews** - Add a reviews table and allow users to review products
2. **Shopping Cart** - Implement cart with localStorage
3. **Admin Dashboard** - Add admin views with statistics
4. **Export Data** - Add CSV/JSON export functionality

### Project Extensions

- Deploy to production (Render, Railway, Vercel)
- Add CI/CD pipeline (GitHub Actions)
- Implement real-time updates (WebSockets)
- Add pagination with URL state
- Implement infinite scroll

---

## 🔧 Development Workflow

### Initial Setup (Students do this once)

```bash
cd minimal-app
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up -d mysql
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

#### Quick-start for students (shortest path)

If you want the shortest path to run both parts of the app at once from the repository root (recommended for exercises), use the npm workspace commands:

```bash
# Install deps for both workspaces and hoist dev-deps
npm install

# Start backend + frontend concurrently from the root
npm run dev

# Backend health: http://localhost:4000/health
# Frontend: http://localhost:5173/
```

To start only one workspace from the root:

```bash
npm run dev:backend
npm run dev:frontend
```

Note: copying `.env.example` into `.env` in `backend` or `frontend` is optional for normal local development — the project provides sensible defaults.

### Daily Development

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Optional: Run tests
cd backend && npm test
```

### With Docker (Simplified)

```bash
docker compose up --build
```

---

## 📚 Additional Resources for Students

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [REST API Design Best Practices](https://restfulapi.net/)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

---

## 🎓 Instructor Tips

1. **Start simple** - Walk through the codebase file-by-file
2. **Live code** - Build features together in class
3. **Code review** - Review student PRs for learning
4. **Debugging sessions** - Show how to use browser DevTools and Node debugger
5. **Incremental complexity** - Start with GET, then POST, then PUT/DELETE
6. **Real-world context** - Explain why patterns matter in production
