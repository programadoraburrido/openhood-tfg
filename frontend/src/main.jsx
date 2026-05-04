import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // 1. Importa el Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* 2. Envuelve toda la app aquí */}
      <App />
    </AuthProvider>
  </StrictMode>,
)