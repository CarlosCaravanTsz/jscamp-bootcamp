import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'

import app from './app.js'
import { validateJob } from './schemas/jobs'
import jobs from '../jobs.json' with {type: 'json'}


let server
const PORT = 5678
const BASE_URL = `http://localhost:${PORT}`

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())
    server.on(error, reject)
  })
})


after(async () => {
  return new Promise((resolve, reject) => {
    server.close( (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
})

// GET

describe('GET /jobs', () => {

  test('Debe responder con 200 y un array de trabajos', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200) // status code 200
    assert.ok(Array.isArray(json.data) && validateJob(json.data[0]).success , 'La respuesta debe ser un array de JobSchema')
  })

  test('Filtrando trabajos por tecnologia', async () => {
    const tech = 'react'
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
    assert.strictEqual(response.status, 200)
    const json = await response.json()
    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      'Todos los trabajos deben incluir la tecnologia' + tech
    )
  })

  test('Debe respetar el limite de resultados', async () => {
    const limit = 2
    const response = await fetch(`${BASE_URL}/jobs?limit=${limit}`);
    assert.strictEqual(response.status, 200)
    const json = await response.json()
    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('Debe aplicar offset correctamente', async () => {
    const offset = 1
    const response = await fetch(`${BASE_URL}/jobs?offset=${offset}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.strictEqual(json.data[0].id, jobs[0].id)
  })

})


