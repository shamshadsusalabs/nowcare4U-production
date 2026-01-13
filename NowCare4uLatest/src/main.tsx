import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import { UserProvider } from './auth/UserContext'
import { AdminProvider } from './_admin/AdminContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <UserProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </UserProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
