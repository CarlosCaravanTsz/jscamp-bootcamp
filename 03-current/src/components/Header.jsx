import { Link } from "./Link";
import { NavLink } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useFavoritesStore } from "../store/favoritesStore";

export function Header() {

  const favorites = useFavoritesStore((state) => state.favorites.length);
  const reset = useFavoritesStore((state) => state.reset);
  const { isLoggedIn, logout, login } = useAuthStore()

  const handleLogout = () => {
    logout()
    reset();
  }

  return (
    <header>
      <div className="logo-right">
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1>
            <svg
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
        </Link>
      </div>

      <div className="rest-navbar">
        <nav>
          <NavLink
            to="/search"
            className={(isActive) => (isActive ? "nav-link-active" : "")}
          >
            Empleos
          </NavLink>
          {isLoggedIn && (
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link-active" : "")}
              to="/profile"
            >
              Profile: (❤️ {favorites})
            </NavLink>
          )}
        </nav>

        {isLoggedIn ? (
          <button className="login-logout" onClick={handleLogout}>
            Cerrar Sesion
          </button>
        ) : (
          <button onClick={login}>Iniciar Sesion</button>
        )}

        <a href="#" aria-label="Ir a mi perfil" title="Mi perfil">
          <img
            src="https://unavatar.io/github/CarlosCaravanTsz"
            alt="Avatar del usuario"
            width="32"
            height="32"
          />
        </a>
      </div>
    </header>
  );
}
