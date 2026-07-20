import styles from './Pagination.module.css'

export function Pagination({ currentPage = 1, totalPages = 10, onPageChange }) {

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const handlePrevClick = (e) => {
    e.preventDefault();
    if (!isFirstPage) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextClick = (e) => {
    e.preventDefault();

    if (!isLastPage) {
      onPageChange(currentPage + 1)
    }
  }

  const handleChangePage = (event, page) => {
    event.preventDefault();
    if (page !== currentPage) {
      onPageChange(page)
    }
  }


  return (
    <nav className={styles.pagination}>
      {!isFirstPage && (
        <a
          href="#"
          onClick={handlePrevClick}
          aria-label="Ir a la página anterior de los resultados de búsqueda"
          title="Página anterior"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </a>
      )}
      {pages.map((page) => (
        <a key={page}
          onClick={(event) => handleChangePage(event, page)}
          href="#"
          className={currentPage === page ? styles.isActive : ""}
        >
          {page}
        </a>
      ))}
      {!isLastPage && (
        <a
          href="#"
          onClick={handleNextClick}
          aria-label="Ir a la página siguiente de los resultados de búsqueda"
          title="Página siguiente"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </a>
      )}
    </nav>
  );
}
