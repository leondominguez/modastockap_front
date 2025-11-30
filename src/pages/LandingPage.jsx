import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

function LandingPage() {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  // Añadir clase al <body> para permitir overrides por página (p.ej. variables CSS
  // específicas para SweetAlert2 que se aplican al popup insertado en <body>).
  useEffect(() => {
    document.body.classList.add("landing-page");
    return () => {
      document.body.classList.remove("landing-page");
    };
  }, []);

  return (
    <div className="landing">
      <Navbar />
      <main className="landing__main">
        <div className="landing__content">
          <h1 className="landing__title">Bienvenido a ModaStock</h1>
          <p className="landing__subtitle">
            Gestiona fácilmente tu inventario, clientes y stock en tiempo real.
          </p>
          <div className="landing__buttons">
            {!usuario && (
              <Link to="/login" className="btn btn--primary landing__btn">
                Iniciar sesión
              </Link>
            )}

            {usuario && usuario.id_rol === 1 && (
              <>
                <Link to="/usuarios" className="btn btn--primary landing__btn">
                  Gestión de Usuarios
                </Link>

                <Link to="/clientes" className="btn btn--primary landing__btn">
                  Gestión Clientes
                </Link>

                <Link
                  to="/proveedores"
                  className="btn btn--primary landing__btn"
                >
                  Gestión Proveedores
                </Link>

                <Link
                  to="/gestion-compras"
                  className="btn btn--primary landing__btn"
                >
                  Gestión Compras
                </Link>
                <Link
                  to="/gestion-ventas"
                  className="btn btn--primary landing__btn"
                >
                  Gestión Ventas
                </Link>

                <Link
                  to="/gestion-inventario"
                  className="btn btn--primary landing__btn"
                >
                  Gestión Inventario
                </Link>

                {/* <Link
                  to="/gestion-ordenes"
                  className="btn btn--primary landing__btn"
                >
                  Gestión de Órdenes de Producción
                </Link> */}
              </>
            )}

            {usuario && usuario.id_rol === 2 && (
              <>
                <Link to="/clientes" className="btn btn--primary landing__btn">
                  Gestión Clientes
                </Link>

                <Link
                  to="/operaciones"
                  className="btn btn--primary landing__btn"
                >
                  Ir a Operaciones
                </Link>
              </>
            )}

            {/* Enlaces rápidos visibles en el landing */}

            <a href="#contacto" className="btn btn--secondary landing__btn">
              Saber más
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
