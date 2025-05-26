import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './Navbar.css'

function Navbar({ onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🐾 Mascotas App
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-item">
            Dashboard
          </Link>
          <Link to="/pets" className="navbar-item">
            Mis Mascotas
          </Link>
          <Link to="/appointments" className="navbar-item">
            Citas
          </Link>
          
          <div className="navbar-user">
            <button 
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.fullName}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">
                  Mi Perfil
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Configuración
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item logout">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar