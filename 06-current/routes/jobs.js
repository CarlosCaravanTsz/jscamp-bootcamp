import { Router } from 'express'
import {JobController} from '../controllers/jobs.js'

import { validateJob, validatePartialJob } from '../schemas/jobs.js'
const jobsRouter = Router()


const validateCreate = (req, res, next) => {
  const result = validateJob(req.body)
  if (result.success) {
    req.body = result.data // si hay transfors, retorna el objeto transformado y validado
    return next()
  }
  return res.status(400).json({error: 'Invalid requesttttttt', details: result.error.errors})
}

const validateUpdate = (req, res, next) => {
  const result = validatePartialJob(req.body);
  if (result.success) {
    req.body = result.data; // si hay transfors, retorna el objeto transformado y validado
    return next();
  }
  return res
    .status(400)
    .json({ error: `Invalid requestttt`, details: result.error.errors });
};

jobsRouter.get("/", JobController.getAll)

jobsRouter.get("/:id", JobController.getById);

jobsRouter.post("/", validateCreate,JobController.create)

jobsRouter.put("/:id", validateUpdate, JobController.update)

jobsRouter.patch("/:id", validateUpdate, JobController.partialUpdate)

jobsRouter.delete("/:id", JobController.delete);

export { jobsRouter };
