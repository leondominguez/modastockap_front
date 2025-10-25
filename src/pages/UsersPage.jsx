// /client/src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import "./UsersPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal";
import Swal from "sweetalert2";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("usuario");

      if (!token || !storedUser) {
        navigate("/login"); // No hay sesión -> login
        return;
      }

      const usuario = JSON.parse(storedUser);

      // Verifica rol (solo admin)
      if (usuario.id_rol !== 1) {
        navigate("/"); // Rol no autorizado -> home
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}usuarios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data.usuarios ?? response.data ?? []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError(err.response?.data?.message || err.message);
      Swal.fire({
        icon: "error",
        title: "Error al cargar usuarios",
        text: err.response?.data?.message || "Intenta más tarde.",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Desactivar usuario
  const handleDeleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: `¿${user.estado == 1 ? "Desactivar" : "Activar"} usuario?`,
      text: `El usuario "${user.usuario}" será ${
        user.estado == 1 ? "desactivado" : "activado"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${user.estado == 1 ? "desactivar" : "activar"}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      const estadoActual = user.estado == 1 ? "0" : "1";
      const url = `${process.env.REACT_APP_API_URL}usuarios/${user.id_usuario}/estado?estado=${estadoActual}`;

      await axios.patch(url, { headers: { Authorization: `Bearer ${token}` } });

      Swal.fire({
        icon: "success",
        title: "Usuario " + (estadoActual === "1" ? "activado" : "desactivado"),
        text: `El usuario "${user.usuario}" fue ${
          estadoActual === "1" ? "activado" : "desactivado"
        } correctamente.`,
        confirmButtonColor: "#4F46E5",
        timer: 2000,
      });

      // Recargar lista
      fetchUsers();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al cambiar estado del usuario",
        text: error.response?.data?.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  if (loading) return <p className="users__loading">Cargando usuarios...</p>;
  if (error) return <p className="users__error">Error: {error}</p>;

  return (
    <div className="users">
      <Navbar />
      <main className="users__main">
        <div className="users__header">
          <h1>Gestión de Usuarios</h1>
          <button
            className="users__btn users__btn--add"
            onClick={handleAddUser}
          >
            + Nuevo Usuario
          </button>
        </div>
        {users.length > 0 ? (
          <table className="users__table">
            <thead>
              <tr>
                <th>Tipo de Documento</th>
                <th>Número de Documento</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Descripción del Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id_usuario || u.id}>
                  <td>{u.tipo_documento}</td>
                  <td>{u.numero_documento}</td>
                  <td>
                    {u.primer_nombre} {u.primer_apellido}
                  </td>
                  <td>{u.correo}</td>
                  <td>{u.rol?.nombre || "-"}</td>
                  <td>{u.rol?.descripcion || "-"}</td>
                  <td>{u.estado == 0 ? "Inactivo" : "Activo"}</td>
                  <td>
                    <button
                      className="users__action users__action--edit"
                      onClick={() => handleEditUser(u)}
                    >
                      Editar
                    </button>
                    <button
                      className={`users__action ${
                        u.estado === 1
                          ? "users__action--delete"
                          : "users__action--activate"
                      }`}
                      onClick={() => handleDeleteUser(u)}
                    >
                      {u.estado == 1 ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="users__empty">No hay usuarios registrados.</p>
        )}
        {/* {console.log("showModal:", showModal, "selectedUser:", selectedUser)} */}
        {showModal && (
          <UserModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onUserCreated={fetchUsers}
            selectedUser={selectedUser}
          />
        )}
      </main>
    </div>
  );
}

export default UsersPage;
