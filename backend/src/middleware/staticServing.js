/**
 * Static file serving middleware
 * 
 * Teaching points:
 * - Separation of concerns: API vs static content
 * - SPA routing: fallback to index.html for client-side routes
 * - Conditional middleware: only applies if frontend is built
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serves built frontend files if they exist
 * This allows the backend to serve a production build of the React app
 */
export function setupStaticServing(app) {
  const publicDir = path.join(__dirname, '..', '..', 'public');
  
  if (fs.existsSync(publicDir)) {
    console.log('✓ Serving static frontend from', publicDir);
    
    // Serve static files
    app.use(express.static(publicDir));
    
    // SPA fallback: send index.html for any unmatched routes
    // This must be registered AFTER all API routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicDir, 'index.html'));
    });
  } else {
    console.log('ℹ No static frontend found (dev mode - frontend runs separately)');
  }
}
