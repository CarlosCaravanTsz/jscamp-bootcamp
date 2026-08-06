
import {JobModel} from "../models/jobs.js";

export class JobController {
  static async getAll(req, res) {
    const {
      text,
      title,
      level,
      limit = DEFAULTS.LIMIT_PAGINATION,
      technology,
      offset = DEFAULTS.LIMIT_OFFSET,
    } = req.query; // QUERY STRING: LO QUE VA DESPUES DE ? EN LA URL

    const paginatedJobs = await JobModel.getAll({text,title,level,limit,technology,offset});

    return res.json({
      total: filteredJobs.length,
      limit: limitNumber,
      offset: offsetNumber,
      data: paginatedJobs,
    });
  }

  static async getById(req, res) {
    const { id } = req.params; // PARAMS SIEMPRE VIENEN EN EL PATH DE LA URL

    const job = jobs.find((job) => job.id === id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.json(job);
  }

  static async create(req, res) { }

  static async update(req, res) {
    const { id } = req.params;
    return res.json({ message: "Job updated with ID " + id });
  }

  static async partialUpdate(req, res) {
    const { id } = req.params;
    return res.json({ message: "Job partially updated with ID " + id });
  }

  static async delete(req, res) {
    const { id } = req.params;
    return res.json({ message: "Job deleted with ID " + id })
  }
}