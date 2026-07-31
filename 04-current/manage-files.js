import { mkdir,readFile, writeFile } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

  let content = ''
if (process.permission.has('fs.read', 'archivo.txt')) {
  content = await readFile("./archivo.txt", "utf-8");
  console.log(content)
} else {
  console.log('No tienes permisos para leer el archivo')
}

if (process.permission.has('fs.write', 'output/files/documents')) {
  const ouputDir = join("output", "files", "documents");
  await mkdir(ouputDir, { recursive: true });

  const uppercaseContent = content.toUpperCase();
  const outputFilePath = join(outputDir, "archivo-uppercase.txt");

  console.log("La extension es ", extname(outputFilePath));
  console.log("El nombre del archivo es ", basename(outputFilePath));

  await writeFile(outputFilePath, uppercaseContent);
} else {
  console.log('No tienes permiso de escribir.')
}

