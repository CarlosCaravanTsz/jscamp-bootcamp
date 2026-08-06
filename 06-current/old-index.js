import express from 'express'
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

app.use((req, res, next) => {
  const timeString = new Date().toLocaleTimeString()
  console.log(timeString)
  next()
}) // pasan por aqui todas las requests

app.get('/', (req, res) => {
  res.send('Hello World!!')
})

app.get('/health', (req, res) => {
  return res.json({
    status: 'ok',
    uptime: process.uptime()
  })
})

app.get('/jobs', async (req, res) => {
  // peticion a la bd
  const { default: jobs } = await import('./jobs.json', { with: { type: 'json' } })

  const { text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET } = req.query  // QUERY STRING: LO QUE VA DESPUES DE ? EN LA URL
  
  let filteredJobs = jobs

  if (text) {
    const searchTerm = text.toLowerCase()
    filteredJobs = filteredJobs.filter( job => job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm))
  }

  if (technology) {
    filteredJobs = filteredJobs.filter( job => job.tecnologias.includes(technology))
  }

  const limitNumber = Number(limit)
  const offsetNumber = Number(offset)
  const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

  return res.json(paginatedJobs);
})


app.get('/jobs:id', (req, res) => {
  const { id } = req.params // PARAMS SIEMPRE VIENEN EN EL PATH DE LA URL
  const idNumber = Number(id)

  return res.json({job: { id: idNumber, title: 'Job with ID ' + id }})

})


app.post('/jobs', (req, res) => {
  return res.json({ message: 'Job created' })
})

// Reemplazar un recurso completo
app.put('/jobs/:id', (req, res) => {
  const { id } = req.params
  return res.json({ message: 'Job updated with ID ' + id })
})


// Actualizar parcialmente un recurso
app.patch('/jobs/:id', (req, res) => {
  const { id } = req.params
  return res.json({ message: 'Job partially updated with ID ' + id })
})

app.delete('/jobs/:id', (req, res) => {
  const { id } = req.params
  return res.json({ message: 'Job deleted with ID ' + id })
})









// Comodin
app.get('/bb*bb', (req, res) => {
  return res.send('bb*bb')
})
  
  // Opcional
  app.get('/a{b}cd', (req, res) => {
    return res.send('a{b}cd')
  })


// RUTAS MAS LARGAS QUE NO SABES COMO TERMINAN
app.get('/file/*filename', (req, res) => {
  return res.send('file/*')
})


//Usar REGEX
app.get('/.*fly$/', (req, res) => {
  return res.json({ message: 'You are trying to access a file that ends with fly' })
})



app.listen(PORT, () => {
  console.log(`Server levandato en localhost:${PORT}`)
})