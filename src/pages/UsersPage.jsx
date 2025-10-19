// /client/src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import "./UsersPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const storedUser = sessionStorage.getItem("usuario");

        if (!token || !storedUser) {
          navigate("/login"); // No hay sesión -> login
          return;
        }

        const usuario = JSON.parse(storedUser);

        // Validar rol
        if (usuario.id_rol !== 1) {
          navigate("/"); // Rol no autorizado -> home
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data.usuarios ?? response.data ?? []);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) return <p className="users__loading">Cargando usuarios...</p>;
  if (error) return <p className="users__error">Error: {error}</p>;

  return (
    <div className="users">
      <Navbar />
      <main className="users__main">
        <div className="users__header">
          <h1>Gestión de Usuarios</h1>
          <button className="users__btn users__btn--add">
            + Nuevo Usuario
          </button>
        </div>

        {users.length > 0 ? (
          <table className="users__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id_usuario || u.id}>
                  <td>{u.id_usuario || u.id}</td>
                  <td>
                    {u.primer_nombre} {u.primer_apellido}
                  </td>
                  <td>{u.correo}</td>
                  <td>{u.rol?.nombre || u.id_rol || "—"}</td>
                  <td>
                    <button className="users__action users__action--edit">
                      Editar
                    </button>
                    <button className="users__action users__action--delete">
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="users__empty">No hay usuarios registrados.</p>
        )}
      </main>
    </div>
  );
}

export default UsersPage;
