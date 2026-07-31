import { mkdir,readFile, writeFile } from 'node:fs/promises'

const content = await readFile('./archivo.txt', 'utf-8')

console.log(content)

const ouputDir = 'output/files/documents'
await mkdir(ouputDir, {recursive: true})

const uppercaseContent = content.toUpperCase()
await writeFile(`${ouputDir}/archivo-upercase.txt`, uppercaseContent);
