import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
// ProductList.jsx — Product catalog with pagination and filtering (student notes)
// ---------------------------------------------------------------------------
// Purpose:
// - Display products in a grid with pagination (9 items per page)
// - Filter products by category using a dropdown
// - Allow deletion with confirmation dialog
// - Show loading/error states when backend is unavailable
//
// Teaching points:
// - This component demonstrates controlled pagination: the backend API
//   returns `meta` (total, page, per_page, total_pages) alongside `data`.
// - URLSearchParams builds query strings (?page=2&per_page=9&category_id=3).
// - Two separate useEffect hooks manage dependencies: one for category filter
//   changes (resets to page 1), one for page changes (keeps current filter).
// - The delete operation uses HTTP DELETE method and refreshes the current
//   page after success. Students can extend this to show undo or optimistic UI.
// - PropTypes provide runtime validation for props (useful for teaching).
// ---------------------------------------------------------------------------

export default function ProductList({ categories = [], backend, backendAvailable = null }) {
  // State: pagination and filtering
  // Teaching note: perPage is in state even though it's constant (could be a const instead).
  // This pattern allows future expansion (e.g., user-selectable page sizes).
  const [page, setPage] = useState(1)
  const [perPage] = useState(9)
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: perPage, total_pages: 1 })
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch products with pagination and optional category filter
  // Teaching note: This async function constructs a query string using URLSearchParams.
  // The API endpoint /api/products?page=2&per_page=9&category_id=3 returns:
  //   { data: [...], meta: { total, page, per_page, total_pages } }
  // We update both products and meta so the pagination controls work correctly.
  const fetchPage = useCallback(async (p = page, c = categoryFilter) => {
    setLoading(true)
    try {
      const params = new globalThis.URLSearchParams({ page: String(p), per_page: String(perPage) })
      if (c) params.set('category_id', c)
      const res = await fetch(`${backend}/api/products?${params.toString()}`)
      const body = await res.json()
      setProducts(body.data || [])
      setMeta(body.meta || { total: 0, page: p, per_page: perPage, total_pages: 1 })
    } catch (err) {
      console.error('Fetch page failed', err)
    } finally {
      setLoading(false)
    }
  }, [backend, page, categoryFilter, perPage])

  // Effect 1: When category filter changes, reset to page 1 and refetch
  // Teaching note: Dependency array [categoryFilter] means this runs on mount
  // AND whenever categoryFilter changes. We always reset to page 1 when filtering.
  useEffect(() => { fetchPage(1, categoryFilter); setPage(1) }, [categoryFilter, fetchPage])

  // Effect 2: When page changes (but not filter), refetch with current filter
  // Teaching note: Separate effect to avoid re-running fetchPage twice when
  // filter changes (which also changes page to 1). This demonstrates careful
  // dependency management to prevent unnecessary API calls.
  useEffect(() => { fetchPage(page, categoryFilter) }, [page, categoryFilter, fetchPage])

  // Delete product with confirmation dialog
  // Teaching note: This uses the browser's built-in confirm() dialog. After
  // successful deletion (HTTP 204 No Content), we refetch the current page.
  // Extension ideas: optimistic UI update, undo functionality, toast notifications.
  const handleDelete = async (id) => {
    if (!globalThis.confirm('Delete this product?')) return
    try {
      const res = await fetch(`${backend}/api/products/${id}`, { method: 'DELETE' })
      if (res.status === 204) {
        // HTTP 204 = No Content (success for DELETE). Refresh the current page.
        fetchPage()
      } else {
        globalThis.alert('Delete failed')
      }
    } catch (err) {
      console.error(err)
      globalThis.alert('Delete failed')
    }
  }

  // Early returns for loading, error, and empty states
  // Teaching note: These guard clauses simplify the main render logic below.
  // React best practice: handle edge cases early, then render the "happy path".
  if (loading) return <div className="py-8 text-center text-gray-500">Loading products…</div>
  if (backendAvailable === false) return (
    <div className="py-8 text-center text-red-700 bg-red-50 rounded p-4">The backend is currently unavailable. Products cannot be loaded. Please try again later.</div>
  )
  if (!products || products.length === 0) return <div className="py-8 text-center text-gray-500">No products yet.</div>

  return (
    <div>
      {/* Top bar: category filter dropdown and "Add product" button */}
      {/* ACCESSIBILITY: Improved labeling and screen reader support */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="category-filter" className="text-sm text-gray-600">Filter by category:</label>
          {/* Controlled select: value={categoryFilter} and onChange updates state */}
          <select 
            id="category-filter" 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)} 
            className="border px-3 py-2 rounded"
            aria-describedby="filter-help"
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div id="filter-help" className="sr-only">
            Filter products by category. Selecting a category will show only products from that category.
          </div>
        </div>

        <div>
          <Link 
            to="/add" 
            className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
            aria-label="Add a new product to the catalog"
          >
            Add product
          </Link>
        </div>
      </div>

      {/* Product grid: responsive (1 col mobile, 2 tablet, 3 desktop) */}
      {/* Teaching note: Tailwind's responsive prefixes (sm:, lg:) apply styles
          at different breakpoints. This is mobile-first design.
          ACCESSIBILITY: Proper alt text, button labels, and focus management */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none" aria-label="Product catalog">
        {products.map(p => (
          <li key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition-shadow">
            {/* Entire card is clickable (Link wraps image and text) */}
            <Link 
              to={`/product/${p.id}`} 
              className="block hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-label={`View details for ${p.name} - $${Number(p.price).toFixed(2)}`}
            >
              {/* Product image with fallback placeholder */}
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={p.image_url || 'https://placehold.co/600x400?text=No+Image'} 
                  alt={p.image_url ? `${p.name} product image` : 'No image available'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-gray-900">{p.name}</div>
                <div className="text-sm text-gray-500 mt-1">{p.category_name || 'Uncategorized'}</div>
                <div className="mt-3 flex items-center justify-between">
                  {/* Price formatted with 2 decimal places */}
                  <div className="text-xl font-bold text-emerald-600" aria-label={`Price: ${Number(p.price).toFixed(2)} dollars`}>
                    ${Number(p.price).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Edit and Delete buttons. Teaching note: onClick on the button
                        prevents the Link's navigation (event propagation stops).
                        ACCESSIBILITY: Proper button labels and focus management */}
                    <Link 
                      to={`/product/${p.id}/edit`} 
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit ${p.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <button 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      aria-label={`Delete ${p.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      {/* Teaching note: Prev/Next buttons are disabled at the first/last page
          using disabled={...}. The disabled:opacity-50 Tailwind class dims them.
          ACCESSIBILITY: Proper labels, ARIA attributes, and keyboard support */}
      <nav className="flex items-center justify-center gap-4 mt-8" aria-label="Product pagination">
        <button 
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={meta.page === 1}
          aria-label="Go to previous page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && meta.page > 1) {
              e.preventDefault();
              setPage(p => Math.max(1, p - 1));
            }
          }}
        >
          Previous
        </button>
        <div className="text-sm text-gray-600" aria-live="polite" aria-atomic="true">
          Page {meta.page} of {meta.total_pages} — {meta.total} total items
        </div>
        <button 
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onClick={() => setPage(p => Math.min(meta.total_pages, p + 1))} 
          disabled={meta.page === meta.total_pages}
          aria-label="Go to next page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && meta.page < meta.total_pages) {
              e.preventDefault();
              setPage(p => Math.min(meta.total_pages, p + 1));
            }
          }}
        >
          Next
        </button>
      </nav>
      {/* EXTENSION_POINT: pagination.infinite | Add infinite scroll | intermediate — Replace pagination with IntersectionObserver */}
    </div>
  )
}

// PropTypes: runtime validation for component props (useful for teaching and debugging)
// Teaching note: PropTypes are not required in production but help students understand
// the expected data shape. In TypeScript, you'd use interfaces or types instead.
ProductList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
}
