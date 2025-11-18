/* Aquí va la lógica para filtrar los resultados de búsqueda */

const filter_ubicacion = document.getElementById("filter-location");
const filter_experiencia = document.getElementById("filter-experience-level");
const search_input = document.getElementById("empleos-search-input");
const filter_tech = document.getElementById("filter-technology");


// BUSQUEDA FILTRO UBICACION MANTENIENDO LOS OTROS 2 FILTROS
filter_ubicacion?.addEventListener("change", () => {
  const jobs = document.querySelectorAll(".job-listing-card");
  const ubicacion_value = filter_ubicacion.value;

  // Actualizar los valores de los otros filtros
  const filter_experiencia_updated = document.getElementById("filter-experience-level");
  const filter_tech_updated = document.getElementById("filter-technology");
  const search_input_updated = document.getElementById("empleos-search-input");

  const experiencia_value = filter_experiencia_updated.value;
  const tech_value = filter_tech_updated.value;
  const query = search_input_updated.value.toLowerCase();

  if (!experiencia_value && !tech_value && !query) {
    jobs.forEach((job) => {
      const modalidad = job.getAttribute("data-modalidad");
      const isShown = ubicacion_value == "" || ubicacion_value === modalidad;
      job.classList.toggle("is-hidden", !isShown);
    });
  } else {
    jobs.forEach((job) => {
      const modalidad = job.getAttribute("data-modalidad");
      const nivel = job.getAttribute("data-nivel");
      const tech = job.getAttribute("data-tech");
      const title = job
        .querySelector("h3")
        .textContent.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const isShown =
        (ubicacion_value == "" || ubicacion_value === modalidad) &&
        (experiencia_value == "" || experiencia_value === nivel) && (tech_value == "" || tech.includes(tech_value)) && (query == "" || title.includes(query));
      job.classList.toggle("is-hidden", !isShown);
    });
  }

});


// BUSQUEDA FILTRO EXPERIENCIA MANTENIENDO LOS OTROS 2 FILTROS
filter_experiencia?.addEventListener("change", () => {
  const jobs = document.querySelectorAll(".job-listing-card");
  const experiencia_value = filter_experiencia.value;

  const filter_ubicacion_updated = document.getElementById("filter-location");
  const filter_tech_updated = document.getElementById("filter-technology");
  const search_input_updated = document.getElementById("empleos-search-input");
  
  const ubicacion_value = filter_ubicacion_updated.value;
  const tech_value = filter_tech_updated.value;
  const query = search_input_updated.value.toLowerCase();

  if (!ubicacion_value && !tech_value && !query) {
    jobs.forEach((job) => {
      const nivel = job.getAttribute("data-nivel");
      const isShown =
        (experiencia_value == "" || experiencia_value === nivel);
      job.classList.toggle("is-hidden", !isShown);
    });
  } else {
    jobs.forEach((job) => {
      const nivel = job.getAttribute("data-nivel");
      const modalidad = job.getAttribute("data-modalidad");
      const tech = job.getAttribute("data-tech");
      const title = job
        .querySelector("h3")
        .textContent.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const isShown =
        (ubicacion_value == "" || ubicacion_value === modalidad) &&
        (experiencia_value == "" || experiencia_value === nivel) && (tech_value == "" || tech.includes(tech_value)) && (query == "" || title.includes(query));
      job.classList.toggle("is-hidden", !isShown);
    });
  }
});


// BUSQUEDA POR TITULO CON search input
search_input.addEventListener("input", () => {
  const query = search_input.value.toLowerCase();
  const jobs = document.querySelectorAll(".job-listing-card");

  const filter_ubicacion_updated = document.getElementById("filter-location");
  const filter_tech_updated = document.getElementById("filter-technology");
  const filter_experiencia_updated = document.getElementById("filter-experience-level");

  // SERIA BUENA IDEA RESETEAR LOS FILTROS SEARCH CUANDO ESCRIBE EN EL INPUT?
  // O APLICAR TAMBIEN EL FILTRADO DE LOS OTROS 3 FILTROS MIENTRAS ESCRIBE?
  filter_ubicacion_updated.value = ""
  filter_tech_updated.value = ""
  filter_experiencia_updated.value = ""


  jobs.forEach(job => {

    const title = job
      .querySelector("h3")
      .textContent.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const isShown = query == "" || title.includes(query)
    job.classList.toggle('is-hidden', !isShown)
    
  })

});



// BUSQUEDA FILTRO TECH MANTENIENDO LOS OTROS 3 FILTROS
filter_tech.addEventListener('change', () => {
  const tech_value = filter_tech.value.toLowerCase();
  const jobs = document.querySelectorAll(".job-listing-card");

  const filter_experiencia_updated = document.getElementById("filter-experience-level");
  const filter_ubicacion_updated = document.getElementById("filter-location");
  const search_input_updated = document.getElementById("empleos-search-input");

  const experiencia_value = filter_experiencia_updated.value;
  const ubicacion_value = filter_ubicacion_updated.value;
  const query = search_input_updated.value.toLowerCase();


  if (!ubicacion_value && !experiencia_value && !query) {
    jobs.forEach(job => {
      const tech = job.getAttribute("data-tech")
      const isShown = tech_value == '' || tech.includes(tech_value)
      job.classList.toggle('is-hidden', !isShown)
    })

  } else {
    jobs.forEach(job => {
      const tech = job.getAttribute("data-tech")
      const nivel = job.getAttribute("data-nivel");
      const modalidad = job.getAttribute("data-modalidad");
      const title = job
        .querySelector("h3")
        .textContent.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const isShown =
        (ubicacion_value == "" || ubicacion_value === modalidad) &&
        (experiencia_value == "" || experiencia_value === nivel) && (tech_value == "" || tech.includes(tech_value)) && (query == "" || title.includes(query));
      job.classList.toggle("is-hidden", !isShown);
    });
  }
});