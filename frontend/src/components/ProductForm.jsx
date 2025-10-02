import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

// ---------------------------------------------------------------------------
// ProductForm.jsx — Create and edit products (student notes)
// ---------------------------------------------------------------------------
// Purpose:
// - Reusable form component for both adding new products and editing existing ones
// - Fetches existing product data when isEdit=true (edit mode)
// - Submits via POST /api/products (create) or PUT /api/products/:id (update)
// - Handles validation, loading states, and error messages
//
// Teaching points:
// - This demonstrates the "single form component" pattern: one component handles
//   both create and edit modes based on the `isEdit` prop and URL parameter.
// - Controlled form inputs: each field (name, price, etc.) has its own state.
//   The input's `value` is bound to state, and `onChange` updates the state.
// - HTML5 validation: `required` attribute and `type="number"` provide basic
//   browser-side validation before submit.
// - HTTP methods: POST for create, PUT for update (RESTful convention).
// - Error handling: displays backend error messages to users with visual feedback.
// - Navigation: useNavigate() from React Router for programmatic navigation
//   after successful submit or cancel.
// ---------------------------------------------------------------------------

export default function ProductForm({ categories = [], onAdd, backend, backendAvailable, isEdit = false }) {
  const { id } = useParams() // URL parameter from route /product/:id/edit
  
  // Form field state (controlled inputs pattern)
  // Teaching note: Each input field is controlled by React state. This gives us
  // full control over the form data (validation, formatting, etc.) and makes it
  // easy to pre-fill the form in edit mode.
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  
  // UI state for loading and error feedback
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // In edit mode, fetch the existing product and populate form fields
  // Teaching note: This effect runs when component mounts IF isEdit=true and id exists.
  // We fetch the product data, then call the state setters to fill the form.
  // This is the standard "fetch-on-mount for edit forms" pattern.
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      fetch(`${backend}/api/products/${id}`)
        .then(r => {
          if (!r.ok) throw new Error('Failed to load product')
          return r.json()
        })
        .then(p => {
          // Pre-fill form fields with existing product data
          // Teaching note: We use || '' to ensure empty string instead of null/undefined,
          // which would make the inputs uncontrolled (React warning).
          setName(p.name || '')
          setPrice(p.price || '')
          setDescription(p.description || '')
          setImageUrl(p.image_url || '')
          setCategoryId(p.category_id || '')
          setError(null)
        })
        .catch(err => {
          console.error('Load product for edit failed', err)
          setError('Failed to load product. Please try again.')
        })
        .finally(() => setLoading(false))
    }
  }, [isEdit, id, backend])

  const navigate = useNavigate()

  // Form submission handler
  // Teaching note: This async function handles both create (POST) and update (PUT).
  // Key pattern: e.preventDefault() stops the browser's default form submission,
  // allowing us to handle it with JavaScript (AJAX-style).
  const submit = async (e) => {
    e.preventDefault() // Prevent browser form submission (page reload)
    setLoading(true)
    setError(null)
    
    // Build the payload object from form state
    // Teaching note: The backend expects JSON. We convert price to Number and
    // set category_id to null if empty (database foreign key constraint allows null).
    const payload = { 
      name, 
      price: Number(price), 
      description, 
      image_url: imageUrl, 
      category_id: categoryId || null 
    }
    
    try {
      if (isEdit && id) {
        // UPDATE mode: HTTP PUT to /api/products/:id
        const res = await fetch(`${backend}/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        if (!res.ok) {
          // Try to extract error message from backend response
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error?.message || 'Update failed')
        }
        
        const updated = await res.json()
        if (onAdd) onAdd(updated) // Optional callback (e.g., to refresh parent state)
        navigate(`/product/${id}`) // Redirect to detail page after successful update
        return
      }

      // CREATE mode: HTTP POST to /api/products
      const res = await fetch(`${backend}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!res.ok) {
        // Try to parse backend error response
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Create failed')
      }
      
      const data = await res.json()
      if (onAdd) onAdd(data) // Optional callback
      
      // Reset form fields after successful creation
      // Teaching note: In create mode, we clear the form so users can add another
      // product. In edit mode (above), we navigate away instead.
      setName('')
      setPrice('')
      setDescription('')
      setImageUrl('')
      setCategoryId('')
      navigate('/') // Redirect to product list
    navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message || (isEdit ? 'Failed to update product' : 'Failed to add product'))
    } finally {
      setLoading(false) // Always turn off loading spinner, success or failure
    }
  }

  // Guard clause: show error if backend is unavailable
  // Teaching note: This prevents users from filling out the form when they can't submit it.
  if (backendAvailable === false) {
    return (
      <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800">
        Cannot {isEdit ? 'edit' : 'add'} product: backend is unavailable.
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="border p-4 mb-4 rounded">
      <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      
      {/* Error banner (conditionally rendered) */}
      {/* Teaching note: && is React's way of conditional rendering. If error is
          truthy, the <div> renders. If error is null/undefined, nothing renders. */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}
      
      {/* Name field (required) */}
      {/* Teaching note: The `required` attribute provides browser-side validation.
          The browser won't submit the form if this field is empty. */}
      <div className="mb-2">
        <label htmlFor="p-name" className="block font-medium">Name *</label>
        <input 
          id="p-name" 
          required 
          disabled={loading}
          className="border px-2 py-1 w-full disabled:bg-gray-100" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
      </div>
      
      {/* Price field (required, numeric with decimals) */}
      {/* Teaching note: type="number" step="0.01" allows decimal prices like 19.99.
          The browser provides a numeric input with up/down arrows. */}
      <div className="mb-2">
        <label htmlFor="p-price" className="block font-medium">Price *</label>
        <input 
          id="p-price" 
          required 
          type="number" 
          step="0.01" 
          disabled={loading}
          className="border px-2 py-1 w-full disabled:bg-gray-100" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
        />
      </div>
      
      {/* Category dropdown (optional) */}
      {/* Teaching note: This is a controlled select. Empty string means no category.
          Categories are passed down from parent (fetched in App.jsx). */}
      <div className="mb-2">
        <label htmlFor="p-category" className="block font-medium">Category</label>
        <select 
          id="p-category" 
          value={categoryId} 
          disabled={loading}
          onChange={e => setCategoryId(e.target.value)} 
          className="border px-2 py-1 w-full disabled:bg-gray-100"
        >
          <option value="">-- none --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      
      {/* Image URL field (optional) */}
      {/* Teaching note: Students can paste any image URL here. For production apps,
          you'd typically upload files to cloud storage (S3, Cloudinary, etc.). */}
      <div className="mb-2">
        <label htmlFor="p-image" className="block font-medium">Image URL</label>
        <input 
          id="p-image" 
          value={imageUrl} 
          disabled={loading}
          onChange={e => setImageUrl(e.target.value)} 
          className="border px-2 py-1 w-full disabled:bg-gray-100" 
        />
      </div>
      
      {/* Description textarea (optional) */}
      <div className="mb-2">
        <label htmlFor="p-desc" className="block font-medium">Description</label>
        <textarea 
          id="p-desc" 
          value={description} 
          disabled={loading}
          onChange={e => setDescription(e.target.value)} 
          className="border px-2 py-1 w-full disabled:bg-gray-100" 
          rows="3"
        />
      </div>
      
      {/* Submit and Cancel buttons */}
      {/* Teaching note: Submit button is disabled during loading to prevent double-submit.
          Cancel button uses navigate(-1) to go back to the previous page (browser history). */}
      <div className="flex gap-2">
        <button 
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {/* Dynamic button text based on mode and loading state */}
          {(() => {
            if (loading) return 'Saving...'
            return isEdit ? 'Update Product' : 'Add Product'
          })()}
        </button>
        <button 
          type="button"
          onClick={() => navigate(-1)}
          disabled={loading}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {/* EXTENSION_POINT: form.upload | Add image file upload | intermediate — Replace URL field with file picker + backend upload */}
    </form>
  )
}

// PropTypes for type checking and documentation
// Teaching note: These define the "contract" for this component. Parent components
// must provide backend (string) and can optionally provide other props.
ProductForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  onAdd: PropTypes.func,
  backend: PropTypes.string.isRequired,
  backendAvailable: PropTypes.bool,
  isEdit: PropTypes.bool,
}
