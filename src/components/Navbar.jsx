// /client/src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaChevronDown } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Cargar usuario del sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">MODA</div>
        <span className="navbar__title">STOCK</span>
      </div>

      <div className="navbar__links">
        <Link
          to="/"
          className={`navbar__link ${
            location.pathname === "/" ? "active" : ""
          }`}
        >
          Inicio
        </Link>

        {!usuario && (
          <Link
            to="/login"
            className={`navbar__link ${
              location.pathname === "/login" ? "active" : ""
            }`}
          >
            Login
          </Link>
        )}

        {usuario && (
          <div className="navbar__user">
            <button
              type="button"
              className="navbar__username"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              {usuario.primer_nombre} {usuario.primer_apellido} <FaChevronDown />
            </button>
            {dropdownOpen && (
              <div className="navbar__dropdown" role="menu">
                <button role="menuitem" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
