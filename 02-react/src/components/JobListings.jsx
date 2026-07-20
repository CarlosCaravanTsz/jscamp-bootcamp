import { JobCard } from "./JobCard";

export function JobListings({jobs}) {

  return (
    <>
      <h2>Resultados de búsqueda</h2>
      <ul className="jobs-listings">
        {jobs.length === 0 ? (
          <p>No hay trabajos disponibles</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </ul>
    </>
  );
}

