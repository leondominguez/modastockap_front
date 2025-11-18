// /client/src/pages/UsersPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import "./UsersPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal";
import swal from '../utils/swal';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- ESTADOS PARA LA BÚSQUEDA ---
  const [searchCriteria, setSearchCriteria] = useState("documento"); // 'documento' o 'nombre'
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [name, setName] = useState("");
  // ---------------------------------

  const fetchUsers = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("usuario");

      if (!token || !storedUser) {
        navigate("/login");
        return;
      }

      const usuario = JSON.parse(storedUser);

      if (usuario.id_rol !== 1) { // Asumiendo rol 1 es administrador
        navigate("/");
        return;
      }

      // --- LÓGICA DE URL CLAVE (Punto 2 de la corrección) ---
      const isSearching = Object.keys(searchParams).length > 0;

  // Normalizar baseUrl y usar axios params (evita errores concatenando strings)
  const baseUrl = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '') + '/';
  const route = isSearching ? 'usuarios/buscar' : 'usuarios';
  const url = `${baseUrl}${route}`;
      // ----------------------------------------------------

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: isSearching ? searchParams : undefined
      });

      const fetchedUsers = response.data.usuarios ?? response.data ?? [];
      setUsers(fetchedUsers);

      // Manejo de mensaje si no se encuentra nada
      if (isSearching && fetchedUsers.length === 0) {
        setError("No se encontraron usuarios con los criterios de búsqueda.");
      } else {
        setError(null);
      }

    } catch (err) {
      console.error("Error al obtener usuarios:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      const isSearching = Object.keys(searchParams).length > 0; // Se redeclara aquí para el 'catch'

      // Manejo de error 404 (No Encontrado) durante la búsqueda
      if (status === 404 && isSearching) {
        setUsers([]);
        setError("No se encontraron usuarios con los criterios de búsqueda.");
      }
      // Manejo de errores generales o al cargar la lista inicial
      else {
        setUsers([]);
        setError(message || "Error al cargar/buscar usuarios.");
        swal({
          icon: "error",
          title: "Error de conexión/búsqueda",
          text: message || "Ocurrió un error inesperado. Intenta más tarde.",
          confirmButtonColor: "#4F46E5",
        });
      }

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers(); // Carga inicial de todos los usuarios (sin argumentos)
  }, [fetchUsers]);

  // --- LÓGICA DE BÚSQUEDA Y VALIDACIÓN ---
  const handleSearch = (e) => {
    e.preventDefault();
    let searchParams = {};

    if (searchCriteria === "documento") {
      if (!documentType || !documentNumber || !documentNumber.trim()) {
        swal({
          icon: "warning",
          title: "Campos Requeridos",
          text: "Para buscar por documento, debe ingresar el Tipo y el Número.",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }
      searchParams = {
        tipo_documento: documentType,
        numero_documento: documentNumber.trim()
      };
    } else if (searchCriteria === "nombre") {
      if (!name.trim()) {
        swal({
          icon: "warning",
          title: "Campo Requerido",
          text: "Debe ingresar el Nombre o Apellido para buscar.",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }
      // backend buscarUsuarios espera el parámetro 'nombre'
      searchParams = { nombre: name.trim() };
    }

    if (Object.keys(searchParams).length === 0) {
      swal({
        icon: "info",
        title: "Búsqueda vacía",
        text: "Ingrese un criterio para iniciar la búsqueda o use 'Limpiar'.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    // Ejecutar la búsqueda filtrada
    fetchUsers(searchParams);
  };

  const handleClearSearch = () => {
    // Limpiar campos
    setSearchCriteria("documento");
    setDocumentType("");
    setDocumentNumber("");
    setName("");
    // Recargar todos los usuarios (sin filtros)
    fetchUsers();
  };
  // ----------------------------------------

  // --- Resto de las funciones CRUD (handleAddUser, handleEditUser, handleDeleteUser) ---
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    const confirm = await swal({
      title: `¿${Number(user.estado) === 1 ? "Desactivar" : "Activar"} usuario?`,
      text: `El usuario "${user.usuario}" será ${Number(user.estado) === 1 ? "desactivado" : "activado"}.`,
      icon: "warning",
      showCancelButton: true,
  confirmButtonText: `Sí, ${Number(user.estado) === 1 ? "desactivar" : "activar"}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
  const estadoActual = Number(user.estado) === 1 ? "0" : "1";
      const url = `${process.env.REACT_APP_API_URL}usuarios/${user.id_usuario}/estado?estado=${estadoActual}`;

      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      swal({
        icon: "success",
        title: "Usuario " + (estadoActual === "1" ? "activado" : "desactivado"),
        text: `El usuario "${user.usuario}" fue ${estadoActual === "1" ? "activado" : "desactivado"} correctamente.`,
        confirmButtonColor: "#4F46E5",
        timer: 2000,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      swal({
        icon: "error",
        title: "Error al cambiar estado del usuario",
        text: error.response?.data?.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#EF4444",
      });
    }
  };


  if (loading) return <p className="users__loading">Cargando usuarios...</p>;

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

        {/* --- FORMULARIO DE BÚSQUEDA --- */}
        <form className="users__search-form" onSubmit={handleSearch}>
          <h2>Buscar Usuario</h2>
          <div className="users__search-controls">
            <div className="users__search-radio">
              <label>
                <input
                  type="radio"
                  value="documento"
                  checked={searchCriteria === "documento"}
                  onChange={() => {
                    setSearchCriteria("documento");
                    setName("");
                  }}
                />
                Por Documento (CC, NIT, PAS)
              </label>
              <label>
                <input
                  type="radio"
                  value="nombre"
                  checked={searchCriteria === "nombre"}
                  onChange={() => {
                    setSearchCriteria("nombre");
                    setDocumentType("");
                    setDocumentNumber("");
                  }}
                />
                Por Nombre o Apellido
              </label>
            </div>

            {searchCriteria === "documento" && (
              <div className="users__search-group">
                <select
                  className={`users__search-input ${!documentType ? 'input--required' : ''}`}
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="">Tipo Documento</option>
                  <option value="CC">CC</option>
                  <option value="NIT">NIT</option>
                  <option value="PAS">PAS</option>
                </select>
                <input
                  type="text"
                  className={`users__search-input ${!documentNumber ? 'input--required' : ''}`}
                  placeholder="Número de Documento"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>
            )}

            {searchCriteria === "nombre" && (
              <div className="users__search-group users__search-group--name">
                <input
                  type="text"
                  className={`users__search-input ${!name ? 'input--required' : ''}`}
                  placeholder="Nombre o Apellido (ej: Juan Pérez)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="users__btn users__btn--search">
              Buscar
            </button>
            <button
              type="button"
              className="users__btn users__btn--clear"
              onClick={handleClearSearch}
            >
              Limpiar
            </button>
          </div>
        </form>
        {/* ------------------------------------- */}

        {/* --- TABLA DE RESULTADOS --- */}
        <section className="users__list">
          {users.length > 0 ? (
            <div className="table-responsive users__table-wrapper">
              {/* El color de esto cambia, no con cabecera_estatica, sino con  --table-row-hover */}
              <table className="users__table table cabecera_estatica">
                <thead>
                  <tr>
                    <th>Tipo Id</th>
                    <th>Documento</th>
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
                      <td>{u.primer_nombre} {u.primer_apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol?.nombre || "-"}</td>
                      <td>{u.rol?.descripcion || "-"}</td>
                      <td>{Number(u.estado) === 0 ? "Inactivo" : "Activo"}</td>
                      <td>
                        <button className="users__action users__action--edit" onClick={() => handleEditUser(u)}>Editar</button>
                        <button className={`users__action ${Number(u.estado) === 1 ? "users__action--delete" : "users__action--activate"}`} onClick={() => handleDeleteUser(u)}>
                          {Number(u.estado) === 1 ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="users__empty">
              {error || "No hay usuarios registrados que coincidan con la búsqueda."}
            </p>
          )}
        </section>
        {showModal && (
          <UserModal
            show={showModal}
            onClose={() => setShowModal(false)}
            // CLAVE (Punto 3 de la corrección): Llama a fetchUsers() sin argumentos
            onUserCreated={() => {
              setShowModal(false);
              fetchUsers(); // Esto recarga la lista COMPLETA
            }}
            selectedUser={selectedUser}
          />
        )}
      </main>
    </div>
  );
}

export default UsersPage;