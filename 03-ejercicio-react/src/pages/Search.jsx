import { Pagination } from "../components/Pagination";
import { SearchFormSection } from "../components/SearchFormSection";
import { JobListings } from "../components/JobListings";
import { useFilters } from "../hooks/useFilters";


export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    error,
    totalPages,
    currentPage,
    handlePageChange,
    handleSearch,
    handleTextFilter,
    textToFilter,
  } = useFilters();

  const title = `Resultados: ${total}, Pagina ${currentPage} - DevJobs`


  return (
    <main>
      <title>{title}</title>
      <SearchFormSection
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
        textToFilter={textToFilter}
      />

      <section className="jobs-result">
        {loading && <p> Cargando empleos...</p>}
        {error && <p>Error al cargar empleos.</p>}
        <JobListings jobs={jobs} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </main>
  );
}
