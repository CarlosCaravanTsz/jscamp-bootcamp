import type { Job } from "./objects.ts"

// Tupla para coordenadas de ubicación
export type Coordinates = [latitud: number, longitud: number] // [latitud, longitud]

// Tupla para rango de salario
export type SalaryRange = [min: number, max: number] // [mínimo, máximo]

// Función que devuelve el rango de salarios
export function getSalaryRange(jobs: Job[]): SalaryRange {
  const salaries: number[] = jobs.filter((job) => job.salary !== undefined).map((job) => job.salary as number)

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}
