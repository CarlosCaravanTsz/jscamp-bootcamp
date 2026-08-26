import Database from 'better-sqlite3'

const db = new Database('jobs.db')

//pragma = configuraciones

db.pragma('journal_mode = WAL') // mejora el rendimiento en concurrencia
db.pragma('foreign_keys = ON') // habilita foreign key enforcement

export { db }




