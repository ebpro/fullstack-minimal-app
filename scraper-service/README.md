# Review Scraper Service (Mock)

**Purpose:** Simulates external review scraping services for teaching full-stack integration.

## Overview

This is a **mock service** that returns simulated review data from multiple e-commerce platforms (Amazon, BestBuy, Walmart). It's designed for educational purposes to teach students how to:

- Integrate with external APIs
- Handle asynchronous data fetching
- Process data from multiple sources
- Implement error handling for external services

## Features

✅ **Mock review data** from 3 platforms (Amazon, BestBuy, Walmart)  
✅ **Configurable delay** to simulate network latency  
✅ **RESTful API** with clear endpoints  
✅ **Docker support** for easy deployment  
✅ **CORS enabled** for frontend integration  
✅ **Health check** endpoint for monitoring

---

## API Endpoints

### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "review-scraper",
  "version": "1.0.0",
  "timestamp": "2025-10-02T10:00:00.000Z"
}
```

---

### 2. Fetch Reviews

```http
GET /api/scrape/reviews/:productId
```

**Query Parameters:**
- `source` (optional): Filter by platform (amazon, bestbuy, walmart)
- `delay` (optional): Simulate network delay in milliseconds (default: 500)

**Example Requests:**

```bash
# Get all reviews for product 1
curl http://localhost:5000/api/scrape/reviews/1

# Get only Amazon reviews for product 1
curl http://localhost:5000/api/scrape/reviews/1?source=amazon

# Simulate 2-second network delay
curl http://localhost:5000/api/scrape/reviews/1?delay=2000
```

**Response:**
```json
{
  "product_id": "1",
  "source": "all",
  "count": 11,
  "fetched_at": "2025-10-02T10:00:00.000Z",
  "data": [
    {
      "review_id": "AMZ_0001",
      "source": "Amazon",
      "author": "John Smith",
      "rating": 5,
      "title": "Excellent fast charger!",
      "body": "This charger is amazing...",
      "created_at": "2025-09-15T10:30:00Z",
      "verified_purchase": true
    }
    // ... more reviews
  ]
}
```

---

### 3. List Available Sources

```http
GET /api/scrape/sources
```

**Response:**
```json
{
  "sources": [
    {
      "name": "Amazon",
      "id": "amazon",
      "description": "Amazon product reviews",
      "active": true
    },
    {
      "name": "BestBuy",
      "id": "bestbuy",
      "description": "Best Buy customer reviews",
      "active": true
    },
    {
      "name": "Walmart",
      "id": "walmart",
      "description": "Walmart product ratings",
      "active": true
    }
  ]
}
```

---

### 4. List Available Products

```http
GET /api/scrape/products
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "USB-C Fast Charger 30W",
      "sources": ["amazon", "bestbuy", "walmart"],
      "total_reviews": 11
    },
    {
      "id": "2",
      "name": "Wireless Bluetooth Headphones",
      "sources": ["amazon", "bestbuy", "walmart"],
      "total_reviews": 8
    }
    // ... more products
  ]
}
```

---

## Running Locally

### Option 1: With Docker (Recommended)

```bash
# Build and run
docker build -t scraper-service .
docker run -p 5000:5000 scraper-service

# Or use docker-compose (from fullstack-minimal-app root)
docker-compose up scraper
```

### Option 2: Direct with Node.js

```bash
cd scraper-service

# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Service will be available at:** `http://localhost:5000`

---

## Testing the Service

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Get all reviews for product 1
curl http://localhost:5000/api/scrape/reviews/1

# Get Amazon reviews only
curl http://localhost:5000/api/scrape/reviews/1?source=amazon

# List all products
curl http://localhost:5000/api/scrape/products

# List sources
curl http://localhost:5000/api/scrape/sources
```

### Using Postman

Import the following endpoints:
1. `GET http://localhost:5000/health`
2. `GET http://localhost:5000/api/scrape/reviews/1`
3. `GET http://localhost:5000/api/scrape/reviews/1?source=amazon`
4. `GET http://localhost:5000/api/scrape/products`
5. `GET http://localhost:5000/api/scrape/sources`

