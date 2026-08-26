import crypto from 'node:crypto'
import type { CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'
import { mapperJob } from '../utils/mapper'
import { db } from '../db/database'
import { JobAPI, JobDB } from '../types';

let query_base = `
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
      conditions.push(' modality = ?')
      params.push(filters.modality)
    }

    if(filters?.level) {
      conditions.push(' level = ?')
      params.push(filters.level)
    }

    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id'

    if (filters?.limit && filters?.offset) {
      query += ` LIMIT ? OFFSET ?`
      params.push(filters.limit)
      params.push(filters.offset)
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

    insertJobContent.run(newJob.id, newJob.content?.description, newJob.content?.responsibilities, newJob.content?.requirements, newJob.content?.about)

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
    
    const updateJob = db.prepare(`UPDATE jobs 
    SET title = ?,
    company = ?,
    location = ?,
    description = ?,
    modality = ?,
    level = ?
    WHERE id = ?
    `)

    try {

      const tx = db.transaction(() => {
        const { changes } = updateJob.run(input.title, input.company, input.location, input.description, input.data?.modality, input.data?.level, id)
    
        if (changes === 0) throw new Error('No job found');

        const techs = input.data?.technology
        if (techs && techs.length > 0) {
          db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
          for (const tech of techs) {
            db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)').run(id, tech)
          }
        }

        db.prepare(`
      UPDATE job_content
      SET description = ?,
      responsibilities = ?,
      requirements = ?,
      about = ?
      WHERE job_id = ?
    `).run(input.content?.description, input.content?.responsibilities, input.content?.requirements, input.content?.about, id)
      })
      tx()

      const job = await JobModel.getById(id)
      return job!
      
    } catch {
      return null
    }

  }
}
