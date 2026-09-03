import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './src/config/db.js'
import projectRoutes from './src/routes/project.routes.js'
import movementRoutes from './src/routes/movement.routes.js'
import { errorHandler } from './src/middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'API NexusInterno funcionando' })
})

app.use('/api/projects', projectRoutes)
app.use('/api/movements', movementRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})