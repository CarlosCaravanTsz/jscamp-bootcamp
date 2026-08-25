import crypto from 'node:crypto';
import { db } from '../db/database';
import type { CreateJobDTO, JobFilters, UpdateJobDTO } from '../types';
import { JobAPI, JobDB } from '../types';
import { mapperJob } from '../utils/mapper';

/* No hace falta que sea un let porque no se actualiza. El que se actualiza es la variable `query` que agregaste debajo */
const query_base = `
        SELECT j.*, GROUP_CONCAT(jt.technology) as technologies, jc.description as description_ext, jc.responsibilities, jc.requirements, jc.about
        FROM jobs j
        LEFT JOIN job_technologies jt ON j.id = jt.job_id
        LEFT JOIN job_content jc ON j.id = jc.job_id
  
      `

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<JobAPI[]> {

    const params: string[] = []
    const conditions: string[] = []
    
    let query = query_base
    
    if (filters?.technology) {
      conditions.push('j.id IN (SELECT job_id FROM job_technologies WHERE technology = ?)')
      params.push(filters.technology)
    }

    if(filters?.modality) {
      conditions.push(' j.modality = ?')
      params.push(filters.modality)
    }

    if(filters?.level) {
      conditions.push(' j.level = ?')
      params.push(filters.level)
    }

    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    /* Ordenamos por id */
    query += ' GROUP BY j.id ORDER BY j.id'

    /* Podemos filtrar igual si no tenemos offset, usando su valor por defecto */
    if (filters?.limit !== undefined) {
      query += ` LIMIT ? OFFSET ?`
      params.push(String(filters.limit), String(filters.offset ?? 0))
    }


    const rows = db.prepare<string[],JobDB>(query).all(...params)

    const jobs: JobAPI[] = mapperJob(rows)

    return jobs
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<JobAPI | undefined> {
    let query = query_base + ' WHERE j.id = ? GROUP BY j.id '

    const jobRaw = db.prepare<string[], JobDB>(query).get(id)

    if (!jobRaw) return undefined
      
    const [job]: JobAPI[] = mapperJob([jobRaw])

    return job
  }

  static async create(input: CreateJobDTO): Promise<JobAPI> {
    const newJob: JobAPI = {
      id: crypto.randomUUID(),
      ...input,
    }

    const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, description, modality, level) VALUES
    (?,?,?,?,?,?,?)  
    `)

    const insertTech = db.prepare(`
        INSERT INTO job_technologies (job_id, technology) VALUES (?,?)  
    `)

    const insertJobContent = db.prepare(`
      INSERT INTO job_content (job_id, description, responsibilities, requirements, about ) VALUES (?,?,?,?,?)
    `)

    const tx = db.transaction(() => {
      insertJob.run(
      newJob.id, newJob.title, newJob.company, newJob.location, newJob.description, newJob.data?.modality, newJob.data?.level
    )

    for (const tech of newJob.data?.technology) {
      insertTech.run(newJob.id, tech)
    }

    // content es opcional: solo insertar si existe
    if (newJob.content) {
      insertJobContent.run(newJob.id, newJob.content.description, newJob.content.responsibilities, newJob.content.requirements, newJob.content.about)
    }

  })

  tx()
    
    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    const deleteJob = db.prepare(`DELETE FROM jobs WHERE id = ?`)
    const { changes } = deleteJob.run(id)
    if (!changes) return false
    return true
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<JobAPI | null> {
    const cols: string[] = []
    const vals: unknown[] = []

    // Solo agrega al UPDATE los campos que vienen en el body (patch parcial)
    if (input.title !== undefined) { cols.push('title = ?'); vals.push(input.title) }
    if (input.company !== undefined) { cols.push('company = ?'); vals.push(input.company) }
    if (input.location !== undefined) { cols.push('location = ?'); vals.push(input.location) }
    if (input.description !== undefined) { cols.push('description = ?'); vals.push(input.description) }
    if (input.data?.modality !== undefined) { cols.push('modality = ?'); vals.push(input.data.modality) }
    if (input.data?.level !== undefined) { cols.push('level = ?'); vals.push(input.data.level) }

    try {
      const tx = db.transaction(() => {
        /* Simplificamos el update */
        if (cols.length > 0) {
          const { changes } = db.prepare(`UPDATE jobs SET ${cols.join(', ')} WHERE id = ?`).run(...vals, id)
          if (changes === 0) throw new Error('No job found')
        }

        if (input.data?.technology && input.data.technology.length > 0) {
          db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
          const insTech = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')
          for (const tech of input.data.technology) insTech.run(id, tech)
        }

        if (input.content) {
        // Hacemos un UPSERT: creamos la fila si no existe o la actualizamos si ya está
          db.prepare(`
        INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(job_id) DO UPDATE SET
          description = excluded.description,
          responsibilities = excluded.responsibilities,
          requirements = excluded.requirements,
          about = excluded.about
      `).run(crypto.randomUUID(), id, input.content.description, input.content.responsibilities, input.content.requirements, input.content.about)
        }
      })
      tx()

      const job = await JobModel.getById(id)
      return job!
      
    } catch {
      return null
    }

  }
}
