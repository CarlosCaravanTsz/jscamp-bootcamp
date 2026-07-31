import { createServer } from "node:http";
import { json } from 'node:stream/consumers'
import { randomUUID } from "node:crypto";

process.loadEnvFile(); // read automatically .env y poner en el process.env todas las vars del .env
const port = process.env.PORT ?? 3000;

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

const users = [
  { id: 1, name: "Alice" },
  { id: 1, name: "Bob" },
];

const server = createServer(async (req, res) => {
  const { method, url } = req;

  console.log(method, url)

  if (method === "GET") {
    if (url === "/users") {
      return sendJson(res, 200, users);
    }

    if (url === "/health") {
      return sendJson(res, 200, { status: "ok", uptime: process.uptime() });
    }
  }

  if (method === 'POST') {
    if (url === '/users') {
      const body = await json(req)

      if (!body || !body.name) {
        return sendJson(res, 400, { error: 'Name is required'})
      }

      const newUsers = {
        id: randomUUID(),
        name: body.name
      }

      users.push(newUsers)
      
      return sendJson(res, 201, {message: 'Usuario creado'})
    }
  }

  res.statusCode = 404;
  return sendJson(res, 404, { error: "Not found" });
});

server.listen(port, () => {
  const address = server.address();
  console.log(`Servidor escuchando en http:localhost:${address.port}`);
});
