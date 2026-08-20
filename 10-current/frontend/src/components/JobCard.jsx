import { useState } from 'react'
import { Link } from './Link'
import styles from "./JobCard.module.css";
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';


export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <Link href={`/job/${job.id}`} className={styles.title}>
          <h3>{job.titulo}</h3>
        </Link>
        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <button className={buttonClasses} onClick={handleApplyClick}>
        {buttonText}
      </button>
      <button onClick={() => toggleFavorite(job.id)} disabled={!isLoggedIn}>
        {isFavorite(job.id) ? "❤️" : "🤍"}
      </button>
    </article>
  );
}

