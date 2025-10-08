import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ------------------------------------------------------------
// Database connection pool (mysql2/promise)
// ------------------------------------------------------------
// Purpose:
// - Create a connection pool used across the backend routes.
// - Provide sensible defaults so students can run the app locally with minimal setup.
//
// Student notes / teaching points:
// - When running with Docker Compose the DB service name is `mysql` (we set DB_HOST=mysql
//   in the compose file). When running the backend manually on your laptop and the
//   database is running on the host machine, using `localhost` is the correct value.
//   See `backend/.env.example` for the variables you can copy into a `.env` file.
// - This repo exposes MySQL on the host (localhost:3306) to make it easy for students
//   to run the backend manually and to connect GUI tools (MySQL Workbench, DBeaver).
//   ⚠️ SECURITY: Remove host port mapping (ports: ['3306:3306']) before publishing
//   or deploying to any shared environment — exposing DB ports is a security risk.
// - Pool options explained:
//   * waitForConnections: if true, requests wait in a queue when no connections free
//   * connectionLimit: maximum concurrent connections (keep small on student machines)
//   * connectTimeout: time to wait for initial TCP/handshake before failing
// - testConnection(): non-blocking check that logs a friendly ✅ or ❌ at startup.
//   It retries every 5s if the DB isn't ready. The connection pool will still attempt
//   connections when requests hit the API, so a brief DB startup window is tolerated.

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'minimal_app_db',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000, // 10 seconds
});

/**
 * Test database connection on startup
 *
 * - This function is intentionally non-blocking: it gives students immediate
 *   feedback in container and local runs while letting the app continue to start.
 * - If the DB is still initializing, it retries after 5 seconds and logs an explanatory
 *   message. This is a teaching convenience; production systems typically use
 *   orchestration healthchecks and monitoring.
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connection established');
    conn.release();
  } catch (err) {
    // Print a short, human-friendly message for students when DB isn't ready
    console.error('❌ Database connection failed:', err && err.message ? err.message : err);
    console.error('   Retrying in 5 seconds... (this will continue until the DB becomes healthy)');
    global.setTimeout(testConnection, 5000);
  }
}

// Invoke the check on module load so students see immediate feedback in logs
testConnection();

export default pool;
