import { useId } from "react";
import { useSearchForm } from "../hooks/useSearchForm";


export function SearchFormSection({ onSearch, onTextFilter, textToFilter }) {
  const locationId = useId();
  const experienceId = useId();
  const technologyId = useId();
  const textId = useId();

  const { handleSubmit, inputRef } = useSearchForm(
    technologyId,
    locationId,
    experienceId,
    textId,
    onSearch,
    onTextFilter,
  );

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>
      <form onChange={handleSubmit} id="empleos-search-form" role="search">
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            name={textId}
            //value={textToFilter}
            id="empleos-search-input"
            placeholder="Buscar trabajos, empresas o habilidades"
            defaultValue={textToFilter}
            //onChange={handleSubmit}
          />
          {/* <button type="submit" style={{ position: "aboslute", right: "4px" }}>
            Buscar
          </button> */}
        </div>

        <div className="search-filters">
          {/* <label htmlFor={locationId}>Tecnologia</label> */}
          <select name={technologyId} id={technologyId}>
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <select name={locationId} id={locationId}>
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select name={experienceId} id={experienceId}>
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </form>
    </section>
  );
}
