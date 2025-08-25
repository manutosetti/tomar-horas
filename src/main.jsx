import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'

// Configurar el título de la aplicación
document.title = 'Sistema de Gestión de Horas'

// Agregar clase para tema oscuro por defecto
document.documentElement.classList.add('dark')

// Crear y montar la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)