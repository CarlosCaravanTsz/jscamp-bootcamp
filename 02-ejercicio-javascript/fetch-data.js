/* Aquí va la lógica para mostrar los resultados de búsqueda */

const jobListingSection = document.querySelector(".jobs-listings");

fetch("./data.json")
  .then((response) => response.json())
  .then((jobs) => {
    /*
    Hacer un forEach para agregar elementos al DOM se puede traducir en hacer un repintado por cada elemento que iteramos.
    Esto si bien no es un problema con pocos elementos, si puede ser costoso en rendimiento cuando tenemos muchos.
    Una técnica es usar `createDocumentFragment`.
    Supongamos que tenemos una caja de chocolates que tenemos que colocar en una góndola del supermercado:
    Usar `createDocumentFragment` vendría a ser la caja, los chocolates cada elemento `li` y el llevarlo a la góndola (poner la caja ahí) es ejecutar `jobListingSection.appendChild(documentFragment);`. Que se traduce como: llevar la caja con chocolates al estante.

    Si no usamos `createDocumentFragment`, lo que estaríamos haciendo es agarrar cada chocolate individualmente y llevarlo a la góndola uno por uno.

    En vez de repintar el DOM por cada `li`, lo que hacemos es crearnos una caja virtual en donde vamos a colocar todos los `li`, y cuando tengamos toda esa estructura pronta, la agregamos a `jobListingSection` pintando una única vez.
    */
    const documentFragment = document.createDocumentFragment()

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

      documentFragment.appendChild(li)
    });

    jobListingSection.appendChild(documentFragment);
  });
