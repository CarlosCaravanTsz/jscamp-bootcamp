import { JobModel } from "../models/jobs.js";

export class JobController {
  static async getAll(req, res) {
    const { text, title, level, limit, technology, offset } = req.query;

    const result = await JobModel.getAll({ text, title, level, limit, technology, offset });

    return res.json(result);
  }

  static async getById(req, res) {
    const { id } = req.params;

    const job = await JobModel.getById({ id });

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
    return res.json({ message: "Job deleted with ID " + id });
  }
}
