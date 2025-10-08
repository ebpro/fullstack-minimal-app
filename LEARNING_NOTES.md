# Learning Guide — Minimal Product Catalog

## 🚀 What You'll Learn

This application is your **complete, production-ready starting point** for learning modern full-stack web development. It demonstrates industry best practices while remaining simple enough to understand completely. As an L3 (3rd-year undergraduate) student, you'll explore real-world patterns used in professional development.

### Core Concepts You'll Master

- **Frontend Development**: React ## 💻 Development Workflow9 with modern hooks, component architecture, and state management
- **Backend API Development**: RESTful APIs with Express.js, middleware patterns, and error handling
- **Database Design**: MySQL schema design, relationships, and query optimization
- **Development Workflow**: npm workspaces, concurrent development, and environment management
- **Service Architecture**: Understanding microservices through the scraper service example

---

## 🚀 Getting Started

> **First Time?** See [README.md](./README.md#quick-start) for complete setup instructions including Docker, Dev Containers, and local installation options.

### Quick Start Summary

Once you have the project set up (following the README), your development environment will start:

- **Frontend**: <http://localhost:5173> - React app with hot-reload
- **Backend**: <http://localhost:4000> - API server with your endpoints
- **Database**: MySQL on port 3306 - Persistent data storage
- **Scraper Service**: <http://localhost:5000> - Microservice example

**Ready to learn?** The sections below will guide you through understanding each component and building your full-stack skills step by step.

---

### Try the APIs quickly

Open `api-tests.http` at the project root and use the REST Client extension to send requests to:

- Backend: `{{backendUrl}}` (defaults to http://localhost:4000)
- Scraper: `{{scraperUrl}}` (defaults to http://localhost:5000)

This is the fastest way to explore endpoints without leaving VS Code.

## 📖 Learning Resources

### 1. **Backend (Node.js + Express + MySQL)**

- RESTful API design patterns
- Express middleware concepts (morgan, cors, helmet)
- Database connection pooling with mysql2
- Environment variable management
- Error handling and validation with express-validator
- CORS configuration for cross-origin requests
- Static file serving strategies

### 2. **Frontend (React + Vite + Tailwind CSS)**

- React Hooks (`useState`, `useEffect`)
- Client-side routing with React Router
- Form handling and validation
- Loading states and error handling
- PropTypes for runtime type checking
- Component composition
- API communication with `fetch`
- Backend health monitoring

### 3. **Database (MySQL)**

- Schema design with foreign keys
- ON DELETE CASCADE/SET NULL strategies
- Seed data for development
- LEFT JOIN queries
- CHECK constraints

### 4. **Development Tooling**

- Environment variables and configuration management
- ESLint v9 flat configuration
- Smoke testing and API health checks
- npm workspaces for monorepo management
- SQLTools (VS Code) to inspect MySQL data directly:
  - Inside Dev Container: already installed and preconfigured; open SQLTools and connect.
  - Local VS Code: create a profile for 127.0.0.1:3306 → DB `minimal_app_db`, user `appuser`, password `apppassword`.
  - Tip: Ensure containers are running (`docker compose up`) so the DB is reachable; seed data comes from `db/init.sql`.

### 5. **Microservices Pattern (Scraper Service)**

- Service separation and loose coupling
- Mock external APIs for development/testing
- CORS configuration for cross-service communication
- Independent service scaling and deployment
- RESTful API design for service integration

**🏗️ Understanding Multi-Service Architecture:**

You'll work with three application services plus MySQL:

- **Database server** (MySQL) — Stores your data
- **Main API server** (Backend) — Handles business logic
- **React development server** (Frontend) — User interface
- **Mock review service** (Scraper) — Microservice pattern demonstration

You'll discover:

- **Service isolation** — Each service runs independently
- **API communication** — Services communicate via HTTP/REST
- **Service dependencies** — Frontend needs backend, backend needs database
- **Development workflow** — All services support hot-reload during development

---

## 📐 Architecture Overview

```console
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
└──────────────────────────┬─────────┬────────────────────────┘
                           │         │
                           │ SQL     │ HTTP (Future: Reviews)
                           ▼         ▼
┌─────────────────────────────────────┐ ┌─────────────────────┐
│          MySQL Database             │ │   Scraper Service   │
│                                     │ │http://localhost:5000│
│  Tables:                            │ │                     │
│  • categories (id, name)            │ │  Mock review data   │
│  • products (id, name, description, │ │  from multiple      │
│              price, image_url,      │ │  e-commerce sites   │
│              category_id [FK],      │ │                     │
│              created_at)            │ │  Routes:            │
└─────────────────────────────────────┘ │  • GET /health      │
                                        │  • GET /api/scrape/ │
                                        │    reviews/:id      │
                                        │  • GET /api/scrape/ │
                                        │    sources          │
                                        │  • GET /api/scrape/ │
                                        │    products         │
                                        └─────────────────────┘
```

---

## What You'll Learn in Each File

### Backend

#### `src/index.js` (Main Server File)

**You'll understand:**

- Why middleware order matters (logging → parsing → routes → error handling)
- How health checks enable monitoring
- How separation of concerns keeps code organized (routes in separate files)
- Why proper CORS configuration is essential for security

#### `src/middleware/errorHandler.js`

**You'll master:**

- Centralized error handling (DRY principle)
- Creating custom error classes
- Handling async errors with wrapper functions
- Building consistent error response formats
- Differentiating between development and production error messages

**💻 Try this:** Add a new `ValidationError` class for HTTP 422 status codes and see how it integrates.

#### `src/middleware/validators.js`

**You'll learn why:**

- Never trust client input
- Validation chains create reusable patterns
- Clear error messages improve user experience
- Type coercion (string → number) prevents bugs
- Optional vs required fields must be handled differently

**💻 Try this:** Add validation for a new field (e.g., `stock_quantity` must be >= 0).

#### `src/routes/products.js`

**You'll discover:**

- RESTful conventions (GET for read, POST for create, PUT for update, DELETE for delete)
- How pagination makes large datasets manageable
- Why SQL JOINs retrieve related data efficiently
- How `asyncHandler` simplifies error handling
- When to use different status codes (200, 201, 204, 400, 404, 500)

**💻 Try this:** Add search functionality with `LIKE` queries to practice advanced SQL.

#### `src/db.js`

**You'll understand:**

- Why connection pooling improves performance
- How environment variables keep configuration flexible
- How to create reusable database clients

### Scraper Service (Microservice)

#### `scraper-service/src/index.js`

**You'll learn about:**

- Building standalone Express services
- Configuring CORS for cross-origin requests
- Creating mock data patterns for development
- Designing consistent API responses and versioning
- Implementing health check endpoints for monitoring
- Proper error handling and 404 responses

**💻 Try this:** Add rate limiting or request caching to understand production concerns.

#### `scraper-service/src/mockReviews.js`

**You'll explore:**

- How to design data structures for multiple sources
- Creating mock data that resembles real APIs
- Maintaining consistent data schemas across sources
- Patterns for timestamp and ID generation

**💻 Try this:** Add sentiment analysis scores to mock reviews for more realistic data.

### Frontend

#### `src/App.jsx` (Main Component)

**You'll master:**

- Setting up React Router for navigation
- Lifting state up (sharing categories across routes)
- Monitoring backend health in real-time
- Conditional rendering based on state
- Using useEffect for side effects

**💻 Try this:** Add a dark mode toggle with `useState` to practice state management.

#### `src/components/ProductForm.jsx`

**You'll understand:**

- How controlled form inputs work
- Why loading states prevent double-submit issues
- How to handle errors with user feedback
- Creating reusable components (create vs edit mode)
- Using PropTypes for component contracts
- Implementing client-side form validation

**💻 Try this:** Add image preview when URL is entered to enhance UX.

#### `src/components/ProductList.jsx`

**You'll learn:**

- Implementing pagination with state management
- Using query parameters for filtering
- Creating responsive grid layouts with Tailwind
- Adding loading indicators for better UX
- Implementing delete confirmation patterns

**💻 Try this:** Add sorting (by price, by name) to practice advanced state management.

#### `src/components/ProductDetail.jsx`

**You'll explore:**

- Extracting URL parameters with `useParams`
- Programmatic navigation with `useNavigate`
- Understanding error boundaries
- Advanced conditional rendering patterns

---

## 🚀 Your Learning Path

To get the most out of this project to improve your skills, follow this structured learning path.
Each step builds on the previous one, gradually increasing in complexity.

### 🌱 Getting Started (Beginner)

1. **Extend the data model** (e.g., add `stock_quantity` to products)

   - Learn to update database schema
   - Practice backend validation patterns
   - Modify frontend forms accordingly

2. **Customize the design** with Tailwind CSS

   - Experiment with colors, spacing, typography
   - Make the interface responsive
   - Understand utility-first CSS

3. **Improve user experience** with confirmation dialogs
   - Learn about user interaction patterns
   - Practice modal implementation

### 🔥 Building Skills (Intermediate)

1. **Master search functionality**

   - Learn to add search inputs in React
   - Create backend endpoints with LIKE queries
   - Understand debouncing for performance

2. **Expand with category management**

   - Practice full CRUD operations
   - Learn referential integrity (prevent deleting categories with products)
   - Understand data relationships

3. **Add dynamic sorting**

   - Implement multi-column sorting
   - Create intuitive UI for sort selection
   - Practice advanced state management

4. **Integrate external services**
   - Connect to the scraper service
   - Display reviews in ProductDetail
   - Handle loading states for external APIs

### 🚀 Advanced Challenges

1. **Secure your application**

   - Implement JWT authentication
   - Create login/register flows
   - Learn about protected routes and authorization

2. **Handle file uploads**

   - Build file upload endpoints
   - Integrate cloud storage (AWS S3, Cloudinary)
   - Understand image optimization techniques

3. **Master microservice communication**

   - Implement backend-to-scraper service calls
   - Handle errors from external services gracefully
   - Learn caching strategies for external APIs

4. **Test everything thoroughly**
   - Write Jest tests for React components
   - Use Supertest for API route testing
   - Learn to mock database calls
   - Test microservice endpoints

---

## ⚠️ Common Pitfalls & How to Avoid Them

### 1. **SQL Injection Vulnerability**

❌ **Don't do this:**

```javascript
const sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
```

✅ **Do this instead:**

```javascript
const sql = "SELECT * FROM products WHERE id = ?";
await pool.query(sql, [req.params.id]);
```

**💡 Why this matters:** Check out [XKCD Little Bobby Tables](https://xkcd.com/327/) to see what can go wrong!

### 2. **Missing Error Handling**

❌ **Don't do this:**

```javascript
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products");
  res.json(rows); // What if query fails?
});
```

✅ **Do this instead:**

```javascript
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  })
);
```

### 3. **Not Validating Input**

❌ **Don't do this:**

```javascript
const price = req.body.price; // Could be anything!
```

✅ **Do this instead:**

```javascript
router.post(
  "/",
  validateProductCreate,
  asyncHandler(async (req, res) => {
    // price is validated and converted to number
    const price = req.body.price;
  })
);
```

### 4. **Hardcoding URLs**

❌ **Don't do this:**

```javascript
fetch("http://localhost:4000/api/products");
```

✅ **Do this instead:**

```javascript
const BACKEND = import.meta.env.VITE_BACKEND_URL || "/api";
fetch(`${BACKEND}/api/products`);
```

### 5. **Not Committing `package-lock.json`**

❌ **Don't do this:**

```bash
# Adding package-lock.json to .gitignore
echo "package-lock.json" >> .gitignore
```

✅ **Do this instead:**

```bash
# Always commit the lockfile
git add package-lock.json
git commit -m "chore: update dependencies"
```

**💡 Why this matters:** `package-lock.json` ensures reproducible builds — everyone gets identical dependency versions. This prevents "works on my machine" issues and protects against supply-chain attacks. In production environments, we use `npm ci` (not `npm install`) to leverage the lockfile for faster, deterministic installs.

**❓ Common question:** "Why is the lockfile so big?"  
**Answer:** It includes every transitive dependency with exact versions, checksums, and registry URLs. This is intentional — it's what makes builds reproducible.

### 6. **Service Communication Errors**

❌ **Don't do this:**

```javascript
// Frontend trying to call services directly by internal names
fetch("http://scraper:5000/api/scrape/reviews/1");
```

✅ **Do this instead:**

```javascript
// Frontend calls through backend, backend calls scraper
fetch("/api/products/1/reviews"); // Backend proxies to scraper service
```

**💡 Why this matters:** Browsers can't resolve internal service names. Either proxy through the backend or use exposed ports for development.

## � Development Workflow

For detailed setup instructions (Docker, Dev Containers, local installation), see [README.md](./README.md#quick-start).

### Your Learning Environment

Once you have the project running, you'll work with:

- **Frontend Development Server**: <http://localhost:5173> - Your React application with hot-reload
- **Backend API Server**: <http://localhost:4000> - Your Express.js API endpoints
- **Database**: MySQL running on port 3306 - Your data persistence layer
- **Scraper Service**: <http://localhost:5000> - Microservice example for external data

### Basic Commands You'll Use

```bash
# Start everything for development
npm run dev

# Run tests to verify your changes
npm test

# Check code quality
npm run lint
```

💡 **Focus on Learning**: Don't worry about the setup complexity - the README handles that. Focus on understanding how the frontend, backend, and database work together.

---

## 📚 Next Steps & Resources

### Learning Strategy

1. **Start with the basics** - Understand each file's purpose before diving deep
2. **Build incrementally** - Begin with GET requests, then POST, then PUT/DELETE
3. **Debug actively** - Use browser DevTools and Node debugger regularly
4. **Ask "why"** - Every pattern here is used in real production applications
5. **Experiment freely** - The project is designed to be modified and explored
6. **Connect concepts** - See how frontend, backend, and database work together

### Technical Setup & Reference

- **Setup Instructions**: See [README.md](./README.md#quick-start) for installation and Docker setup
- **API Documentation**: See [README.md](./README.md#api-endpoints) for complete endpoint reference
- **Project Structure**: See [README.md](./README.md#project-structure) for file organization

### Essential Documentation

- [Express.js Documentation](https://expressjs.com/) - Your backend framework
- [React Documentation](https://react.dev/) - Your frontend framework
- [MySQL Documentation](https://dev.mysql.com/doc/) - Your database system
- [REST API Design Best Practices](https://restfulapi.net/) - Industry standards
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) - Security essentials

**🚀 Remember:** This isn't just a tutorial project — it's a foundation for understanding how modern web applications work in the real world!

---

## 🐳 Docker & Production Deployment

For Docker setup, containerization concepts, and production deployment patterns, see the [README.md](./README.md) file. The README covers:

- Docker Compose setup and commands
- Dev Container configuration
- Container orchestration and networking
- Production deployment considerations

**Learning Path:** Focus on mastering the core full-stack concepts in this guide first, then explore Docker when you're ready to learn about deployment and infrastructure.
