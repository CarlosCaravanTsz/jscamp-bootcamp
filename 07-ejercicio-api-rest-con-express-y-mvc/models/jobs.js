import { randomUUID } from "node:crypto";
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
    ubicacion,
  }) {
    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    const normalizedLimit = Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : DEFAULTS.LIMIT_PAGINATION
    const normalizedOffset = Number.isInteger(offsetNumber) && offsetNumber >= 0 ? offsetNumber : DEFAULTS.LIMIT_OFFSET

    let results = jobs

    if (text) results = results.filter(job => job.titulo.toLowerCase().includes(text.toLowerCase()) || job.descripcion.toLowerCase().includes(text.toLowerCase()))
    if (technology) results = results.filter(job => job.data.technology.some( tech => tech.toLowerCase() === technology.toLowerCase()))
    if (modalidad) results = results.filter(job => job.data.modalidad.toLowerCase() === modalidad.toLowerCase())
    if (level) results = results.filter(job => job.data.nivel.toLowerCase() === level.toLowerCase())
    if (ubicacion) results = results.filter(job => job.ubicacion.toLowerCase() === ubicacion.toLowerCase())
    
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
