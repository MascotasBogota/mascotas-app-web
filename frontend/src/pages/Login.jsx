import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './Login.css'  // ← Solo la importación del CSS

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await authService.login(formData)
      const { token, user } = response.data
      
      onLogin(token, user)
      setMessage('¡Inicio de sesión exitoso!')
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🐾 Mascotas App</h2>
        <h3>Iniciar Sesión</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
        
        {message && (
          <p className={message.includes('exitoso') ? 'success-message' : 'error-message'}>
            {message}
          </p>
        )}
        
        <div className="register-link">
          <p>¿No tienes una cuenta? 
            <Link to="/register"> Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
