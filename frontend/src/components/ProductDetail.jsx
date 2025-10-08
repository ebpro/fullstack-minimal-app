import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
// ProductDetail.jsx — Single product detail view (student notes)
// ---------------------------------------------------------------------------
// Purpose:
// - Display full details of a single product (fetched by ID from URL)
// - Allow editing (navigate to edit form) or deletion (with confirmation)
// - Show loading, error, and unavailable states
//
// Teaching points:
// - This component demonstrates the "detail view" pattern: fetch a single
//   resource by ID from the URL parameter (/product/:id).
// - useParams() extracts the :id from the route, which we use to fetch data.
// - The useEffect dependency array [id, backend] means we refetch whenever
//   the ID changes (e.g., user navigates from product/1 to product/2).
// - The delete operation uses optional chaining (onDelete?.()) to safely call
//   the callback only if it's provided by the parent component.
// - The layout uses Tailwind's responsive classes (md:flex, md:w-96) for a
//   side-by-side image and details on larger screens, stacked on mobile.
// ---------------------------------------------------------------------------

export default function ProductDetail({ backend, backendAvailable, onUpdate, onDelete }) { // eslint-disable-line no-unused-vars
  const { id } = useParams() // Extract :id from URL (e.g., /product/123)
  const navigate = useNavigate()
  
  // State: product data, loading, and error
  // Teaching note: We start with loading=true and product=null. After fetch
  // completes, we set loading=false and either populate product or set error.
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch product data when component mounts or ID changes
  // Teaching note: This effect runs on mount AND whenever `id` or `backend` changes.
  // If the user navigates from /product/1 to /product/2, React Router will
  // keep this component mounted but change the `id` param, triggering a refetch.
  useEffect(() => {
    setLoading(true)
    fetch(`${backend}/api/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found')
        return r.json()
      })
      .then(p => {
        setProduct(p)
        setError(null) // Clear any previous errors
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false)) // Always stop loading spinner
  }, [id, backend])

  // Delete product with confirmation dialog
  // Teaching note: This async function shows the browser confirm() dialog first.
  // If user confirms, we send HTTP DELETE and navigate back to home on success.
  // Optional chaining (onDelete?.()) safely calls the callback if provided.
  const handleDelete = async () => {
    if (!globalThis.confirm('Delete this product?')) return // User cancelled
    
    try {
      const res = await fetch(`${backend}/api/products/${id}`, { method: 'DELETE' })
      if (res.status === 204) { // HTTP 204 = No Content (success)
        onDelete?.(Number(id)) // Optional callback to update parent state
        navigate('/') // Redirect to product list
      } else {
        throw new Error('Delete failed')
      }
    } catch {
      globalThis.alert('Failed to delete product. Please try again.')
    }
  }

  // Guard clause: backend unavailable
  // Teaching note: Early return pattern keeps the main render logic clean.
  if (backendAvailable === false) {
    return (
      <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
        Cannot load product: backend is unavailable.
      </div>
    )
  }

  // Loading state
  if (loading) return <div className="py-8 text-center text-gray-500">Loading product…</div>
  
  // Error or not found state
  if (error || !product) {
    return (
      <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
        {error || 'Product not found'}
      </div>
    )
  }

  // Main render: product detail card with responsive layout
  // Teaching note: This layout uses Tailwind's responsive prefixes:
  // - Default (mobile): stacked vertically
  // - md: (tablet+): side-by-side with md:flex, image gets fixed width md:w-96
  // ACCESSIBILITY: Added proper headings, alt text, ARIA labels, and semantic HTML
  return (
    <article className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden" role="main" aria-labelledby="product-title">
      {/* Responsive flex container: stacked on mobile, side-by-side on tablet+ */}
      <div className="md:flex">
        {/* Product image with fallback placeholder */}
        {/* Teaching note: md:flex-shrink-0 prevents image from shrinking.
            md:h-full makes image fill container height on larger screens.
            ACCESSIBILITY: Proper alt text describes the image content */}
        <div className="md:flex-shrink-0">
          <img 
            src={product.image_url || 'https://placehold.co/600x400?text=No+Image'} 
            alt={product.image_url ? `${product.name} product image` : 'No image available'} 
            className="w-full h-64 md:h-full md:w-96 object-cover" 
          />
        </div>
        
        {/* Product details section */}
        <div className="p-6 flex-1">
          {/* Header: product name and price */}
          <header className="flex items-start justify-between">
            <div>
              <h1 id="product-title" className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              <div className="text-sm text-gray-500 mt-1" aria-label="Product category">
                {product.category_name || 'Uncategorized'}
              </div>
            </div>
            <div 
              className="text-2xl font-bold text-emerald-600" 
              aria-label={`Price: ${Number(product.price).toFixed(2)} dollars`}
            >
              ${Number(product.price).toFixed(2)}
            </div>
          </header>

          {/* Product description */}
          {product.description && (
            <section aria-labelledby="description-heading">
              <h2 id="description-heading" className="sr-only">Product Description</h2>
              <p className="mt-4 text-gray-700">{product.description}</p>
            </section>
          )}

          {/* Action buttons: Edit, Delete, Back */}
          {/* Teaching note: navigate(-1) uses browser history to go back.
              flex-wrap ensures buttons wrap on small screens.
              ACCESSIBILITY: Proper button labels, focus management, and keyboard support */}
          <nav className="mt-6" aria-label="Product actions">
            <div className="flex flex-wrap gap-3">
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                onClick={() => navigate(`/product/${id}/edit`)}
                aria-label={`Edit ${product.name}`}
              >
                Edit
              </button>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" 
                onClick={handleDelete}
                aria-label={`Delete ${product.name}`}
              >
                Delete
              </button>
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                onClick={() => navigate(-1)}
                aria-label="Go back to previous page"
              >
                Back
              </button>
            </div>
          </nav>

          {/* Metadata: creation timestamp */}
          {/* Teaching note: toLocaleString() formats dates according to user's locale.
              The backend sends ISO 8601 timestamps (e.g., "2025-10-01T10:30:00.000Z").
              ACCESSIBILITY: Semantic time element with machine-readable datetime */}
          <footer className="mt-4 text-sm text-gray-400" aria-label="Product metadata">
            Created: <time dateTime={product.created_at}>{new Date(product.created_at).toLocaleString()}</time>
          </footer>
          {/* EXTENSION_POINT: detail.reviews | Add product reviews section | intermediate — Add reviews table and form */}
        </div>
      </div>
    </article>
  )
}

// PropTypes for type checking
// Teaching note: backend is required, but optional callbacks (onUpdate, onDelete)
// allow parent components to react to changes without tightly coupling this component.
ProductDetail.propTypes = {
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
}
