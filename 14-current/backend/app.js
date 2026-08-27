import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import {corsMiddleware} from  './middlewares/cors.js'
import { aiRouter } from './routes/ai.js'

const PORT = process.env.PORT || 3000
const app = express()

app.set('trust proxy', 1) // 1 porque solo tienes 1 proxy delante de tu app, si tienes mas, subir el numero. Si estas detras de un proxy como nginx, vercel,  cloudflare, esto es importante para que el rate limiter funcione correctamente con la IP del cliente real.

app.use(corsMiddleware())
app.use(express.json())

app.use('/jobs', jobsRouter)
app.use('/ai', aiRouter)

app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
