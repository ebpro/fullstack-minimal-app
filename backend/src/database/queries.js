/**
 * Database Query Builder Module (Student Notes)
 * 
 * Purpose:
 * - Centralize commonly used SQL queries to avoid duplication
 * - Provide a consistent interface for building complex queries
 * - Demonstrate the DRY principle (Don't Repeat Yourself)
 * - Prepare students for ORM concepts (Prisma, TypeORM, Sequelize)
 * 
 * Teaching Points:
 * - Query builders help maintain consistency across the application
 * - They make it easier to modify queries in one place when schema changes
 * - This pattern scales well as the application grows
 * - This is a stepping stone to understanding how ORMs work under the hood
 * 
 * Extension Ideas:
 * - Add query builders for other tables (categories, users, etc.)
 * - Add support for more complex filtering and sorting
 * - Implement query caching for frequently used queries
 */

export const queries = {
  products: {
    /**
     * Base SELECT query for products with category JOIN
     * This is the foundation query that all product fetches use
     * 
     * Student Note: We use LEFT JOIN instead of INNER JOIN because
     * products can exist without a category (category_id can be NULL)
     */
    selectWithCategory: `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.image_url, 
        p.created_at,
        c.id as category_id, 
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `,

    /**
     * Get a single product by ID with category information
     * Returns: [query, parameters] tuple for pool.query()
     * 
     * @param {number} id - Product ID to fetch
     * @returns {[string, Array]} Query and parameters array
     */
    selectById(id) {
      return [
        `${this.selectWithCategory} WHERE p.id = ?`,
        [id]
      ];
    },

    /**
     * Get paginated products with optional category filtering
     * Returns: [query, parameters] tuple for pool.query()
     * 
     * Teaching Note: This demonstrates how to build dynamic queries
     * based on optional parameters. The WHERE clause is only added
     * if categoryId is provided.
     * 
     * @param {Object} options - Query options
     * @param {number} options.page - Page number (1-based)
     * @param {number} options.perPage - Items per page
     * @param {number|null} options.categoryId - Optional category filter
     * @returns {[string, Array]} Query and parameters array
     */
    selectPaginated({ page, perPage, categoryId }) {
      const where = categoryId ? 'WHERE p.category_id = ?' : '';
      const offset = (page - 1) * perPage;
      
      // Build parameters array dynamically based on whether we have a category filter
      const params = categoryId 
        ? [categoryId, perPage, offset] 
        : [perPage, offset];
      
      return [
        `${this.selectWithCategory} 
         ${where} 
         ORDER BY p.created_at DESC 
         LIMIT ? OFFSET ?`,
        params
      ];
    },

    /**
     * Count total products with optional category filtering
     * Used for pagination metadata calculation
     * 
     * @param {number|null} categoryId - Optional category filter
     * @returns {[string, Array]} Query and parameters array
     */
    countTotal(categoryId) {
      const where = categoryId ? 'WHERE p.category_id = ?' : '';
      const params = categoryId ? [categoryId] : [];
      
      return [
        `SELECT COUNT(*) as total FROM products p ${where}`,
        params
      ];
    },

    /**
     * Insert a new product and return the created product with category info
     * This is a compound operation: INSERT then SELECT
     * 
     * Teaching Note: We could use a single query with INSERT...RETURNING
     * in PostgreSQL, but MySQL requires separate INSERT and SELECT queries
     * 
     * @param {Object} product - Product data to insert
     * @returns {Object} Object containing insert and select queries
     */
    insertAndSelect(product) {
      const { name, description, price, image_url, category_id } = product;
      
      return {
        insert: [
          `INSERT INTO products (name, description, price, image_url, category_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [name, description || null, price, image_url || null, category_id || null]
        ],
        // selectById will be called after insert with the insertId
        selectAfterInsert: (insertId) => this.selectById(insertId)
      };
    },

    /**
     * Update a product and return the updated product with category info
     * Another compound operation: UPDATE then SELECT
     * 
     * @param {number} id - Product ID to update
     * @param {Object} product - Updated product data
     * @returns {Object} Object containing update and select queries
     */
    updateAndSelect(id, product) {
      const { name, description, price, image_url, category_id } = product;
      
      return {
        update: [
          `UPDATE products 
           SET name = ?, description = ?, price = ?, image_url = ?, category_id = ? 
           WHERE id = ?`,
          [name, description || null, price, image_url || null, category_id || null, id]
        ],
        selectAfterUpdate: () => this.selectById(id)
      };
    },

    /**
     * Delete a product by ID
     * Simple DELETE query
     * 
     * @param {number} id - Product ID to delete
     * @returns {[string, Array]} Query and parameters array
     */
    deleteById(id) {
      return [
        `DELETE FROM products WHERE id = ?`,
        [id]
      ];
    }
  },

  /**
   * EXTENSION_POINT: queries.categories | Add category query builders | beginner
   * Students can add similar query builders for categories:
   * - selectAll()
   * - selectById(id)
   * - insertAndSelect(category)
   * - updateAndSelect(id, category)
   * - deleteById(id)
   */

  /**
   * EXTENSION_POINT: queries.search | Add full-text search queries | intermediate
   * For search functionality, students could add:
   * - searchProducts(searchTerm, page, perPage)
   * - countSearchResults(searchTerm)
   * Using MySQL FULLTEXT indexes or LIKE queries
   */
};

/**
 * Utility function to execute query builders
 * This helper makes it easier to use the query builders with the database pool
 * 
 * Teaching Note: This demonstrates how to create utility functions that
 * reduce boilerplate code throughout the application
 * 
 * @param {Object} pool - MySQL connection pool
 * @param {[string, Array]} queryTuple - Query and parameters from query builder
 * @returns {Promise} Database result
 */
export async function executeQuery(pool, queryTuple) {
  const [query, params] = queryTuple;
  return await pool.query(query, params);
}

/**
 * ADVANCED EXTENSION: Query Builder Class Pattern
 * 
 * For advanced students, demonstrate how this could evolve into a class-based
 * query builder similar to what ORMs provide:
 * 
 * class ProductQueryBuilder {
 *   constructor(pool) {
 *     this.pool = pool;
 *     this.baseQuery = queries.products.selectWithCategory;
 *   }
 * 
 *   where(column, operator, value) {
 *     // Add WHERE conditions
 *     return this;
 *   }
 * 
 *   orderBy(column, direction = 'ASC') {
 *     // Add ORDER BY
 *     return this;
 *   }
 * 
 *   limit(count) {
 *     // Add LIMIT
 *     return this;
 *   }
 * 
 *   async execute() {
 *     // Build final query and execute
 *     return await this.pool.query(this.finalQuery, this.params);
 *   }
 * }
 * 
 * Usage: const products = await new ProductQueryBuilder(pool)
 *   .where('category_id', '=', 1)
 *   .orderBy('created_at', 'DESC')
 *   .limit(10)
 *   .execute();
 */