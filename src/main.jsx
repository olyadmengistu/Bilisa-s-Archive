import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SimpleAuthProvider } from './auth/SimpleAuthProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleAuthProvider>
      <App />
    </SimpleAuthProvider>
  </React.StrictMode>,
)
