import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateCreate, validateUpdate } from '../middlewares/validateSchema.js'

export const jobsRouter = Router()

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)
jobsRouter.post("/", validateCreate, JobController.create);
jobsRouter.put('/:id', validateUpdate, JobController.update)
jobsRouter.patch("/:id", validateUpdate, JobController.partialUpdate);
jobsRouter.delete('/:id', JobController.delete)
