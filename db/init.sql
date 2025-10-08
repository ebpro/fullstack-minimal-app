-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create products table with category_id FK and data validation constraints
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),  -- Prevent negative prices
  image_url VARCHAR(1024),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Additional CHECK constraints for data integrity (Student Notes)
  -- These constraints are enforced at the database level, providing a last line of defense
  -- against invalid data even if application validation is bypassed
  CONSTRAINT chk_name_not_empty CHECK (TRIM(name) != ''),  -- Name cannot be just whitespace
  CONSTRAINT chk_price_reasonable CHECK (price <= 999999.99), -- Prevent unreasonably high prices
  CONSTRAINT chk_image_url_format CHECK (
    image_url IS NULL OR 
    image_url REGEXP '^https?://.+' OR 
    image_url LIKE 'data:image/%'  -- Allow data URLs for base64 images
  )
);

-- ============================================================================
-- DATABASE INDEXES FOR PERFORMANCE (Student Notes)
-- ============================================================================
-- Why indexes? They speed up queries but use additional storage and slow down INSERTs.
-- We add indexes on columns that are frequently used in WHERE, ORDER BY, or JOIN clauses.

-- Index for category filtering queries (WHERE p.category_id = ?)
-- This speeds up queries like "show me all Electronics products"
-- Note: MySQL doesn't support IF NOT EXISTS for indexes, but init.sql only runs once
CREATE INDEX idx_products_category ON products(category_id);

-- Index for date-based sorting (ORDER BY created_at DESC)
-- This speeds up the default product listing which shows newest products first
CREATE INDEX idx_products_created ON products(created_at DESC);

-- Composite index for filtered + sorted queries
-- This is a powerful optimization for queries that both filter by category AND sort by date
-- MySQL can use this single index for: WHERE category_id = X ORDER BY created_at DESC
CREATE INDEX idx_products_category_created ON products(category_id, created_at DESC);

-- Full-text index for product search (EXTENSION POINT)
-- Uncomment this when implementing search functionality in later exercises
-- CREATE FULLTEXT INDEX idx_products_search ON products(name, description);

-- Teaching Discussion: Index Trade-offs
-- =====================================
-- PROS:
-- - Dramatically faster SELECT queries (can turn O(n) into O(log n))
-- - Essential for good performance as data grows
-- - Compound indexes can optimize complex queries
--
-- CONS:  
-- - Use additional disk space (each index is stored separately)
-- - Slow down INSERT/UPDATE/DELETE operations (indexes must be maintained)
-- - Too many indexes can hurt performance more than help
--
-- Best Practices:
-- - Add indexes based on your actual query patterns, not guesswork
-- - Use EXPLAIN to analyze query performance before and after adding indexes
-- - Consider compound indexes for multi-column WHERE clauses
-- - Monitor index usage - remove unused indexes

-- Insert sample categories
INSERT INTO categories (name) VALUES ('Electronics'), ('Books'), ('Home');

-- Insert sample products (20 items)
INSERT INTO products (name, description, price, image_url, category_id) VALUES
('USB-C Charger', 'Fast 30W USB-C charger', 19.99, 'https://placehold.co/600x400?text=USB-C+Charger', 1),
('Wireless Mouse', 'Ergonomic wireless mouse', 24.99, 'https://placehold.co/600x400?text=Wireless+Mouse', 1),
('Bluetooth Speaker', 'Portable Bluetooth speaker', 49.99, 'https://placehold.co/600x400?text=Bluetooth+Speaker', 1),
('Noise Cancelling Headphones', 'Over-ear ANC headphones', 129.99, 'https://placehold.co/600x400?text=Noise+Cancelling+Headphones', 1),
('Portable SSD 1TB', 'Fast external SSD storage', 89.99, 'https://placehold.co/600x400?text=Portable+SSD+1TB', 1),
('Learning React', 'A practical guide to React', 29.99, 'https://placehold.co/600x400?text=Learning+React', 2),
('JavaScript: The Good Parts', 'Classic JS book', 19.99, 'https://placehold.co/600x400?text=JavaScript:+The+Good+Parts', 2),
('CSS Secrets', 'Modern CSS techniques', 24.99, 'https://placehold.co/600x400?text=CSS+Secrets', 2),
('Eloquent JavaScript', 'A modern introduction to programming', 34.99, 'https://placehold.co/600x400?text=Eloquent+JavaScript', 2),
('The Pragmatic Programmer', 'Software craftsmanship', 39.99, 'https://placehold.co/600x400?text=The+Pragmatic+Programmer', 2),
('Ceramic Mug', '12oz ceramic coffee mug', 9.99, 'https://placehold.co/600x400?text=Ceramic+Mug', 3),
('Floor Lamp', 'Modern LED floor lamp', 59.99, 'https://placehold.co/600x400?text=Floor+Lamp', 3),
('Throw Pillow', 'Decorative throw pillow', 14.99, 'https://placehold.co/600x400?text=Throw+Pillow', 3),
('Area Rug', 'Small area rug 3x5', 79.99, 'https://placehold.co/600x400?text=Area+Rug', 3),
('Wall Clock', 'Minimalist wall clock', 29.99, 'https://placehold.co/600x400?text=Wall+Clock', 3),
('Phone Stand', 'Adjustable phone stand', 12.99, 'https://placehold.co/600x400?text=Phone+Stand', NULL),
('Laptop Sleeve', '13-inch protective sleeve', 19.99, 'https://placehold.co/600x400?text=Laptop+Sleeve', NULL),
('Notebook', 'Hardcover ruled notebook', 7.99, 'https://placehold.co/600x400?text=Notebook', NULL),
('Desk Plant', 'Low-maintenance succulent', 11.99, 'https://placehold.co/600x400?text=Desk+Plant', NULL),
('Sticker Pack', 'Assorted laptop stickers', 4.99, 'https://placehold.co/600x400?text=Sticker+Pack', NULL);
