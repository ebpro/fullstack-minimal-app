import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'

// ---------------------------------------------------------------------------
// App.jsx — Main frontend entry component (student notes)
// ---------------------------------------------------------------------------
// Purpose:
// - Sets up client-side routing (React Router v6)
// - Fetches categories from backend once on mount
// - Runs periodic backend health checks to show connection status
// - Passes backend URL and connection state down to child components
//
// Teaching points:
// - BACKEND is read from Vite env var (VITE_BACKEND_URL) at build time.
//   In dev mode, if not set, it defaults to '/api'. For Docker Compose,
//   you typically override this with http://localhost:4000 so the browser
//   can reach the backend from the host machine.
// - Health checks run every 5 seconds to give students real-time feedback
//   when the backend restarts or is unavailable.
// - The retry button is a teaching tool: students can manually re-check
//   connection without reloading the page, demonstrating async fetch patterns.
// - Extension points: Add new routes (e.g., user profile, auth, admin panel)
//   and new components following the same pattern (ProductList, ProductForm, etc.).
// ---------------------------------------------------------------------------

const BACKEND = import.meta.env.VITE_BACKEND_URL || '/api'

export default function App() {
  const [categories, setCategories] = useState([])
  const [backendAvailable, setBackendAvailable] = useState(null)

  // Derived state for UI display (computed from backendAvailable)
  // Teaching note: This pattern avoids storing redundant state. Instead of
  // storing statusColor and statusText separately, we compute them on every
  // render. React is fast enough that this is preferred for simple logic.
  const statusColor = backendAvailable === null ? 'bg-yellow-400' : 
                      backendAvailable ? 'bg-emerald-500' : 
                      'bg-red-500'
  
  const statusText = backendAvailable === null ? 'Checking backend...' : 
                     backendAvailable ? 'Backend reachable' : 
                     'Backend unreachable'

  // Fetch categories once on mount (empty dependency array [])
  // Teaching note: Categories are used in the product form dropdown. We tolerate
  // backend unavailability by catching errors and setting an empty array.
  useEffect(() => {
    fetch(`${BACKEND}/api/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(err => {
        console.error('Fetch categories failed', err)
        setCategories([])
      })
  }, [])

  // Health check: runs immediately on mount, then repeats every 5 seconds
  // Teaching note: This effect demonstrates periodic polling. The cleanup
  // function clears the interval and sets a flag to avoid state updates
  // after unmount (React warns if you update state on unmounted components).
  useEffect(() => {
    let stopped = false
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND}/health`, { cache: 'no-store' })
        if (!stopped) setBackendAvailable(res.ok)
      } catch (err) {
        console.warn('Backend health check failed:', err.message)
        if (!stopped) setBackendAvailable(false)
      }
    }
    check()
    const id = globalThis.setInterval(check, 5000)
    return () => { stopped = true; globalThis.clearInterval(id) }
  }, [])

  return (
    <BrowserRouter>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header with status indicator and navigation */}
        {/* ACCESSIBILITY: Proper landmark roles, ARIA labels, and semantic HTML */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Minimal Product Catalog</h1>
            <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
              {/* Live backend status indicator (green/yellow/red) */}
              {/* ACCESSIBILITY: Screen reader friendly status with aria-live */}
              <div className="flex items-center gap-2" role="status" aria-live="polite">
                <span 
                  className={`inline-block w-2 h-2 rounded-full ${statusColor}`}
                  aria-hidden="true"
                />
                <span aria-label={`Backend connection status: ${statusText}`}>
                  {statusText}
                </span>
              </div>
              {/* Display the backend URL so students can verify configuration */}
              <div className="text-xs text-gray-500" aria-label="Backend configuration">
                Using backend: <code className="px-2 py-1 bg-gray-100 rounded">{String(BACKEND)}</code>
              </div>
            </div>
          </div>

          {/* Simple nav links (React Router) */}
          {/* ACCESSIBILITY: Proper navigation landmark with aria-label */}
          <nav className="space-x-2" aria-label="Main navigation">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
              aria-label="Go to home page (product list)"
            >
              Home
            </Link>
            <Link 
              to="/add" 
              className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
              aria-label="Add a new product"
            >
              Add product
            </Link>
            {/* EXTENSION_POINT: nav.auth | Add login/logout links | beginner — Add /login route and auth state */}
          </nav>
        </header>

        {/* Offline banner with manual retry button (teaching tool) */}
        {/* ACCESSIBILITY: Alert role for important system status, proper button labeling */}
        {backendAvailable === false && (
          <div 
            className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800" 
            role="alert"
            aria-live="assertive"
          >
            Backend is currently unavailable. The app may be offline. 
            <button 
              onClick={() => {
                // quick manual re-check
                fetch(`${BACKEND}/health`, { cache: 'no-store' })
                  .then(r => { if (r.ok) setBackendAvailable(true) })
                  .catch(() => setBackendAvailable(false))
              }} 
              className="ml-2 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-1"
              aria-label="Retry connection to backend server"
            >
              Retry
            </button>
          </div>
        )}

        {/* React Router v6 routes */}
        {/* Teaching note: Each <Route> maps a URL path to a React component.
            The colon syntax (:id) creates a route parameter that components
            can read via useParams(). See ProductDetail.jsx for an example.
            ACCESSIBILITY: Main content landmark for screen readers */}
        <main role="main" aria-label="Main content">
          <Routes>
            <Route path="/" element={<ProductList categories={categories} backend={BACKEND} backendAvailable={backendAvailable} />} />
            <Route path="/product/:id" element={<ProductDetail backend={BACKEND} backendAvailable={backendAvailable} />} />
            <Route path="/product/:id/edit" element={<ProductForm categories={categories} backend={BACKEND} backendAvailable={backendAvailable} isEdit={true} />} />
            <Route path="/add" element={<ProductForm categories={categories} backend={BACKEND} backendAvailable={backendAvailable} />} />
            {/* EXTENSION_POINT: routes.users | Add user management routes | beginner — Add /users, /users/:id, /users/new */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
