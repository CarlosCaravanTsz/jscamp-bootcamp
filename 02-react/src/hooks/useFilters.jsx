import { useState , useEffect} from "react";
import { useAPI } from "../hooks/useAPI";
import { useRouter } from "../hooks/useRouter";

const RESULTS_PER_PAGE = 10;

export function useFilters() {

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      technology: params.get('technology') || '',
      location: params.get('type') || '',
      experience: params.get('level') || '',
    }
  })
    
    const [textToFilter, setTextToFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('text') || ''
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get('page')) || 1
    return Number.isNaN(page) ? 1 : page
  });
  const {navigateTo} = useRouter();

    const params = new URLSearchParams();

    if (textToFilter) params.append("text", textToFilter);
    if (filters.technology) params.append("technology", filters.technology);
    if (filters.location) params.append("type", filters.location);
    if (filters.experience) params.append("level", filters.experience);

    if (currentPage > 1) {
      params.append("page", currentPage);
      const offset = (currentPage - 1) * RESULTS_PER_PAGE;
      params.append('limit', RESULTS_PER_PAGE)
      params.append('offset',offset)
    }
      const pathToNavigate = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
    const queryParams = params.toString() || ''
  
  useEffect(() => {
    navigateTo(pathToNavigate);
  }, [pathToNavigate, navigateTo]);

  const { loading, error, data } = useAPI({ queryParams });
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
