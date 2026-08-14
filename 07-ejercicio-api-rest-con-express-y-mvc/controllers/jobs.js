import { JobModel } from "../models/jobs.js";

export class JobController {
  static async getAll(req, res) {
    const { text, limit, offset, technology, modalidad, level, ubicacion } =
      req.query;
    const results = await JobModel.getAll({
      text,
      limit,
      offset,
      technology,
      modalidad,
      level,
      ubicacion,
    });
    if (results.length === 0) return res.status(404).json({ message: "No jobs found" });
    return res.status(200).json(results);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const queriedJob = JobModel.getById(id);
    if (!queriedJob) return res.status(404).json({ error: "Job not found" });
    return res
      .status(200)
      .json({ message: `Job with id ${id}`, job: queriedJob });
  }

  static async create(req, res) {
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;

    const hasMissingFields = Object.entries({
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content,
      }).some(([_, value]) => value === undefined)

    // Podemos pasar la validación a una variable para que sea más fácil de leer/entender el contenido del `if`. Siempre que hayan condicionales largos o complejos, es mejor pasarlo a una variable: así se hace fácil la lectura del if. Si luego queremos ver como se hace la condición, iremos a la variable, pero de primeras se ve mucho más claro.
    if (hasMissingFields)
      return res.status(422).json({ message: "Missing required fields" });
    const newJob = await JobModel.create({
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    });
    return res
      .status(201)
      .json({ message: "Successfully new job created", job: newJob });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;
    if (
      Object.entries({
        titulo,
        empresa,
        ubicacion,
        descripcion,
        data,
        content,
      }).some(([_, value]) => value === undefined) // Podemos hacer lo mismo aquí
    )
      return res.status(422).json({ message: "Missing required fields" });
    
    const updatedJob = await JobModel.update(id, {
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    return res
      .status(200)
      .json({ message: `Job with id ${id} fully updated`, job: updatedJob });
  }

  static async partialUpdate(req, res) {
    const { id } = req.params;
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body;
    const updatedJob = await JobModel.partialUpdate(id, {
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    return res
      .status(200)
      .json({
        message: `Job with id ${id} partially updated`,
        job: updatedJob,
      });
  }

  static async delete(req, res) {
    const { id } = req.params;
    const deletedJob = await JobModel.delete(id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    return res
      .status(200)
      .json({ message: "Job deleted with ID " + id, job: deletedJob });
  }
}
