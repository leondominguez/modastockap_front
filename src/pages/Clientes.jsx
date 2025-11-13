import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from '../utils/swal';
import ClienteModal from "../components/ClienteModal";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal/selección
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  // Búsqueda
  const [searchCriteria, setSearchCriteria] = useState("documento"); // 'documento' | 'nombre' | 'estado'
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [name, setName] = useState("");
  const [estadoFilter, setEstadoFilter] = useState(""); // "" | "1" | "0"

  const apiBase = process.env.REACT_APP_API_URL || "";

  const fetchClientes = async (searchParams = {}) => {
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
      if (usuario.id_rol !== 1) {
        navigate("/");
        return;
      }

      const isSearching = Object.keys(searchParams).length > 0;
      const params = new URLSearchParams(searchParams).toString();
      const route = isSearching ? "clientes/buscarCliente" : "clientes/listar";
      const url = `${apiBase}${route}${params ? `?${params}` : ""}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resultado = response.data?.clientes ?? response.data ?? [];
      const lista = Array.isArray(resultado) ? resultado : resultado ? [resultado] : [];
      setClientes(lista);
        if (lista.length === 0 && isSearching) {
          setError("No se encontraron clientes con los criterios de búsqueda.");
        } else {
          setError(null);
      }
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      const isSearching = Object.keys(searchParams).length > 0;

      if (status === 404 && isSearching) {
        setClientes([]);
        setError("No se encontraron clientes con los criterios de búsqueda.");
      } else {
        setClientes([]);
          setError(message || "Error al cargar/buscar clientes.");
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
  };

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    let params = {};

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
      params = { tipo_documento: documentType, numero_documento: documentNumber.trim() };
    } else if (searchCriteria === "nombre") {
      if (!name.trim()) {
        swal({
          icon: "warning",
          title: "Campo Requerido",
          text: "Debe ingresar el Nombre para buscar.",
          confirmButtonColor: "#F59E0B",
        });
        return;
      }
      params = { nombre: name.trim() };
    } else if (searchCriteria === "estado") {
      if (estadoFilter === "") {
        swal({
          icon: "info",
          title: "Seleccione estado",
          text: "Seleccione Activo o Inactivo para filtrar por estado.",
          confirmButtonColor: "#4F46E5",
        });
        return;
      }
      params = { estado: estadoFilter };
    }

    fetchClientes(params);
  };

  const handleClearSearch = () => {
    setSearchCriteria("documento");
    setDocumentType("");
    setDocumentNumber("");
    setName("");
    setEstadoFilter("");
    fetchClientes();
  };

  const handleAddCliente = () => {
    setSelectedCliente(null);
    setShowModal(true);
  };

  const handleEditCliente = (c) => {
    setSelectedCliente(c);
    setShowModal(true);
  };

  const handleToggleEstado = async (cliente) => {
    const accion = cliente.estado === 1 ? "Desactivar" : "Activar";
    const confirm = await swal({
      title: `¿${accion} cliente?`,
      text: `El cliente "${cliente.nombre}" será ${accion.toLowerCase()}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      const nuevoEstado = cliente.estado === 1 ? "0" : "1";
      const id = cliente.id_cliente || cliente.id;
      const url = `${apiBase}clientes/cambiarEstado/${id}?estado=${nuevoEstado}`;

      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      swal({
        icon: "success",
        title: `Cliente ${nuevoEstado === "1" ? "activado" : "desactivado"}`,
        timer: 1400,
        showConfirmButton: false,
      });

      fetchClientes();
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error);
      swal({
        icon: "error",
        title: "Error al cambiar estado",
        text: error.response?.data?.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  if (loading) return <p className="clientes__loading">Cargando clientes...</p>;

  return (
    <div className="clientes">
      <Navbar />
      <div className="clientes__header">
        <h1>Gestión de Clientes</h1>
        <button className="btn btn--primary clientes__btn" onClick={handleAddCliente}>
          + Nuevo Cliente
        </button>
      </div>

      <form className="clientes__search-form" onSubmit={handleSearch}>
          <h2>Buscar Cliente</h2>
          <div className="clientes__search-controls">
            <div className="clientes__search-radio">
              <label>
                <input
                  type="radio"
                  value="documento"
                  checked={searchCriteria === "documento"}
                  onChange={() => {
                    setSearchCriteria("documento");
                    setName("");
                    setEstadoFilter("");
                  }}
                />
                Por Documento
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
                    setEstadoFilter("");
                  }}
                />
                Por Nombre
              </label>
              <label>
                <input
                  type="radio"
                  value="estado"
                  checked={searchCriteria === "estado"}
                  onChange={() => {
                    setSearchCriteria("estado");
                    setDocumentType("");
                    setDocumentNumber("");
                    setName("");
                  }}
                />
                Por Estado
              </label>
            </div>

            {searchCriteria === "documento" && (
              <div className="clientes__search-group">
                <select
                  className={`clientes__search-input ${!documentType ? "input--required" : ""}`}
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                >
                  <option value="">Tipo Documento</option>
                  <option value="CC">CC</option>
                  <option value="NIT">NIT</option>
                  <option value="PAS">PAS</option>
                  <option value="CE">CE</option>
                </select>
                <input
                  type="text"
                  className={`clientes__search-input ${!documentNumber ? "input--required" : ""}`}
                  placeholder="Número de Documento"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>
            )}

            {searchCriteria === "nombre" && (
              <div className="clientes__search-group clientes__search-group--name">
                <input
                  type="text"
                  className={`clientes__search-input ${!name ? "input--required" : ""}`}
                  placeholder="Nombre (ej: Juan Pérez)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {searchCriteria === "estado" && (
              <div className="clientes__search-group">
                <select
                  className={`clientes__search-input ${estadoFilter === "" ? "input--required" : ""}`}
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                >
                  <option value="">Seleccione Estado</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn--primary clientes__btn clientes__btn--search">
              Buscar
            </button>
            <button type="button" className="btn btn--secondary clientes__btn clientes__btn--clear" onClick={handleClearSearch}>
              Limpiar
            </button>
          </div>
        </form>

        <section className="clientes__list">
          {clientes.length > 0 ? (
            <div className="table-responsive clientes__table-wrapper">
              <table className="clientes__table table cabecera_estatica">
                <thead>
                  <tr>
                    <th>Tipo ID</th>
                    <th>Numero</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Ciudad</th>
                    <th>Direcccion</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id_cliente || c.id}>
                      <td>{c.tipo_documento || "-"}</td>
                      <td>{c.numero_documento || "-"}</td>
                      <td>{c.nombre || "-"}</td>
                      <td>{c.email || "-"}</td>
                      <td>{c.telefono || "-"}</td>
                      <td>{c.ciudad || "-"}</td>
                      <td>{c.direccion || "-"}</td>
                      <td className="clientes__notas">{c.notas || "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="clientes__action clientes__action--edit"
                          onClick={() => handleEditCliente(c)}
                          aria-label={`Editar cliente ${c.nombre}`}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`clientes__action ${Number(c.estado) === 1 ? "clientes__action--delete" : "clientes__action--activate"}`}
                          onClick={() => handleToggleEstado(c)}
                          aria-label={`${Number(c.estado) === 1 ? "Desactivar" : "Activar"} cliente ${c.nombre}`}
                        >
                          {Number(c.estado) === 1 ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="clientes__empty">{error || "No hay clientes registrados que coincidan con la búsqueda."}</p>
          )}
        </section>

        <ClienteModal
          show={showModal}
          selectedCliente={selectedCliente}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            fetchClientes();
          }}
        />
    </div>
  );
}

export default ClientesPage;