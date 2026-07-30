import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import styles from "./Detail.module.css";
import { Link } from "../components/Link";
import snarkdown from "snarkdown";
import { useFavoritesStore } from "../store/favoritesStore";
import { useAuthStore } from "../store/authStore";

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

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isFavorite = useFavoritesStore((state) => state.isFavorite(jobId));
  const toggleFavorite   = useFavoritesStore( (state) => state.toggleFavorite)


  useEffect(() => {
    setLoading(true);
    fetch(`https://jscamp-api.vercel.app/api/jobs/${jobId}`)
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
          <span className={styles.breadcrumbCurrent}>{job.titulo}</span>
        </nav>
      </div>
      <header className={styles.header}>
        <h1 className={styles.title}>{job.titulo}</h1>
        <p className={styles.meta}>
          {job.empresa} · {job.ubicacion}{" "}
        </p>
      </header>
      <button className={styles.applyButton}>Aplicar ahora</button>
      <button onClick={() => toggleFavorite(jobId)} disabled={!isLoggedIn}>
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <JobSection
        title="Descripcion del puesto"
        contenido={job.content.description}
      />
      <JobSection
        title="Responsabilidades"
        contenido={job.content.responsibilities}
      />
      <JobSection title="Requisitos" contenido={job.content.requirements} />
      <JobSection title="Acerca de la empresa" contenido={job.content.about} />
    </div>
  );
}
