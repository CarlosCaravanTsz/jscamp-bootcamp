import { useRef } from "react";


export function useSearchForm(
  technologyId,
  locationId,
  experienceId,
  textId,
  onSearch,
  onTextFilter,
) {
  let timeoutRef = useRef(null);
  let inputRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.name === textId) {
      const text = e.target.value;
    ////  setSearchText(text); // actualizamos el input inmediatamente

      // DEBOUNCE: cancelar el timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onTextFilter(text);
      }, 500);
      return; // terminamos la fcn
    }

    // event.target = elemento que recibe el evento
    // event.currentTarget = elemento que esta escuchando el evento (al que se le agrega onChange)
    const formData = new FormData(e.currentTarget); // OBTEN LA DATA DEL FORM

    const filters = {
      technology: formData.get(technologyId),
      location: formData.get(locationId),
      experience: formData.get(experienceId),
    };
    onSearch(filters);
  };

  return {
    handleSubmit,
    inputRef,
  };
}
