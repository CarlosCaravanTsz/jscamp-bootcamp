// ================================
// TIPOS PARA LA API EXPRESS
// ================================

// ================================
// ENTIDADES
// ================================

enum Modality {
  remote = 'remote',
  onsite = 'onsite',
  hybrid = 'hybrid'
}

enum Level {
  junior = 'junior',
  mid = 'mid',
  senior = 'senior'
}


export interface JobDB {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: Modality
  level: Level
  technologies: string
  description_ext: string
  responsibilities: string
  requirements: string
  about: string
}

export interface JobData {
  
  technology: string[]
  modality: JobDB["modality"]
  level: JobDB["level"]
}

export interface JobContent {
  description: string
  responsibilities: string
  requirements: string
  about: string
}

export interface JobAPI extends Pick<JobDB, "id" | "title" | "company" | "location" | "description"> {
  data: JobData
  content?: JobContent
}



// ================================
// DTOs
// ================================

// Para crear - sin id
export type CreateJobDTO = Omit<JobAPI, 'id'>

// Para actualizar - todo opcional
export type UpdateJobDTO = Partial<CreateJobDTO>

// ================================
// FILTROS
// ================================

export interface JobFilters {
  technology?: string
  modality?: JobData['modality']
  level?: JobData['level']
  limit?: string
  offset?: string
}

// ================================
// RESPUESTAS DE API
// ================================

export interface ApiError {
  message: string
  errors?: unknown[]
}
