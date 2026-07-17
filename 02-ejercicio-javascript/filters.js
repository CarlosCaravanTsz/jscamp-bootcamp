/* Aquí va la lógica para filtrar los resultados de búsqueda */

/* En JavaScript se recomienda por estándar usar camelCase y no snake_case. Cambie solo estos por practicidad, pero verás que en todos lados se utiliza así  */
const filterUbicacion = document.getElementById("filter-location");
const filterExperiencia = document.getElementById("filter-experience-level");
const searchInput = document.getElementById("empleos-search-input");
const filterTech = document.getElementById("filter-technology");


/* Si la lógica es la misma, podemos simplificarlo en una sola función y reutilizarla */
const handleSearchByFilter = () => {
  const jobs = document.querySelectorAll(".job-listing-card");
  const ubicacion_value = filterUbicacion.value;

  // Actualizar los valores de los otros filtros
  /* Si ya guardamos las referencias antes, no hace falta volverlas a guardar en otro puntero */
  /* const filter_experiencia_updated = document.getElementById("filter-experience-level");
  const filter_tech_updated = document.getElementById("filter-technology");
  const search_input_updated = document.getElementById("empleos-search-input"); */

  const experiencia_value = filterExperiencia.value;
  const tech_value = filterTech.value;
  const query = searchInput.value.toLowerCase();

  if (!experiencia_value && !tech_value && !query)
    // Podemos agregar un `return` y nos olvidamos de un `if/else`, queda mas claro
    return jobs.forEach((job) => {
      const modalidad = job.getAttribute("data-modalidad");
      const isShown = ubicacion_value == "" || ubicacion_value === modalidad;
      job.classList.toggle("is-hidden", !isShown);
    });

  jobs.forEach((job) => {
    const modalidad = job.getAttribute("data-modalidad");
    const nivel = job.getAttribute("data-nivel");
    const tech = job.getAttribute("data-tech");
    const title = normalizeTitleByJob(job)

    // no queda tan claro de leer, podemos separar las validaciones por variables
    const isValidLocation = ubicacion_value == "" || ubicacion_value === modalidad
    const isValidExperience = experiencia_value == "" || experiencia_value === nivel
    const isValidTech = tech_value == "" || tech.includes(tech_value)
    const isValidQuery = query == "" || title.includes(query)

    const isShown = isValidLocation && isValidExperience && isValidTech && isValidQuery;
    job.classList.toggle("is-hidden", !isShown);
  });
}

/* Como lo utilizamos en dos sitios, lo podemos pasar a una función */
const normalizeTitleByJob = (job) => {
  return job
  .querySelector("h3")
  .textContent.toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");
}

// BUSQUEDA FILTRO UBICACION MANTENIENDO LOS OTROS 2 FILTROS
filterUbicacion?.addEventListener("change", handleSearchByFilter);
// BUSQUEDA FILTRO EXPERIENCIA MANTENIENDO LOS OTROS 2 FILTROS
filterExperiencia?.addEventListener("change", handleSearchByFilter);
// BUSQUEDA FILTRO TECH MANTENIENDO LOS OTROS 3 FILTROS
filterTech.addEventListener('change', handleSearchByFilter);

// BUSQUEDA POR TITULO CON search input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const jobs = document.querySelectorAll(".job-listing-card");

  /* const filter_ubicacion_updated = document.getElementById("filter-location");
  const filter_tech_updated = document.getElementById("filter-technology");
  const filter_experiencia_updated = document.getElementById("filter-experience-level"); */

  // SERIA BUENA IDEA RESETEAR LOS FILTROS SEARCH CUANDO ESCRIBE EN EL INPUT?
  // O APLICAR TAMBIEN EL FILTRADO DE LOS OTROS 3 FILTROS MIENTRAS ESCRIBE?
  filterUbicacion.value = ""
  filterTech.value = ""
  filterExperiencia.value = ""


  jobs.forEach(job => {
    const title = normalizeTitleByJob(job)
    const isShown = query == "" || title.includes(query)
    job.classList.toggle('is-hidden', !isShown)
    
  })
});
