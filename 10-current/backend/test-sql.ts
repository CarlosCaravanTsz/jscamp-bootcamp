import Database from 'better-sqlite3'

// Base de datos en memoria (se pierde al cerrar el proceso)
const db = new Database('jobs.db')

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    modality TEXT NOT NULL
)
`)

// Insertar datos con un pepared statement (previene sql injection)
const insert = db.prepare(
  'INSERT INTO jobs(id, title, company, modality) VALUES (?,?,?,?)'
)

insert.run('1', 'Frontend Developer', 'Tech Corp', 'remote')
insert.run('2','Frontend Developer', 'Caravantes Corp', 'hybrid')


// Consultar todos
const allJobs = db.prepare('SELECT * FROM jobs').all()
console.log('Todos los jobs', allJobs)

// Consultar con filtro
const remoteJobs = db.prepare('SELECT * FROM jobs WHERE modality = ?').all('remote')
console.log('Todos los jobs', remoteJobs)

// Consultar por id
const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get('1')
console.log('Job 1', job)

// Actualizar
db.prepare('UPDATE jobs SET modality = ? WHERE id = ?').run('onsite', '1')

// Eliminar
const result = db.prepare('DELETE FROM jobs WHERE id = ?').run('2')
console.log('Filas eliminadas: ', result.changes)

db.close()