import { test, describe, before, after } from "node:test";
import assert from "node:assert";

import app from "./app.js";
import { validateJob, validatePartialJob } from "./schemas/jobs.js";
import jobs from "./jobs.json" with { type: "json" };

let server;
const PORT = 5678;
const BASE_URL = `http://localhost:${PORT}`;

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve());
    server.on("error", reject);
  });
});

after(async () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

// GET

describe("GET /jobs", () => {
  test("Debe responder con 200 y un array de trabajos", async () => {
    const response = await fetch(`${BASE_URL}/jobs`);
    assert.strictEqual(response.status, 200); // status code 200
    const json = await response.json();
    assert.ok(
      Array.isArray(json.data) && validateJob(json.data[0]).success,
      "La respuesta debe ser un array de JobSchema",
    );
  });

  test("Filtrando trabajos por tecnologia", async () => {
    const tech = "react";
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      "Todos los trabajos deben incluir la tecnologia" + tech,
    );
  });

  test("Debe respetar el limite de resultados", async () => {
    const limit = 2;
    const response = await fetch(`${BASE_URL}/jobs?limit=${limit}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.strictEqual(json.limit, 2);
    assert.strictEqual(json.data.length, 2);
  });

  test("Debe aplicar offset correctamente", async () => {
    const offset = 1;
    const response = await fetch(`${BASE_URL}/jobs?offset=${offset}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.strictEqual(json.data[0].id, jobs[1].id);
  });
});

describe("POST /jobs", async () => {
  test("El nuevo trabajo se agrega correctamente con el formato requerido", async () => {
    const newJob = {
      titulo: "QA Tester",
      empresa: "Midudev",
      ubicacion: "Remoto",
      descripcion: "Buscamos un ingeniero QA",
      data: {
        technology: ["testing", "nodejs", "expressjs"],
        modalidad: "remoto",
        nivel: "mid",
      },
    };

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    });

    assert.strictEqual(response.status, 201);

    const json = await response.json();

    assert.ok(json.id, "El job devuelto debe tener un id generado");

    const { id, ...jobToTest } = json;
    assert.deepStrictEqual(newJob, jobToTest);
  });

  test("Titulo con menos de 3 caracteres -> 400", async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "QA",
        empresa: "Midudev",
        ubicacion: "Remoto",
        data: { technology: ["testing"] },
      }),
    });
    assert.strictEqual(response.status, 400);
  });

  test("Titulo con mas de 100 caracteres -> 400", async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "A".repeat(101),
        empresa: "Midudev",
        ubicacion: "Remoto",
        data: { technology: ["testing"] },
      }),
    });
    assert.strictEqual(response.status, 400);
  });

  test("Sin campo titulo -> 400", async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: "Midudev",
        ubicacion: "Remoto",
        data: { technology: ["testing"] },
      }),
    });
    assert.strictEqual(response.status, 400);
  });

  test("Titulo que no es string -> 400", async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: 123,
        empresa: "Midudev",
        ubicacion: "Remoto",
        data: { technology: ["testing"] },
      }),
    });
    assert.strictEqual(response.status, 400);
  });

  test("Sin campo descripcion (es opcional) -> 201", async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "Backend Dev",
        empresa: "Midudev",
        ubicacion: "Remoto",
        data: { technology: ["nodejs"] },
      }),
    });
    assert.strictEqual(response.status, 201);
  });
});

describe("GET /jobs/:id", async () => {
  test("Debe devolver el trabajo con ID especificado", async () => {
    const id = "cc0c1fae-4e85-4e2c-9b02-f12f9df8a2c9";
    const response = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(response.status, 200);
    const json = await response.json();
    assert.ok(json.id, "El job devuelto debe tener un id valido");
    assert.ok(
      jobs.filter((job) => job.id === id).length === 1,
      "El id debe coincidir con uno del json jobs",
    );
  });

  test("Debe devolver 404 cuando el ID no exista", async () => {
    const id = "noexiste";
    const response = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(response.status, 404);
    const json = await response.json();
    assert.ok(json.error, "La respuesta debe tener el campo error");
  });
});

describe("PUT /jobs/:id", async () => {
  test("Debe recibir 204 y actualizar el trabajo", async () => {
    const id = "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4";
    const updateJob = {
      titulo: "Desarrollador para MiduDev",
      empresa: "Midudev",
      ubicacion: "Remoto",
      descripcion: "Buscamos un senior software engineer",
      data: {
        technology: ["react", "node", "javascript"],
        modalidad: "remoto",
        nivel: "senior",
      },
    };

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateJob),
    });

    assert.strictEqual(response.status, 204);
    const newResponse = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(newResponse.status, 200);

    const newJson = await newResponse.json();

    const { id: newId, ...jobToTest } = newJson;
    assert.deepStrictEqual(updateJob, jobToTest);
  });

  test("Debe devolver 404 cuando el id no existe", async () => {
    const id = "aaaa";
    const updateJob = {
      titulo: "Desarrollador para MiduDev",
      empresa: "Midudev",
      ubicacion: "Remoto",
      descripcion: "Buscamos un senior software engineer",
      data: {
        technology: ["react", "node", "javascript"],
        modalidad: "remoto",
        nivel: "senior",
      },
      content: {
        description: "Trabajo fullstack para desarrollador...",
        responsibilities: "Diseniar APIs escalables y seguras",
        requirements:
          "Conocimiento de frameworks web, arquitectura de software...",
        about: "Midudev el mejor canal de programacion de habla hispana...",
      },
    };

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateJob),
    });
    assert.strictEqual(response.status, 404);
  });
});

describe("PATCH /jobs/:id", async () => {
  test("Debe recibir 204 y actualizar parcialmente el trabajo", async () => {
    const id = "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4";
    const updateJob = {
      titulo: "Desarrollador para Google",
      empresa: "Google",
      ubicacion: "Presencial",
    };

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateJob),
    });

    assert.strictEqual(response.status, 204);
    const newResponse = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(newResponse.status, 200);

    const newJson = await newResponse.json();

    assert.ok(Object.entries(updateJob).every(
      ([key, value]) => newJson[key] === value),'Los campos que se envian deben ser los mismos que el de la job consultada')

  });

  test("Debe devolver 404 cuando el id no existe", async () => {
    const id = "aaaa";
    const updateJob = {
      titulo: "Desarrollador para MiduDev",
      empresa: "Midudev",
      ubicacion: "Remoto",
      descripcion: "Buscamos un senior software engineer",
      data: {
        technology: ["react", "node", "javascript"],
        modalidad: "remoto",
        nivel: "senior",
      },
      content: {
        description: "Trabajo fullstack para desarrollador...",
        responsibilities: "Diseniar APIs escalables y seguras",
        requirements:
          "Conocimiento de frameworks web, arquitectura de software...",
        about: "Midudev el mejor canal de programacion de habla hispana...",
      },
    };

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateJob),
    });
    assert.strictEqual(response.status, 404);
  });
});

describe("DELETE /jobs/:id", async () => {

  test('Debe recibir 204 y eliminar el trabajo', async () => {
    const id = "e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d";
    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "DELETE"
    });
    assert.strictEqual(response.status, 204)

    const newResponse = await fetch(`${BASE_URL}/jobs/${id}`);
    assert.strictEqual(newResponse.status, 404);
    const json = await newResponse.json()

    assert.strictEqual(json.error, 'Job Not Found')

  })




  test("Debe devolver 404 cuando el id no existe", async () => {
    const id = "aaaa";

    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: "DELETE",
    });
    assert.strictEqual(response.status, 404);
  });
});
