import express from 'express';
import pool from '../db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * List all categories
 * Teaching point: Simple SELECT query, no pagination needed for small reference tables
 */
router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`SELECT id, name FROM categories ORDER BY name ASC`);
  res.json(rows);
}));

export default router;
