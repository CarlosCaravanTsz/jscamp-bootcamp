
import type {JobDB, JobAPI} from '../types.ts'

export const mapperJob = (jobs: JobDB[]): JobAPI[] => {

  return jobs.map(job => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    data: {
      modality: job.modality,
      level: job.level,
      technology: job.technologies.split(',')
    },
    content: {
      description: job.description_ext,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      about: job.about
    }


  }))

}