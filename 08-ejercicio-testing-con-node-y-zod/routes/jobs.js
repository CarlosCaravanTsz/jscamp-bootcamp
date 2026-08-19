import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateCreate, validateUpdate } from '../middlewares/validateSchema.js'

export const jobsRouter = Router()

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)
jobsRouter.post("/", validateCreate, JobController.create);
// PUT reemplaza todos los campos, por eso validamos el job completo (validateCreate) y no el parcial
jobsRouter.put('/:id', validateCreate, JobController.update)
jobsRouter.patch("/:id", validateUpdate, JobController.partialUpdate);
jobsRouter.delete('/:id', JobController.delete)
