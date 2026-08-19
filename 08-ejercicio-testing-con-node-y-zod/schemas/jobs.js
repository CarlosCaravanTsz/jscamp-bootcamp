import * as z from 'zod'

const dataSchema = z.object({
  technology: z.array(z.string()),
  modalidad: z.string().optional(),
  nivel: z.string().optional()
})

const contentSchema = z.object({
  description: z.string(),
  responsibilities: z.string(),
  requirements: z.string(),
  about: z.string()
})

const jobSchema = z.object({
  titulo: z.string({ required_error: "El titulo es obligatorio" }).min(3,"El titulo debe tener al menos 3 caracteres").max(100,"El titulo no debe exceder los 100 caracteres"),
  empresa: z.string({ required_error: "La empresa es obligatoria" }),
  ubicacion: z.string({ required_error: "La ubicacion es obligatoria" }),
  descripcion: z.string().optional(),
  content: contentSchema.optional(),
  data: dataSchema
})

const partialJobSchema = jobSchema.partial().extend({
  data: dataSchema.partial().optional()
})

export function validateJob(input) {
  return jobSchema.safeParse(input)
}

export function validatePartialJob(input) {
  return partialJobSchema.safeParse(input)
}