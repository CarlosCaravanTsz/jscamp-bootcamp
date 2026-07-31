import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const args = process.argv.slice(2);
console.log("Arguments: ", args, typeof args);

const dir = process.argv[2] ?? ".";

const formatBytes = (size) => {
  if (size < 1024) return `${size} B`;
  return `${(size / 1024).toFixed(2)} KB`;
};

if (!process.permission || process.permission.has("fs.read", dir)) {
  const files = await readdir(dir);

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

  if (args.includes("--asc"))
    entries.sort((a, b) => a.name.localeCompare(b.name));
  else if (args.includes("--desc"))
    entries.sort((a, b) => b.name.localeCompare(a.name));

  if (args.includes("--files"))
    entries = entries.filter((entry) => !entry.isDir);
  else if (args.includes("--folders"))
    entries = entries.filter((entry) => entry.isDir);

  for (const entry of entries) {
    const icon = entry.isDir ? "📂" : "📄";
    const size = entry.isDir ? "-" : `${entry.size}`;
    console.log(`${icon}  ${entry.name.padEnd(25)} ${size}`);
  }
} else {
  console.log(
    "You don't have permissions to read this path, please enable them",
  );
}
