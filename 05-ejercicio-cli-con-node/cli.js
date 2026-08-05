import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
console.log("Arguments: ", args, typeof args);

const dir = args.find((arg) => !arg.startsWith("--")) ?? ".";

const formatBytes = (size) => {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(2)} KB`;
};

if (!process.permission?.has("fs.read", dir)) {
  console.error(`No has podido leer el directorio ${dir}, por favor, habilita los permisos de lectura:

node --permission --allow-fs-read=${dir} cli.js ${dir}
`)

  process.exit(1);
}

let files

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


const flags = new Set(args.filter((arg) => arg.startsWith("--")))

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