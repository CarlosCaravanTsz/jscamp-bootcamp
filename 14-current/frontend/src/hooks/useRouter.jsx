import { useCallback } from "react";
import { useLocation, useNavigate } from 'react-router';

export function useRouter() {
  const navigate = useNavigate(); // funcion para navegar
  const location = useLocation(); // localizacion actual de la url: path, query params, etc

  const navigateTo = useCallback((path) => {
    navigate(path);
  }, [navigate]); 


  return {
    currentPath: location.pathname,
    navigateTo,
  };
}
