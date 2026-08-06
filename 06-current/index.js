import express from 'express'

const PORT = process.env.PORT ?? 1234
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

app.get('/get-jobs', async (req, res) => {
  // peticion a la bd

  const {default: jobs} = await import('./jobs.json', { with: {type: 'json' } })
  return res.json(jobs)
})

app.get('/get-single-job:id', (req, res) => {
  const { id } = req.params

  const idNumber = Number(id)

  return res.json({job: { id: idNumber, title: 'Job with ID ' + id }})

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