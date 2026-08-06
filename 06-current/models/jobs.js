import jobs from "../jobs.json" with { type: "json" };
import { DEFAULTS } from "../config.js";

export class JobModel {
  static async getAll({ text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET }) {
    let filteredJobs = jobs;

    if (text) {
      const searchTerm = text.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.titulo.toLowerCase().includes(searchTerm) ||
          job.descripcion.toLowerCase().includes(searchTerm),
      );
    }

    if (technology) {
      filteredJobs = filteredJobs.filter((job) =>
        job.tecnologias.includes(technology),
      );
    }

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);
    const paginatedJobs = filteredJobs.slice(
      offsetNumber,
      offsetNumber + limitNumber,
    );

    return {
      data: paginatedJobs,
      total: filteredJobs.length,
      limit: limitNumber,
      offset: offsetNumber,
    };
  }

  static async getById({ id }) {
    return jobs.find((job) => job.id === id);
  }

  static async create({ }) {

  }

  static async update({ id }) {

  }

  static async partialUpdate({ id }) {

  }

  static async delete({ id }) {

  }
}
