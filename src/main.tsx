import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthContext.tsx'
import  FeedProvider  from './context/FeedContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FeedProvider>
        <App />
      </FeedProvider>
    </AuthProvider>
  </StrictMode>,
)
