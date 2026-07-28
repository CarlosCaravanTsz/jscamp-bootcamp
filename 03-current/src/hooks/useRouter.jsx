import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
export function useRouter() {
  const navigate = useNavigate(); // funcion para navegar
  const location = useLocation(); // localizacion actual de la url: path, query params, etc

  const navigateTo = useCallback((path) => {
    navigate(path);
  }, []);

  const goBack = useCallback(() => {
    navigate(-1)
  },[])

  return {
    currentPath: location.pathname,
    navigateTo,
  };
}
