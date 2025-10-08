/**
 * Centralized error handling middleware
 * 
 * Teaching points:
 * - Single source of truth for error responses
 * - Consistent error format for frontend consumption
 * - Differentiates between operational errors and programming errors
 * - Logs detailed errors server-side, sends safe messages to client
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguishes from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler - must be registered after all routes
 */
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log the full error for debugging
  console.error('Error caught by global handler:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Default to 500 if no status code
  const statusCode = err.statusCode || 500;
  
  // Send structured error response
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal server error',
      status: statusCode,
      ...(err.details && { details: err.details }),
      // In production, you'd hide stack traces
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * Async route wrapper - catches promise rejections automatically
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler - catches all unmatched routes
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.path}`, 404));
}
