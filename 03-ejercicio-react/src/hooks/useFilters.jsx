import { useEffect, useMemo, useState } from "react";
import { useAPI } from "../hooks/useAPI";
import { useRouter } from "../hooks/useRouter";

const RESULTS_PER_PAGE = 10;

const getInitialFilters = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    technology: params.get('technology') || '',
    location: params.get('type') || '',
    experience: params.get('level') || '',
  }
}

const getInitialText = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('text') || ''
}

const getInitialCurrentPage = () => {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('page')) || 1
  return Number.isNaN(page) ? 1 : Math.max(page, 1) 
}

export function useFilters() {
  const [filters, setFilters] = useState(getInitialFilters)
  const [textToFilter, setTextToFilter] = useState(getInitialText);
  const [currentPage, setCurrentPage] = useState(getInitialCurrentPage);

  const {navigateTo} = useRouter();

  const params = useMemo(() => {
    const urlParams = new URLSearchParams();

    if (textToFilter) urlParams.append("text", textToFilter);
    if (filters.technology) urlParams.append("technology", filters.technology);
    if (filters.location) urlParams.append("type", filters.location);
    if (filters.experience) urlParams.append("level", filters.experience);

    if (currentPage > 1) {
      urlParams.append("page", currentPage);
      const offset = (currentPage - 1) * RESULTS_PER_PAGE;
      urlParams.append('limit', RESULTS_PER_PAGE)
      urlParams.append('offset',offset)
    }
    
    return urlParams.toString() || ''
  }, [currentPage, filters, textToFilter])

  
  const pathToNavigate = params
    ? `${window.location.pathname}?${params}`
    : window.location.pathname;
  
  useEffect(() => {
    navigateTo(pathToNavigate);
  }, [pathToNavigate, navigateTo]);

  const { loading, error, data } = useAPI({ queryParams: params });
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
