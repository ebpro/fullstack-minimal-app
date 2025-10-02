import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite config: small, non-breaking developer niceties
export default defineConfig({
  plugins: [react()],
  // keep a consistent default port for the dev server
  server: {
    port: 5173,
    host: '0.0.0.0', // Bind to all interfaces for Docker compatibility
    watch: {
      usePolling: true // Enable polling for file changes in Docker
    }
  },
  // allow imports like `import X from '@/components/X'`
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // only expose env vars prefixed with VITE_ (default)
  envPrefix: ['VITE_'],
  // speed up cold start for known deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
