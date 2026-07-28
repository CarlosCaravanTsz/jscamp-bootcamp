import { useState , useEffect} from "react";
import { useAPI } from "../hooks/useAPI";
import { useSearchParams } from "react-router";

const RESULTS_PER_PAGE = 10;

export function useFilters() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => {
    return {
      technology: searchParams.get('technology') || '',
      location: searchParams.get('type') || '',
      experience: searchParams.get('level') || '',
    }
  })
    const [textToFilter, setTextToFilter] = useState(
      () => searchParams.get("text") || "",
    );
    const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(searchParams.get("page")) || 1;
    return Number.isNaN(page) ? 1 : page
  });

  
  useEffect(() => {
    setSearchParams(params => {
      params.delete("text");
      params.delete("technology");
      params.delete("type");
      params.delete("level");
      params.delete("page");
      params.delete("limit");
      params.delete("offset");

      if (textToFilter) params.set("text", textToFilter);
      if (filters.technology) params.set("technology", filters.technology);
      if (filters.location) params.set("type", filters.location);
      if (filters.experience) params.set("level", filters.experience);
      if (currentPage > 1) {
        params.set("page", currentPage);
        params.set('limit', RESULTS_PER_PAGE)
        params.set('offset', (currentPage - 1) * RESULTS_PER_PAGE)
      }
      return params
    })
  }, [textToFilter, filters, currentPage, setSearchParams]);

  const { loading, error, data } = useAPI({ searchParams });
  const { data: jobs = [], total = 0 } = data

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);


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

return {
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
};
}
