import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './App.jsx'
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <AppRoutes />
    </AuthProvider>
  </StrictMode>,
)
