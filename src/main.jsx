import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BackendAuthProvider } from './auth/BackendAuthProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BackendAuthProvider>
      <App />
    </BackendAuthProvider>
  </React.StrictMode>,
)
