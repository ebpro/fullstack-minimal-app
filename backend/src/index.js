import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import db from "./db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { setupStaticServing } from "./middleware/staticServing.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// ---------------------------------------------------------------------------
// Express app setup
// ---------------------------------------------------------------------------
// This file wires up the backend server and is a great place to teach the
// following concepts to students:
//  - middleware order (logging, body parsing, CORS, routes, static, error handlers)
//  - health checks and why they should be lightweight and fast
//  - why CORS needs to be configured for browser-based frontend dev
//  - how static serving differs from using a separate frontend dev server
//

// Request logging (shows HTTP method, URL, status, response time)
// A logger is essential for debugging and understanding app behavior.
app.use(morgan("dev"));

// Body parsing for JSON payloads
// Teaching point: express.json() is built-in middleware to parse JSON bodies.
// Json payloads are common in modern APIs like REST.
app.use(express.json());

// CORS configuration
// Teaching note: Browsers enforce CORS. The `origin` here should be the
// address where students run the frontend (Vite dev server defaults to
// http://localhost:5173). When running both backend and frontend inside
// containers with a reverse proxy, CORS may not be necessary.
// CORS means Cross-Origin Resource Sharing.
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
// Purpose: a lightweight endpoint used by Docker Compose healthchecks and by
// students to confirm the app is up. Keep it fast and avoid doing heavy work.
// The endpoint returns a simple DB check (row count) and a timestamp.
app.get("/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM products");
    const count = rows && rows[0] ? rows[0].count : 0;
    return res.json({
      status: "ok",
      db: "connected",
      products: Number(count),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Degraded: server is up, but DB is unavailable. Keep HTTP 200 so UIs can
    // distinguish "backend reachable" vs "database down" without special casing.
    return res.json({
      status: "degraded",
      db: "unavailable",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
// Keep API routes mounted after middleware like body parsing/CORS so they
// receive parsed bodies and the correct CORS headers.
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

// EXTENSION_POINT: ADD MORE ROUTES HERE (e.g. users, auth, orders, ...) AS THE APP GROWS

// ---------------------------------------------------------------------------
// Static file serving
// ---------------------------------------------------------------------------
// In production you might build the frontend into `backend/public` and serve
// it from the same container. For development we usually run Vite separately
// so you get fast HMR. `setupStaticServing` will serve files only if they exist.
setupStaticServing(app);

// 404 handler for unmatched routes (keeps error handling consistent)
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
  console.log(`📝 Logs: HTTP requests will be logged in 'dev' format`);
  console.log(`🔗 CORS enabled for: ${FRONTEND_ORIGIN}`);
});
