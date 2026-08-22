import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";
import { Link } from './Link'
import { NavLink } from 'react-router'

export function Header() {

  const auth = useAuthStore()
  const favoritesCount = useFavoritesStore((state) => state.getFavoritesCount());
  const reset = useFavoritesStore( (state) => state.reset )

  const handleAuth = () => {
    if (auth.isLoggedIn) {
      auth.logout()
      reset()
    }
    else auth.login()
  }

  return (
    <header>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          textDecoration: "none",
          color: isActive ? "dodgerblue" : "white",
        })}
      >
        <h1>
          <svg
            style={{ color: "inherit" }}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </NavLink>

      <nav>
        <p>{auth.isLoggedIn ? `Favoritos: ❤️ ${favoritesCount}` : ""}</p>
        <NavLink
          to="/search"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "dodgerblue" : "white",
          })}
        >
          Empleos
        </NavLink>
        <a href="/search">Sin SPA</a>
        <button onClick={handleAuth}>
          {auth.isLoggedIn ? "Cerrar Sesion" : "Iniciar Sesion"}
        </button>
      </nav>
    </header>
  );
}
