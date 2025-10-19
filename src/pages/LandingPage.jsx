// /client/src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

function LandingPage() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const handleClick = () => {
    if (!usuario) return;
    if (usuario.id_rol === 1) navigate("/usuarios"); // Admin
    else if (usuario.id_rol === 2) navigate("/operaciones"); // Operaciones
    else navigate("/"); // Otros roles
  };

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
              <button
                className="landing__btn landing__btn--primary"
                onClick={handleClick}
              >
                Ir a Usuarios
              </button>
            )}

            {usuario && usuario.id_rol === 2 && (
              <button
                className="landing__btn landing__btn--primary"
                onClick={handleClick}
              >
                Ir a Operaciones
              </button>
            )}

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
