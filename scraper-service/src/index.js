/**
 * Mock Review Scraper Service
 * Simulates fetching reviews from multiple e-commerce platforms
 * For teaching purposes only - returns mock data
 */

const express = require('express');
const cors = require('cors');
const reviewData = require('./mockReviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'review-scraper',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/scrape/reviews/:productId
 * Fetch reviews for a specific product from all sources
 * 
 * Query params:
 * - source: Filter by specific source (amazon, bestbuy, walmart)
 * - delay: Simulate network delay in ms (default: 500)
 */
app.get('/api/scrape/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  const { source, delay = 500 } = req.query;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, parseInt(delay)));

  // Get reviews for product
  const productReviews = reviewData[productId];

  if (!productReviews) {
    return res.status(404).json({
      error: 'Product not found',
      message: `No reviews available for product ${productId}`,
      availableProducts: Object.keys(reviewData)
    });
  }

  // Filter by source if specified
  let reviews = [];
  if (source) {
    const sourceLower = source.toLowerCase();
    reviews = productReviews[sourceLower] || [];
    
    if (reviews.length === 0) {
      return res.status(404).json({
        error: 'Source not found',
        message: `No reviews from ${source} for product ${productId}`,
        availableSources: Object.keys(productReviews)
      });
    }
  } else {
    // Combine all sources
    reviews = Object.values(productReviews).flat();
  }

  // Add metadata
  res.json({
    product_id: productId,
    source: source || 'all',
    count: reviews.length,
    fetched_at: new Date().toISOString(),
    data: reviews
  });
});

/**
 * GET /api/scrape/sources
 * List available review sources
 */
app.get('/api/scrape/sources', (req, res) => {
  res.json({
    sources: [
      {
        name: 'Amazon',
        id: 'amazon',
        description: 'Amazon product reviews',
        active: true
      },
      {
        name: 'BestBuy',
        id: 'bestbuy',
        description: 'Best Buy customer reviews',
        active: true
      },
      {
        name: 'Walmart',
        id: 'walmart',
        description: 'Walmart product ratings',
        active: true
      }
    ]
  });
});

/**
 * GET /api/scrape/products
 * List available products with reviews
 */
app.get('/api/scrape/products', (req, res) => {
  const products = Object.entries(reviewData).map(([id, sources]) => {
    const totalReviews = Object.values(sources).flat().length;
    return {
      id,
      name: getProductName(id),
      sources: Object.keys(sources),
      total_reviews: totalReviews
    };
  });

  res.json({ products });
});

/**
 * Helper: Get product name by ID
 */
function getProductName(id) {
  const names = {
    '1': 'USB-C Fast Charger 30W',
    '2': 'Wireless Bluetooth Headphones',
    '3': 'Smart LED Light Bulb',
    '4': 'Portable SSD 1TB',
    '5': 'Webcam HD 1080p'
  };
  return names[id] || `Product ${id}`;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/scrape/reviews/:productId',
      'GET /api/scrape/sources',
      'GET /api/scrape/products'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔍 Review Scraper Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Available products: http://localhost:${PORT}/api/scrape/products`);
  console.log(`🎯 Mock mode: Returns simulated review data for teaching`);
});
