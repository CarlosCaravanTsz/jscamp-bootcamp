import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";

import app from "./app.js";

let server;
const PORT = 5678;
const BASE_URL = `http://localhost:${PORT}`;


const handleGetResponseAndCheckStatus = async (path, expectedStatus) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`);
  assert.strictEqual(response.status, expectedStatus);
  return response;
};

const handlePostResponseAndCheckStatus = async (path, expectedStatus, body) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.strictEqual(response.status, expectedStatus);
  return response;
};

const handlePutResponseAndCheckStatus = async (path, expectedStatus, body) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.strictEqual(response.status, expectedStatus);
  return response;
};

const handlePatchResponseAndCheckStatus = async (path, expectedStatus, body) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.strictEqual(response.status, expectedStatus);
  return response;
};

const handleDeleteResponseAndCheckStatus = async (path, expectedStatus) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: "DELETE",
  });
  assert.strictEqual(response.status, expectedStatus);
  return response;
};

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

describe("GET /jobs", () => {
  test("Debe responder con 200 y un array de trabajos", async () => {
    const response = await handleGetResponseAndCheckStatus("jobs", 200);
    const json = await response.json();
    assert.ok(Array.isArray(json.data), "La respuesta debe ser un array de jobs");
  });

  test("Filtrando trabajos por tecnologia", async () => {
    const tech = "react";
    const response = await handleGetResponseAndCheckStatus(`jobs?technology=${tech}`, 200);
    const json = await response.json();
    assert.ok(json.data.length > 0, "Debe haber al menos un resultado");
    assert.ok(
      json.data.every((job) => job.data.technology.includes(tech)),
      "Todos los trabajos deben incluir la tecnología" + tech,
    );
  });

  test("Debe respetar el limite de resultados", async () => {
    const response = await handleGetResponseAndCheckStatus("jobs?limit=2", 200);
    const json = await response.json();
    assert.strictEqual(json.limit, 2);
    assert.strictEqual(json.data.length, 2);
  });

  test("Debe aplicar offset correctamente", async () => {
    const allResponse = await handleGetResponseAndCheckStatus("jobs", 200);
    const allJson = await allResponse.json();

    const response = await handleGetResponseAndCheckStatus("jobs?offset=1", 200);
    const json = await response.json();

    assert.strictEqual(json.data[0].id, allJson.data[1].id);
  });
});

describe("POST /jobs", () => {
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

    const response = await handlePostResponseAndCheckStatus("jobs", 201, newJob);
    const json = await response.json();

    assert.match(
      json.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      "El job devuelto debe tener un id con formato UUID",
    );

    const { id, ...jobToTest } = json;
    assert.deepStrictEqual(newJob, jobToTest);
  });

  test("Titulo con menos de 3 caracteres -> 400", async () => {
    await handlePostResponseAndCheckStatus("jobs", 400, {
      titulo: "QA",
      empresa: "Midudev",
      ubicacion: "Remoto",
      data: { technology: ["testing"] },
    });
  });

  test("Titulo con mas de 100 caracteres -> 400", async () => {
    await handlePostResponseAndCheckStatus("jobs", 400, {
      titulo: "A".repeat(101),
      empresa: "Midudev",
      ubicacion: "Remoto",
      data: { technology: ["testing"] },
    });
  });

  test("Sin campo titulo -> 400", async () => {
    await handlePostResponseAndCheckStatus("jobs", 400, {
      empresa: "Midudev",
      ubicacion: "Remoto",
      data: { technology: ["testing"] },
    });
  });

  test("Titulo que no es string -> 400", async () => {
    await handlePostResponseAndCheckStatus("jobs", 400, {
      titulo: 123,
      empresa: "Midudev",
      ubicacion: "Remoto",
      data: { technology: ["testing"] },
    });
  });

  test("Sin campo descripcion (es opcional) -> 201", async () => {
    await handlePostResponseAndCheckStatus("jobs", 201, {
      titulo: "Backend Dev",
      empresa: "Midudev",
      ubicacion: "Remoto",
      data: { technology: ["nodejs"] },
    });
  });
});

describe("GET /jobs/:id", () => {
  test("Debe devolver el trabajo con ID especificado", async () => {
    const id = "cc0c1fae-4e85-4e2c-9b02-f12f9df8a2c9";
    const response = await handleGetResponseAndCheckStatus(`jobs/${id}`, 200);
    const json = await response.json();
    assert.strictEqual(json.id, id);
  });

  test("Debe devolver 404 cuando el ID no exista", async () => {
    const response = await handleGetResponseAndCheckStatus("jobs/noexiste", 404);
    const json = await response.json();
    assert.ok(json.error, "La respuesta debe tener el campo error");
  });
});

describe("PUT /jobs/:id", () => {
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

    await handlePutResponseAndCheckStatus(`jobs/${id}`, 204, updateJob);

    const response = await handleGetResponseAndCheckStatus(`jobs/${id}`, 200);
    const json = await response.json();

    const { id: _, ...jobToTest } = json;
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
        requirements: "Conocimiento de frameworks web, arquitectura de software...",
        about: "Midudev el mejor canal de programacion de habla hispana...",
      },
    };

    await handlePutResponseAndCheckStatus(`jobs/${id}`, 404, updateJob);
  });
});

describe("PATCH /jobs/:id", () => {
  test("Debe recibir 204 y actualizar parcialmente el trabajo", async () => {
    const id = "7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4";
    const before = await handleGetResponseAndCheckStatus(`jobs/${id}`, 200).then(
      (res) => res.json(),
    );

    const updateJob = {
      titulo: "Desarrollador para Google",
      empresa: "Google",
      ubicacion: "Presencial",
    };

    await handlePatchResponseAndCheckStatus(`jobs/${id}`, 204, updateJob);

    const after = await handleGetResponseAndCheckStatus(`jobs/${id}`, 200).then(
      (res) => res.json(),
    );

    assert.strictEqual(after.titulo, updateJob.titulo);
    assert.strictEqual(after.empresa, updateJob.empresa);
    assert.strictEqual(after.ubicacion, updateJob.ubicacion);
    assert.strictEqual(after.descripcion, before.descripcion);
    assert.deepStrictEqual(after.data, before.data);
  });

  test("Debe devolver 404 cuando el id no existe", async () => {
    await handlePatchResponseAndCheckStatus("jobs/aaaa", 404, {
      titulo: "Nuevo titulo",
    });
  });
});

describe("DELETE /jobs/:id", () => {
  test("Debe recibir 204 y eliminar el trabajo", async () => {
    const id = "e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d";
    await handleDeleteResponseAndCheckStatus(`jobs/${id}`, 204);

    const response = await handleGetResponseAndCheckStatus(`jobs/${id}`, 404);
    const json = await response.json();
    assert.strictEqual(json.error, "Job Not Found");
  });

  test("Debe devolver 404 cuando el id no existe", async () => {
    await handleDeleteResponseAndCheckStatus("jobs/aaaa", 404);
  });
});