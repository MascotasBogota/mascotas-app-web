import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'

// Cargar variables de entorno
dotenv.config()

const app = express()

// Conectar a la base de datos
connectDB()

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

// Middleware para parsear JSON
app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Mascotas App API is running 🐾' })
})

// Ruta de prueba para /api
app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint working ✅' })
})

// Rutas principales
app.use('/api/users', userRoutes)

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found` 
  })
})

// Puerto
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at: http://localhost:${PORT}/api`)
})

export default app