---

## Integration with Backend

### Example: Fetch and Store Reviews

```javascript
// In your backend (Node.js/Express)
const axios = require('axios');

async function fetchAndStoreReviews(productId) {
  try {
    // Call scraper service
    const response = await axios.get(
      `http://scraper:5000/api/scrape/reviews/${productId}`
    );
    
    const reviews = response.data.data;
    
    // Store in database
    for (const review of reviews) {
      await db.execute(
        `INSERT INTO reviews 
         (product_id, source, review_id, author, rating, title, body, created_at, fetched_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE fetched_at = NOW()`,
        [
          productId,
          review.source,
          review.review_id,
          review.author,
          review.rating,
          review.title,
          review.body,
          review.created_at
        ]
      );
    }
    
    return { success: true, count: reviews.length };
  } catch (error) {
    console.error('Scraper error:', error.message);
    throw error;
  }
}
```

---

## Available Mock Data

### Products with Reviews

| ID | Product Name | Sources | Total Reviews |
|----|-------------|---------|---------------|
| 1 | USB-C Fast Charger 30W | Amazon, BestBuy, Walmart | 11 |
| 2 | Wireless Bluetooth Headphones | Amazon, BestBuy, Walmart | 8 |
| 3 | Smart LED Light Bulb | Amazon, BestBuy, Walmart | 6 |

---

## Error Responses

### Product Not Found (404)

```json
{
  "error": "Product not found",
  "message": "No reviews available for product 99",
  "availableProducts": ["1", "2", "3"]
}
```

### Source Not Found (404)

```json
{
  "error": "Source not found",
  "message": "No reviews from ebay for product 1",
  "availableSources": ["amazon", "bestbuy", "walmart"]
}
```

### Internal Error (500)

```json
{
  "error": "Internal server error",
  "message": "Error message here"
}
```

---

## Configuration

### Environment Variables

Create `.env` file (or copy from `.env.example`):

```env
PORT=5000
DEFAULT_DELAY=500
NODE_ENV=development
```

### Customizing Mock Data

Edit `src/mockReviews.js` to add/modify:
- Products
- Review sources
- Review content
- Rating distributions

---

## Teaching Notes

### For Instructors

**Use this service to teach:**

1. **External API Integration**
   - HTTP requests with axios/fetch
   - Error handling for network failures
   - Timeout handling

2. **Data Processing**
   - Parsing JSON responses
   - Transforming data formats
   - Aggregating from multiple sources

3. **Asynchronous Operations**
   - Promise handling
   - Async/await patterns
   - Concurrent requests

4. **Database Integration**
   - Storing fetched data
   - Preventing duplicates (UNIQUE constraints)
   - Updating existing records

### For Students

**Practice 6 Integration Steps:**

1. **Call scraper from backend:**
   ```javascript
   POST /api/products/:id/fetch
   → Calls scraper-service
   → Stores reviews in MySQL
   ```

2. **Handle scraper errors:**
   - Service unavailable
   - Product not found
   - Network timeouts

3. **Display fetched data:**
   - Show reviews in React frontend
   - Calculate aggregated statistics
   - Filter by source

---

## Troubleshooting

### Service not responding

```bash
# Check if service is running
curl http://localhost:5000/health

# Check Docker logs
docker-compose logs scraper
```

### CORS errors from frontend

- Make sure CORS is enabled in `src/index.js`
- Check frontend is calling correct URL
- Verify service is running on correct port

### Connection refused from backend

- In Docker: Use service name `http://scraper:5000`
- Locally: Use `http://localhost:5000`
- Check docker-compose network configuration

---

## Project Structure

```
scraper-service/
├── src/
│   ├── index.js           # Main Express server
│   └── mockReviews.js     # Mock review data
├── package.json           # Dependencies
├── Dockerfile            # Docker configuration
├── .env.example          # Environment template
└── README.md            # This file
```

---

## License

MIT - For educational use in L3 Web Development course

---

## Support

**For teaching team:** This is a mock service for educational purposes only. Not for production use.

**For students:** See Practice 6 materials for integration instructions.
