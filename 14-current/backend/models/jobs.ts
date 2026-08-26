import { randomUUID } from "node:crypto";
import {db} from '../db/database.ts'
import { DEFAULTS } from "../config.js";
import jobs from "../jobs.json" with { type: "json" };
export class JobModel {
  static async getAll({
    text,
    limit = DEFAULTS.LIMIT_PAGINATION,
    offset = DEFAULTS.LIMIT_OFFSET,
    technology,
    modalidad,
    level,
  }) {

    let query = `
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
    `

    const conditions: string[] = []
    const params: unknown[] = []

    if (technology) {
      conditions.push(`j.id IN (SELECT job_id FROM job_technologies WHERE technology = ?)`)
      params.push(technology)
    }

    if (modalidad) {
      conditions.push(``)
      params.push(modalidad)
    }

    if (level) {
      conditions.push(``)
      params.push(level)
    }

    if (conditions.length > 0) {
      query += 'WHERE' + conditions.join(' AND ')
    }

    query += 'GROUP BY j.id'

    const rows = db.prepare(query).all(...params)
    console.log(rows)

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies.split(','),
        modalidad: row.modalidad,
        level:  row.level
      }
    }))




    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    const normalizedLimit = Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : DEFAULTS.LIMIT_PAGINATION
    const normalizedOffset = Number.isInteger(offsetNumber) && offsetNumber >= 0 ? offsetNumber : DEFAULTS.LIMIT_OFFSET

    let results = jobs

    if (text) results = results.filter(job => job.titulo.toLowerCase().includes(text.toLowerCase()) || job.descripcion.toLowerCase().includes(text.toLowerCase()))
    if (technology) results = results.filter(job => job.data.technology.some( tech => tech.toLowerCase() === technology.toLowerCase()))
    if (modalidad) results = results.filter(job => job.data.modalidad.toLowerCase() === modalidad.toLowerCase())
    if (level) results = results.filter(job => job.data.nivel.toLowerCase() === level.toLowerCase())
    
    results = results.slice(offsetNumber, offsetNumber + limitNumber);
    
    return {
      total: results.length,
      limit: limitNumber,
      offset: offsetNumber,
      data: results
    }
  }

  static getById = (id) => jobs.find( job => job.id === id)

  static create = async({
    titulo,
    empresa,
    ubicacion,
    descripcion,
    data,
    content,
  }) => {
    jobs.push({
      id: randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    });
    return jobs[jobs.length - 1];
    }

  static async update(id,{ titulo, empresa, ubicacion, descripcion, data, content }) {
    const updatedJob = {titulo, empresa, ubicacion, descripcion, data, content}
    const jobIdx = jobs.findIndex((job) => job.id === id);
    if (jobIdx === -1) return null
    jobs[jobIdx] = updatedJob;
    return jobs[jobIdx];
  }

  static partialUpdate = async (id, { titulo, empresa, ubicacion, descripcion, data, content }) => {
    const updatedJob = {titulo, empresa, ubicacion, descripcion, data, content}
    const changes = Object.fromEntries(
      Object.entries(updatedJob).filter(([_, value]) => value !== undefined))
    const jobIdx = jobs.findIndex(job => job.id === id)
    if (jobIdx === -1) return null
    jobs[jobIdx] = { ...jobs[jobIdx], ...changes };
    return jobs[jobIdx];
  }

  static delete = async (id) => {
    const jobIdx = jobs.findIndex(job => job.id === id)
    if (jobIdx === -1) return null
    return jobs.splice(jobIdx, 1)[0]
  }
}
