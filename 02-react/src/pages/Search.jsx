import { Pagination } from "../components/Pagination";
import { SearchFormSection } from "../components/SearchFormSection";
import { JobListings } from "../components/JobListings";
import { useState } from "react";
import jobsData from "../data.json";

const RESULT_PER_PAGE = 5;

export function SearchPage() {
  const [filters, setFilters] = useState({
    technology: "",
    location: "",
    experience: "",
  });

  const [textToFilter, setTextToFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // PRIMERO FILTRADO DE FILTROS

  const jobFilteredByFilters = jobsData.filter((job) => {
    return (
      (filters.technology === "") |
        job.data.technology.includes(filters.technology) &&
      (filters.location === "" || job.data.modalidad === filters.location) &&
      (filters.experience === "" || job.data.nivel === filters.experience)
    );
  });

  // LUEGO FILTRADO POR TEXTO INPUT SEARCH

  const jobsWithTextFilter =
    textToFilter === ""
      ? jobFilteredByFilters
      : jobFilteredByFilters.filter((job) => {
          return job.titulo.toLowerCase().includes(textToFilter.toLowerCase());
        });

  // LUEGO PAGINADO
  const totalPages = Math.ceil(jobsWithTextFilter.length / RESULT_PER_PAGE);

  const pagedResults = jobsWithTextFilter.slice(
    (currentPage - 1) * RESULT_PER_PAGE,
    currentPage * RESULT_PER_PAGE,
  );

  /// FUNCIONES HANDLERS PARA ACTUALIZAR ESTADO
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (filters) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter);
    setCurrentPage(1);
  };

  return (
      <main>
        <SearchFormSection
          onSearch={handleSearch}
          onTextFilter={handleTextFilter}
        />

        <section className="jobs-result">
          <JobListings jobs={pagedResults} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>
  );
}
