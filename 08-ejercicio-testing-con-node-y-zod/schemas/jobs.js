import * as z from 'zod'

const jobSchema = z.object({
  titulo: z.string({ required_error: "El titulo es obligatorio" }).min(3,"El titulo debe tener al menos 3 caracteres").max(100,"El titulo no debe exceder los 100 caracteres"),
  empresa: z.string({ required_error: "La empresa es obligatoria" }),
  ubicacion: z.string({ required_error: "La ubicacion es obligatoria" }),
  data: z.object({
    technology: z.array(z.string()),
    modalidad: z.string().optional(),
    nivel: z.string().optional()
  })
})



export function validateJob(input) {
  return jobSchema.safeParse(input)
}

export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input)
}