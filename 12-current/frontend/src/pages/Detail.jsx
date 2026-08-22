import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./Detail.module.css";
import { Link } from "../components/Link";
import snarkdown from "snarkdown";
import { useFavoritesStore } from "../store/favoritesStore";
import { useAuthStore } from "../store/authStore";
import { useAISummary } from "../hooks/useAISummary";
import {Streamdown} from 'streamdown'

const API_URL = import.meta.env.VITE_API_URL;


function JobSection({ title, contenido }) {
  const html = snarkdown(contenido);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div
        className={`${styles.sectionContent} prose`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </section>
  );
}

function AISummary({ jobId }) {

  const { summary, loading, generateSummary } = useAISummary(jobId);

  if (summary) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Resumen generado por IA</h2>
        <div className={styles.sectionContent}>
          <Streamdown isAnimating={loading}>{summary}</Streamdown>
        </div>
      </section>
    )
  }

  return (
    <button onClick={generateSummary} disabled={loading} className={styles.applyButton}>
      {loading ? 'Generando resumen...' : 'Generar resumen con IA'}
    </button>
  )
}


export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApplied, setIsApplied] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(jobId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const buttonText = isApplied ? "Aplicado" : "Aplicar";
  const buttonClasses = isApplied
    ? "button-apply-job is-applied"
    : "button-apply-job";

  const handleApplyClick = () => {
    setIsApplied(true);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) {
          navigate("/not-found");
        }
        return res.json();
      })
      .then((json) => {
        setJob(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId, navigate]);

  if (loading) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div className={styles.loading}>
          <p className={styles.loadingText}>Cargando...</p>
        </div>
      </div>
    );
  }
  console.log(job)

  if (error || !job) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div className={styles.error}>
          <h2 className={styles.errorTitle}>Oferta no encontrada</h2>
          <button onClick={() => navigate("/")} className={styles.errorButton}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/search" className={styles.breadcrumbButton}>
            Empleos
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{job.job.titulo}</span>
        </nav>
      </div>
      <header className={styles.header}>
        <h1 className={styles.title}>{job.job.titulo}</h1>
        <p className={styles.meta}>
          {job.job.empresa} · {job.job.ubicacion}{" "}
        </p>
      </header>
      <button className={buttonClasses} onClick={handleApplyClick}>
        {buttonText}
      </button>
      <AISummary jobId={jobId} />
      <button onClick={() => toggleFavorite(jobId)} disabled={!isLoggedIn}>
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <JobSection
        title="Descripcion del puesto"
        contenido={job.job.content.description}
      />
      <JobSection
        title="Responsabilidades"
        contenido={job.job.content.responsibilities}
      />
      <JobSection title="Requisitos" contenido={job.job.content.requirements} />
      <JobSection title="Acerca de la empresa" contenido={job.job.content.about} />
    </div>
  );
}
