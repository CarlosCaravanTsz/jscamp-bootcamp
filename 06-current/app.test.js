import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'

import app from './app.js'

let server
const PORT = 2345 // PROVAR EN OTRO PUERTO
const BASE_URL = `http://localhost:${PORT}`

// se ejecuta antes de que se ejecuten los tests
before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())
    server.on('error', reject)
  })
})

// Despues de todos los tests, se ejecuta una vez para cerrar el servidor
after(async () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err)
      resolve()
    });
    
  });
});

// primer test

describe('GET /jobs', () => {
  test('Debe responder 200 y un array de trabajos', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200) // usa ===

    const json = await response.json()
    assert.ok(Array.isArray(json.data), 'La respuesta debe ser un array') 
  })

  test("Debe filtrar trabajos por tecnologia", async () => {
    const tech = "react";
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data), "La respuesta debe ser un array");
    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      "Todos los trabajos deben incluir la tecnologia " + tech,
    );
  });
})


