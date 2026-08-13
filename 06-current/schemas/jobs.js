import * as z from "zod";

const jobSchema = z.object({
  titulo: z
    .string({
      required_error: "El titulo es obligatorio",
    })
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(100, "El titulo no puede exceder los 100 caracteres"),
  empresa: z.string(), 
  ubicacion: z.string(),
  descripcion: z.string().optional(),
  data: z.object({
    technology: z.array(z.string()),
    modalidad: z.string(),
    nivel: z.string(),
  }),
});

export function validateJob(input) {
  return jobSchema.safeParse(input) // devuelve error controlado a diferencia de .parse que peta
}

export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input)
}
