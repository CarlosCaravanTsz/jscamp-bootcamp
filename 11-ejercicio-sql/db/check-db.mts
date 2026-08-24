import Database from 'better-sqlite3'

const db = new Database('jobs.db')

console.log('=== JOBS (count) ===')
console.log(db.prepare('SELECT COUNT(*) as total FROM jobs').get())

console.log('\n=== JOBS ===')
console.table(db.prepare('SELECT id, title, company, modality, level FROM jobs').all())

console.log('\n=== JOB_TECHNOLOGIES (count) ===')
console.log(db.prepare('SELECT COUNT(*) as total FROM job_technologies').get())

console.log('\n=== JOB_TECHNOLOGIES (sample) ===')
console.table(db.prepare('SELECT * FROM job_technologies LIMIT 10').all())

console.log('\n=== JOB_CONTENT (count) ===')
console.log(db.prepare('SELECT COUNT(*) as total FROM job_content').get())

db.close()
