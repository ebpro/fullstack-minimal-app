import express from 'express';
import pool from '../db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { 
  validateProductCreate, 
  validateProductUpdate, 
  validateProductId,
  validatePagination,
} from '../middleware/validators.js';

const router = express.Router();

/**
 * List products with category name (JOIN) — supports pagination and optional category filter
 * Query params: page (1-based), per_page, category_id
 */
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.max(1, Math.min(100, Number(req.query.per_page) || 10));
  const categoryFilter = req.query.category_id ? Number(req.query.category_id) : null;

  // Build WHERE clause and params
  const whereClauses = [];
  const params = [];
  if (categoryFilter) {
    whereClauses.push('p.category_id = ?');
    params.push(categoryFilter);
  }
  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count with same filter
  const countSql = `SELECT COUNT(*) as total FROM products p ${whereSQL}`;
  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0]?.total || 0;

  // Fetch page of products with JOIN
  const offset = (page - 1) * perPage;
  const dataSql = `SELECT p.id, p.name, p.description, p.price, p.image_url, p.created_at, c.id as category_id, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSQL}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?`;

  const dataParams = params.concat([perPage, offset]);
  const [rows] = await pool.query(dataSql, dataParams);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  res.json({
    data: rows,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    }
  });
}));

/**
 * Get product by id with category
 */
router.get('/:id', validateProductId, asyncHandler(async (req, res) => {
  const id = req.params.id; // Already validated and converted to number
  
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.image_url, p.created_at, c.id as category_id, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  
  if (rows.length === 0) {
    throw new AppError('Product not found', 404);
  }
  
  res.json(rows[0]);
}));

/**
 * Create product
 */
router.post('/', validateProductCreate, asyncHandler(async (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;
  
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)`,
    [name, description || null, price, image_url || null, category_id || null]
  );
  
  const insertId = result.insertId;
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.image_url, p.created_at, c.id as category_id, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [insertId]
  );
  
  res.status(201).json(rows[0]);
}));

/**
 * Update product
 */
router.put('/:id', validateProductUpdate, asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, description, price, image_url, category_id } = req.body;
  
  const [result] = await pool.query(
    `UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ? WHERE id = ?`,
    [name, description || null, price, image_url || null, category_id || null, id]
  );
  
  if (result.affectedRows === 0) {
    throw new AppError('Product not found', 404);
  }
  
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.price, p.image_url, p.created_at, c.id as category_id, c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  
  res.json(rows[0]);
}));

/**
 * Delete product
 */
router.delete('/:id', validateProductId, asyncHandler(async (req, res) => {
  const id = req.params.id;
  
  const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  
  if (result.affectedRows === 0) {
    throw new AppError('Product not found', 404);
  }
  
  res.status(204).send();
}));

export default router;
