/* Aquí va la lógica para mostrar los resultados de búsqueda */

const jobListingSection = document.querySelector(".jobs-listings");

fetch("./data.json")
  .then((response) => response.json())
  .then((jobs) => {
    jobs.forEach((job) => {
      const li = document.createElement("li");
      const article = document.createElement("article");
      article.classList.add("job-listing-card");
      
      article.setAttribute("data-modalidad", job.data.modalidad);
      article.setAttribute("data-tech", job.data.technology);
      article.setAttribute("data-nivel", job.data.nivel);
      
      li.appendChild(article);
      
      article.innerHTML = `
          <div>
            <h3>${job.titulo}</h3>
            <small>${job.empresa} | ${job.ubicacion}</small>
            <p>${job.descripcion}</p>
          </div>
          <button class="button-apply-job">Aplicar</button>
        `;
      jobListingSection.appendChild(li);
    });
  });
