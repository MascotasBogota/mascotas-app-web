import { useState, useEffect } from 'react'
import authService from '../services/authService'
import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>¡Bienvenido a Mascotas App! 🐾</h1>
          {user && (
            <p className="welcome-message">
              Hola <strong>{user.fullName}</strong>, ¿qué quieres hacer hoy?
            </p>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🐕</div>
            <h3>Mis Mascotas</h3>
            <p>Gestiona la información de tus mascotas</p>
            <button className="card-button">Ver Mascotas</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Citas Veterinarias</h3>
            <p>Programa y gestiona citas médicas</p>
            <button className="card-button">Ver Citas</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💉</div>
            <h3>Vacunas</h3>
            <p>Control de vacunas y tratamientos</p>
            <button className="card-button">Ver Vacunas</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👨‍⚕️</div>
            <h3>Veterinarios</h3>
            <p>Directorio de veterinarios</p>
            <button className="card-button">Ver Veterinarios</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reportes</h3>
            <p>Estadísticas y reportes de salud</p>
            <button className="card-button">Ver Reportes</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Configuración</h3>
            <p>Ajustes de cuenta y preferencias</p>
            <button className="card-button">Configurar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard