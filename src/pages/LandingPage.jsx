import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

function LandingPage() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  const handleAdminUsuarios = () => navigate("/usuarios");
  const handleAdminClientes = () => navigate("/clientes");
  const handleAdminProveedores = () => navigate("/proveedores");
  const handleAdminGestionCompras = () => navigate("/gestion-compras");
  const handleOperaciones = () => navigate("/operaciones");

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
              <Link to="/login" className="landing__btn landing__btn--primary">
                Iniciar sesión
              </Link>
            )}

            {usuario && usuario.id_rol === 1 && (
              <>
                <button
                  className="landing__btn landing__btn--primary"
                  onClick={handleAdminUsuarios}
                >
                  Gestión de Usuarios
                </button>

                <button
                  className="landing__btn landing__btn--primary"
                  onClick={handleAdminClientes}
                >
                  Gestión Clientes
                </button>

                <button
                  className="landing__btn landing__btn--primary"
                  onClick={handleAdminProveedores}
                >
                  Gestión Proveedores
                </button>
                                <button
                                  className="landing__btn landing__btn--primary"
                                  onClick={handleAdminGestionCompras}
                                >
                                  Gestión Compras
                                </button>
              </>
            )}

            {usuario && usuario.id_rol === 2 && (
              <>
              <button
              className="landing__btn landing__btn--primary"
              onClick={handleAdminClientes}
              >
                Gestión Clientes
                </button>
              
              <button
                className="landing__btn landing__btn--primary"
                onClick={handleOperaciones}
              >
                Ir a Operaciones
              </button>

              </>

            )}

            {/* Enlaces rápidos visibles en el landing */}
            <Link to="/gestion-ventas" className="landing__btn landing__btn--primary">
              Gestión Ventas
            </Link>

            <Link to="/gestion-inventario" className="landing__btn landing__btn--primary">
              Gestión Inventario
            </Link>

            <a
              href="#contacto"
              className="landing__btn landing__btn--secondary"
            >
              Saber más
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;