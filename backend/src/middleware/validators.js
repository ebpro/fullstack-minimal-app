/**
 * Input validation middleware using express-validator
 * 
 * Teaching points:
 * - Never trust client input
 * - Validate early, fail fast
 * - Provide clear error messages for debugging
 * - Use middleware chains for reusability
 */

import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

/**
 * Middleware to check validation results and throw AppError if invalid
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors for better readability
    const details = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    
    throw new AppError('Validation failed', 400, details);
  }
  next();
}

/**
 * Product validation rules
 */
export const validateProductCreate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
  
  body('description')
    .optional({ nullable: true, checkFalsy: true })  // Allow null, undefined, and empty string
    .trim()
    .isLength({ max: 5000 }).withMessage('Description too long (max 5000 characters)'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0, max: 999999.99 }).withMessage('Price must be between 0 and 999999.99')
    .toFloat(),
  
  body('image_url')
    .optional({ nullable: true, checkFalsy: true })  // Allow null, undefined, and empty string
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
    .isLength({ max: 1024 }).withMessage('URL too long'),
  
  body('category_id')
    .optional({ nullable: true, checkFalsy: true })  // Allow null, undefined, and empty string
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer')
    .toInt(),
  
  validate,
];

export const validateProductUpdate = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
    .toInt(),
  
  ...validateProductCreate,
];

export const validateProductId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a positive integer')
    .toInt(),
  
  validate,
];

/**
 * Pagination validation rules
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('per_page')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Items per page must be 1-100')
    .toInt(),
  
  query('category_id')
    .optional({ nullable: true, checkFalsy: true })  // Allow null, undefined, and empty string
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer')
    .toInt(),
  
  validate,
];
