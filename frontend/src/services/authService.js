import axios from 'axios'

// Configurar la URL base del backend
const API_URL = 'http://localhost:5000/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData)
      return response
    } catch (error) {
      throw error
    }
  },

  // Inicio de sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials)
      return response
    } catch (error) {
      throw error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null
  }
}

export default authService