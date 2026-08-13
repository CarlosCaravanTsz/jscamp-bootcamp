import jobs from "../jobs.json" with { type: "json" };
import { randomUUID } from "node:crypto";
import { DEFAULTS } from "../config.js";
/* Aquí deberá ir la lógica de tu modelo */
/* Recuerda que el modelo SOLO debe manejar la lógica de los datos, en este caso nuestro JSON */
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
    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);
    let results = jobs;

    if (text)
      results = results.filter(
        (job) =>
          job.titulo.toLowerCase().includes(text.toLowerCase()) ||
          job.descripcion.toLowerCase().includes(text.toLowerCase()),
      );
    if (technology)
      results = results.filter((job) =>
        job.data.technology.some(
          (tech) => tech.toLowerCase() === technology.toLowerCase(),
        ),
      );
    if (modalidad)
      results = results.filter(
        (job) => job.data.modalidad.toLowerCase() === modalidad.toLowerCase(),
      );
    if (level)
      results = results.filter(
        (job) => job.data.nivel.toLowerCase() === level.toLowerCase(),
      );
    if (ubicacion)
      results = results.filter(
        (job) => job.ubicacion.toLowerCase() === ubicacion.toLowerCase(),
      );

    results = results.slice(offsetNumber, offsetNumber + limitNumber);

    return {
      total: results.length,
      limit: limitNumber,
      offset: offsetNumber,
      data: results,
    };
  }

  static getById = (id) => jobs.find((job) => job.id === id);

  static create = async ({
    titulo,
    empresa,
    ubicacion,
    descripcion,
    data,
  }) => {
    jobs.push({
      id: randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
    });
    return jobs[jobs.length - 1];
  };

  static async update(
    id,
    { titulo, empresa, ubicacion, descripcion, data },
  ) {
    const updatedJob = {
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
    };
    const jobIdx = jobs.findIndex((job) => job.id === id);
    if (jobIdx === -1) return null;
    jobs[jobIdx] = updatedJob;
    return jobs[jobIdx];
  }

  static partialUpdate = async (
    id,
    { titulo, empresa, ubicacion, descripcion, data, content },
  ) => {
    const updatedJob = {
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
    };
    const changes = Object.fromEntries(
      Object.entries(updatedJob).filter(([_, value]) => value !== undefined),
    );
    const jobIdx = jobs.findIndex((job) => job.id === id);
    if (jobIdx === -1) return null;
    jobs[jobIdx] = { ...jobs[jobIdx], ...changes };
    return jobs[jobIdx];
  };

  static delete = async (id) => {
    const jobIdx = jobs.findIndex((job) => job.id === id);
    if (jobIdx === -1) return null;
    return jobs.splice(jobIdx, 1)[0];
  };
}
