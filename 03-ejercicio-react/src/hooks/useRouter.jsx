// hooks/useRouter.js
import { useState, useEffect, useCallback } from "react";
export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);
  const navigateTo = useCallback((path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  },[]);
  const goBack = () => {
    window.history.back();
  };
  const goForward = () => {
    window.history.forward();
  };
  // Helper para verificar si estamos en una ruta específica
  const isActive = (path) => currentPath === path;
  // Helper para obtener parámetros de query string
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  };
  return {
    currentPath,
    navigateTo,
    goBack,
    goForward,
    isActive,
    queryParams: getQueryParams(),
  };
}
