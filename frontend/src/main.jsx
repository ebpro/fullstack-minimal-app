import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// ---------------------------------------------------------------------------
// App entry point (student notes)
// ---------------------------------------------------------------------------
// - Vite serves `index.html` which loads this module as the app entry.
// - `createRoot` mounts the React tree into the <div id="root"> element.
// - `React.StrictMode` helps highlight potential problems during development
//   (it runs some lifecycle methods twice in dev to detect side-effects).
// ---------------------------------------------------------------------------

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
