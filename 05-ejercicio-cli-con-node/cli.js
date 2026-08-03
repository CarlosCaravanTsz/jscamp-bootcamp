import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
console.log("Arguments: ", args, typeof args);

// Si damos por centado que el seguno argumento es el directorio a buscar, entonces podemos llegar a tener problemas si el usuario cambia el orden en el cli. Lo mejor es identificar el directorio y guardarlo de otra manera.
// const dir = process.argv[2] ?? ".";
const dir = args.find((arg) => !arg.startsWith("--")) ?? ".";

const formatBytes = (size) => {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(2)} KB`;
};

// Está mal definido el `if`, en caso de que no pongamos ningún flag de permisos va a acceder a la primera condición y devolver los resultados de los ficheros.

// Dos opciones:
//1 . Condición con `&&`
// if(process.permission && process.permission.has("fs.read", dir)) {
//   // Código
// }

//2 . Condición con `.?`
// if(process.permission?.has("fs.read", dir)) {
//   // Código
// }

// Por otro lado, en vez de usar un `if` si el usuario tiene permisos, vamos a hacer el caso contrario (para evitar tener que escribir un `if` con un contenido tan grande).

// Con esto, evitamos tener la lógica de negocio dentro de un `if`.
// Y Siempre debemos dar al usuario junto con el error, la solución para que pueda ejecutar el comando correctamente. Es cuestión de UX
if (!process.permission?.has("fs.read", dir)) {
  console.error(`No has podido leer el directorio ${dir}, por favor, habilita los permisos de lectura:

node --permission --allow-fs-read=${dir} cli.js ${dir}
`)

  process.exit(1);
}

let files

// Si el usuario quiere acceder a un directorio que no existe, el programa se rompe. Para evitarlo, podemos usar un `try/catch` para capturar el error y mostrar un mensaje más amigable al usuario.
try {
  files = await readdir(dir);
} catch (err) {
  console.error(`Error al leer el directorio ${dir}: ${err.message}`);
}

let entries = await Promise.all(
  files.map(async (name) => {
    const fullPath = join(dir, name);
    const info = await stat(fullPath);
    return {
      name,
      isDir: info.isDirectory(),
      size: formatBytes(info.size),
    };
  }),
);

// Lo que hiciste está genial! Una cosa que podemos hacer para mejorar esto es hacerlo desde un lado más funcional, sin tener que evaluar con includes.

// 1. Obtenemos todos los argumentos evitando duplicados
const flags = new Set(args.filter((arg) => arg.startsWith("--")))

// 2. creamos un objeto con los filtros y con los ordenadores
const sorters = {
  asc: (a, b) => a.name.localeCompare(b.name),
  desc: (a, b) => b.name.localeCompare(a.name),
}

const filters = {
  files: (entry) => !entry.isDir,
  folders: (entry) => entry.isDir,
}

let results = entries

if(flags.has('--asc') || flags.has('--desc')) {
  const sorter = flags.has('--asc') ? sorters.asc : sorters.desc
  results = [...results].sort(sorter)
}

if(flags.has('--files') || flags.has('--folders')) {
  const filter = flags.has('--files') ? filters.files : filters.folders
  results = [...results].filter(filter)
}


/* if (args.includes("--asc"))
  entries.sort((a, b) => a.name.localeCompare(b.name));
else if (args.includes("--desc"))
  entries.sort((a, b) => b.name.localeCompare(a.name));

if (args.includes("--files"))
  entries = entries.filter((entry) => !entry.isDir);
else if (args.includes("--folders"))
  entries = entries.filter((entry) => entry.isDir); */

// Usamos console.log, pero te muestro otra alternativa con table, ambas estan muy bien:
const logs = []
for (const entry of results) {
  const icon = entry.isDir ? "📂" : "📄";
  const size = entry.isDir ? "-" : `${entry.size}`;
  
  logs.push({
    type: icon,
    name: entry.name,
    size
  })
}

console.table(logs);