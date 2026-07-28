import { useState } from "react";
import { Link } from "./Link";
import styles from "./JobCard.module.css";
import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";

export function JobCard({ job }) {

  const [isApplied, setIsApplied] = useState(false);
  const { isLoggedIn } = useAuthStore()
  const {toggleFavorite, isFavorite} = useFavoritesStore()

  const handleApplyClick = () => {
    setIsApplied(!isApplied);
  };

  const buttonClasses = !isLoggedIn ? 'button-apply-job is-logout' : isApplied ? "button-apply-job is-applied" : "button-apply-job"; 
  const buttonText = isApplied ? 'Aplicado!' : 'Aplicar'
  
  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <Link className={styles.title} href={`/jobs/${job.id}`}>
          <h3>{job.titulo}</h3>
        </Link>

        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <div className={styles.actions}>
        <Link href={`/jobs/${job.id}`} className={styles.details}>
          Ver detalles
        </Link>
        <button onClick={handleApplyClick} className={buttonClasses}>
          {buttonText}
        </button>
        <button onClick={() => toggleFavorite(job.id)} disabled={!isLoggedIn} >
          {isFavorite(job.id) ? "❤️" : "🤍"}
        </button>
      </div>
    </article>
  );
}
