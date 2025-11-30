// /client/src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { FaChevronDown } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // control unificado
  const [openMenu, setOpenMenu] = useState(null); // "admin" | "user" | null

  const adminRef = useRef(null);
  const userRef = useRef(null);

  // Cargar usuario
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        openMenu === "admin" &&
        adminRef.current &&
        !adminRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }

      if (
        openMenu === "user" &&
        userRef.current &&
        !userRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

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

        {/* ADMIN */}
        {usuario?.id_rol === 1 && (
          <div className="navbar__admin" ref={adminRef}>
            <button
              type="button"
              className="navbar__username"
              onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}
            >
              Administración <FaChevronDown />
            </button>

            {openMenu === "admin" && (
              <div className="navbar__dropdown">
                <Link to="/usuarios" className="navbar__dropdown-link">
                  Gestión de Usuarios
                </Link>
                <Link to="/clientes" className="navbar__dropdown-link">
                  Gestión Clientes
                </Link>
                <Link to="/proveedores" className="navbar__dropdown-link">
                  Gestión Proveedores
                </Link>
                <Link to="/gestion-compras" className="navbar__dropdown-link">
                  Gestión Compras
                </Link>
                <Link to="/gestion-ventas" className="navbar__dropdown-link">
                  Gestión Ventas
                </Link>
                <Link
                  to="/gestion-inventario"
                  className="navbar__dropdown-link"
                >
                  Gestión Inventario
                </Link>
                <Link to="/gestion-ordenes" className="navbar__dropdown-link">
                  Gestión de Órdenes de Producción
                </Link>
              </div>
            )}
          </div>
        )}

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

        {/* USUARIO */}
        {usuario && (
          <div className="navbar__user" ref={userRef}>
            <button
              type="button"
              className="navbar__username"
              onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
            >
              {usuario.primer_nombre} {usuario.primer_apellido}{" "}
              <FaChevronDown />
            </button>

            {openMenu === "user" && (
              <div className="navbar__dropdown" role="menu">
                <button role="menuitem" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
