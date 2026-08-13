import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import {corsMiddleware} from  './middlewares/cors.js'

const PORT = process.env.PORT || 3000
const app = express()

app.use(corsMiddleware())
app.use(express.json())

app.use('/jobs', jobsRouter)

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
