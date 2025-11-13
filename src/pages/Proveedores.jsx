import React, { useEffect, useState } from "react";
import "./Proveedores.css"; // reutiliza estilos de clientes
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from '../utils/swal';
import ProveedorModal from "../components/ProveedorModal";

function ProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal / selección
  const [showModal, setShowModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Búsqueda
  const [searchCriteria, setSearchCriteria] = useState("documento"); // 'documento' | 'razon_social' | 'estado'
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [estadoFilter, setEstadoFilter] = useState(""); // "" | "1" | "0"

  const apiBase = process.env.REACT_APP_API_URL || "";

  const fetchProveedores = async (searchParams = {}) => {
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
      const route = isSearching ? "proveedores/buscarProveedor" : "proveedores/listar";
      const url = `${apiBase}${route}${params ? `?${params}` : ""}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resultado = response.data?.proveedores ?? response.data ?? [];
      const lista = Array.isArray(resultado) ? resultado : resultado ? [resultado] : [];
      setProveedores(lista);

      if (isSearching && lista.length === 0) {
        setError("No se encontraron proveedores con los criterios de búsqueda.");
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      const isSearching = Object.keys(searchParams).length > 0;
      if (status === 404 && isSearching) {
        setProveedores([]);
        setError("No se encontraron proveedores con los criterios de búsqueda.");
      } else {
        setProveedores([]);
        setError(message || "Error al cargar/buscar proveedores.");
        swal({ icon: "error", title: "Error", text: message || "Ocurrió un error." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    let params = {};
    if (searchCriteria === "documento") {
      if (!documentType || !documentNumber || !documentNumber.trim()) {
        swal({ icon: "warning", title: "Campos Requeridos", text: "Ingrese Tipo y Número de documento." });
        return;
      }
      params = { tipo_documento: documentType, numero_documento: documentNumber.trim() };
    } else if (searchCriteria === "razon_social") {
      if (!razonSocial.trim()) {
        swal({ icon: "warning", title: "Campo Requerido", text: "Ingrese la razón social." });
        return;
      }
      params = { razon_social: razonSocial.trim() };
    } else if (searchCriteria === "estado") {
      if (estadoFilter === "") {
        swal({ icon: "info", title: "Seleccione estado", text: "Seleccione Activo o Inactivo." });
        return;
      }
      params = { estado: estadoFilter };
    }
    fetchProveedores(params);
  };

  const handleClearSearch = () => {
    setSearchCriteria("documento");
    setDocumentType("");
    setDocumentNumber("");
    setRazonSocial("");
    setEstadoFilter("");
    fetchProveedores();
  };

  const handleAddProveedor = () => {
    setSelectedProveedor(null);
    setShowModal(true);
  };

  const handleEditProveedor = (p) => {
    setSelectedProveedor(p);
    setShowModal(true);
  };

  const handleToggleEstado = async (proveedor) => {
    const accion = proveedor.estado === 1 ? "Desactivar" : "Activar";
    const confirm = await swal({
      title: `¿${accion} proveedor?`,
      text: `El proveedor "${proveedor.razon_social || proveedor.nombre_contacto}" será ${accion.toLowerCase()}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      const token = sessionStorage.getItem("token");
      const nuevoEstado = proveedor.estado === 1 ? "0" : "1";
      const id = proveedor.id_proveedor || proveedor.id;
      const url = `${apiBase}proveedores/cambiarEstado/${id}?estado=${nuevoEstado}`;
      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      swal({ icon: "success", title: `Proveedor ${nuevoEstado === "1" ? "activado" : "desactivado"}`, timer: 1200, showConfirmButton: false });
      fetchProveedores();
    } catch (err) {
      console.error("Error cambiar estado proveedor:", err);
      swal({ icon: "error", title: "Error", text: err.response?.data?.message || "Ocurrió un error." });
    }
  };

  if (loading) return <p className="proveedores__loading">Cargando proveedores...</p>;

  return (
    <div className="proveedores">
      <Navbar />
      <main className="proveedores__main">
        <div className="proveedores__header">
          <h1>Gestión de Proveedores</h1>
          <button aria-label="Agregar nuevo proveedor" className="btn btn--primary proveedores__btn proveedores__btn--add" onClick={handleAddProveedor}>
            + Nuevo Proveedor
          </button>
        </div>

        <form className="proveedores__search-form" onSubmit={handleSearch}>
          <h2>Buscar Proveedor</h2>
          <div className="proveedores__search-controls">
            <div className="proveedores__search-radio">
              <label>
                <input type="radio" value="documento" checked={searchCriteria === "documento"} onChange={() => { setSearchCriteria("documento"); setRazonSocial(""); setEstadoFilter(""); }} />
                Por Documento
              </label>
              <label>
                <input type="radio" value="razon_social" checked={searchCriteria === "razon_social"} onChange={() => { setSearchCriteria("razon_social"); setDocumentType(""); setDocumentNumber(""); setEstadoFilter(""); }} />
                Por Razon Social
              </label>
              <label>
                <input type="radio" value="estado" checked={searchCriteria === "estado"} onChange={() => { setSearchCriteria("estado"); setDocumentType(""); setDocumentNumber(""); setRazonSocial(""); }} />
                Por Estado
              </label>
            </div>

                {searchCriteria === "documento" && (
              <div className="proveedores__search-group">
                <select aria-label="Tipo de documento" className={`proveedores__search-input ${!documentType ? "input--required" : ""}`} value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                  <option value="">Tipo Documento</option>
                  <option value="CC">CC</option>
                  <option value="NIT">NIT</option>
                  <option value="PAS">PAS</option>
                  <option value="CE">CE</option>
                </select>
                <input aria-label="Número de documento" type="text" className={`proveedores__search-input ${!documentNumber ? "input--required" : ""}`} placeholder="Número de Documento" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
              </div>
            )}

            {searchCriteria === "razon_social" && (
              <div className="proveedores__search-group proveedores__search-group--name">
                <input aria-label="Razón social" type="text" className={`proveedores__search-input ${!razonSocial ? "input--required" : ""}`} placeholder="Razon Social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
              </div>
            )}

            {searchCriteria === "estado" && (
              <div className="proveedores__search-group">
                <select aria-label="Filtrar por estado" className={`proveedores__search-input ${estadoFilter === "" ? "input--required" : ""}`} value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)}>
                  <option value="">Seleccione Estado</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            )}

            <button type="submit" aria-label="Buscar proveedores" className="btn btn--primary proveedores__btn--search proveedores__btn">Buscar</button>
            <button type="button" aria-label="Limpiar búsqueda" className="btn proveedores__btn--clear proveedores__btn" onClick={handleClearSearch}>Limpiar</button>
          </div>
        </form>

        {proveedores.length > 0 ? (
          <div className="table-responsive proveedores__table-wrapper">
          <table className="proveedores__table table cabecera_estatica">
            <thead>
              <tr>
                <th>Tipo ID</th>
                <th>Numero</th>
                <th>Razon Social</th>
                <th>Contacto</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Ciudad</th>
                <th>Direcccion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id_proveedor || p.id}>
                  <td>{p.tipo_documento || "-"}</td>
                  <td>{p.numero_documento || "-"}</td>
                  <td>{p.razon_social || "-"}</td>
                  <td>{p.nombre_contacto || "-"}</td>
                  <td>{p.telefono_contacto || "-"}</td>
                  <td>{p.email_contacto || "-"}</td>
                  <td>{p.ciudad || "-"}</td>
                  <td>{p.direccion || "-"}</td>
                  <td>
                    <button type="button" className="proveedores__action proveedores__action--edit" onClick={() => handleEditProveedor(p)}>Editar</button>
                    <button type="button" className={`proveedores__action ${Number(p.estado) === 1 ? "proveedores__action--delete" : "proveedores__action--activate"}`} onClick={() => handleToggleEstado(p)}>
                      {Number(p.estado) === 1 ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className="proveedores__empty">{error || "No hay proveedores que coincidan con la búsqueda."}</p>
        )}

        <ProveedorModal
          show={showModal}
          selectedProveedor={selectedProveedor}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchProveedores(); }}
        />
      </main>
    </div>
  );
}

export default ProveedoresPage;