import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAPI } from "./useAPI.jsx";

const RESULTS_PER_PAGE = 4;

const getInitialFilters = (params) => {
  return {
    technology: params.get("technology") || "",
    location: params.get("type") || "",
    experience: params.get("level") || "",
  };
};

const getInitialText = (params) => {
  return params.get("text") || "";
};

const getInitialCurrentPage = (params) => {
  const page = Number(params.get("page")) || 1;
  return isNaN(page) ? 1 : Math.max(1, page);
};

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => getInitialFilters(searchParams));
  const [textToFilter, setTextToFilter] = useState(() =>
    getInitialText(searchParams),
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getInitialCurrentPage(searchParams),
  );

  useEffect(() => {
    setSearchParams(() => {
      const urlParams = new URLSearchParams();

      if (textToFilter) urlParams.append("text", textToFilter);
      if (filters.technology)
        urlParams.append("technology", filters.technology);
      if (filters.location) urlParams.append("modalidad", filters.location);
      if (filters.experience) urlParams.append("level", filters.experience);
      if (currentPage > 1) {
        urlParams.append("page", currentPage);
        const offset = (currentPage - 1) * RESULTS_PER_PAGE;
        urlParams.append("limit", RESULTS_PER_PAGE);
        urlParams.append("offset", offset);
      }
      return urlParams.toString() || ''
    });
  }, [currentPage, filters, textToFilter, setSearchParams]);

  const { loading, error, data } = useAPI({ searchParams });
  const { data: jobs = [], total = 0 } = data;
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

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
    loading,
    jobs,
    total,
    error,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter,
  };
};
