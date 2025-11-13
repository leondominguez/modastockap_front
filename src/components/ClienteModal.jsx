// ...existing code...
import React, { useEffect, useState } from "react";
import "./ClienteModal.css";
import swal from '../utils/swal';
import axios from "axios";

function ClienteModal({ show, onClose, onSaved, selectedCliente }) {
  const [form, setForm] = useState({
    tipo_documento: "",
    numero_documento: "",
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    pais: "",
    estado: 0, // coherente con defaultValue del modelo (0 = inactivo)
    notas: "",
  });
  const [errors, setErrors] = useState({});
  const apiBase = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (selectedCliente) {
      setForm({
        tipo_documento: selectedCliente.tipo_documento || "",
        numero_documento: selectedCliente.numero_documento || "",
        nombre: selectedCliente.nombre || "",
        email: selectedCliente.email || "",
        telefono: selectedCliente.telefono || "",
        direccion: selectedCliente.direccion || "",
        ciudad: selectedCliente.ciudad || "",
        departamento: selectedCliente.departamento || "",
        pais: selectedCliente.pais || "",
        estado: selectedCliente.estado ?? 0,
        notas: selectedCliente.notas || "",
      });
    } else {
      setForm({
        tipo_documento: "",
        numero_documento: "",
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        pais: "",
        estado: 0,
        notas: "",
      });
    }
    setErrors({});
  }, [selectedCliente, show]);

  if (!show) return null;

  const validate = () => {
    const e = {};
    if (!form.tipo_documento || !form.tipo_documento.trim()) e.tipo_documento = "Tipo de documento requerido";
    if (!form.numero_documento || !form.numero_documento.trim()) e.numero_documento = "Número de documento requerido";
    if (!form.nombre || !form.nombre.trim()) e.nombre = "Nombre requerido";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      swal({ icon: "warning", title: "Campos requeridos", text: "Completa los campos obligatorios." });
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const payload = { ...form, estado: Number(form.estado) };
      let res;

      if (selectedCliente && (selectedCliente.id_cliente || selectedCliente.id)) {
        const id = selectedCliente.id_cliente || selectedCliente.id;
        res = await axios.put(`${apiBase}clientes/actualizar/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        swal({ icon: "success", title: "Cliente actualizado", timer: 1200, showConfirmButton: false });
      } else {
        res = await axios.post(`${apiBase}clientes/crear`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        swal({ icon: "success", title: "Cliente creado", timer: 1200, showConfirmButton: false });
      }

      // onSaved recibe el cliente creado/actualizado (según backend)
      if (onSaved) onSaved(res.data);
      onClose();
    } catch (error) {
      console.error("ClienteModal error:", error);
      swal({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ocurrió un error al guardar el cliente.",
      });
    }
  };

  return (
    <div className="cliente-modal__overlay" role="dialog" aria-modal="true">
      <div className="cliente-modal__content">
        <h2 style={{ display: 'inline-block', marginRight: '8px' }}>{selectedCliente ? "Editar Cliente" : "Nuevo Cliente"}</h2>
        <button onClick={onClose} className="cliente-modal__close modal-close" aria-label="Cerrar">×</button>
        <form className="cliente-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="cliente-modal__grid">
            <div className="cliente-modal__group">
              <label>Tipo Documento</label>
              <select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                className={errors.tipo_documento ? "input-error" : ""}
              >
                <option value="">Seleccione...</option>
                <option value="CC">CC</option>
                <option value="NIT">NIT</option>
                <option value="PAS">PAS</option>
                <option value="CE">CE</option>
              </select>
              {errors.tipo_documento && <span className="error-text">{errors.tipo_documento}</span>}
            </div>

            <div className="cliente-modal__group">
              <label>Número Documento</label>
              <input
                name="numero_documento"
                value={form.numero_documento}
                onChange={handleChange}
                className={errors.numero_documento ? "input-error" : ""}
              />
              {errors.numero_documento && <span className="error-text">{errors.numero_documento}</span>}
            </div>

            <div className="cliente-modal__group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} className={errors.nombre ? "input-error" : ""} />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>

            <div className="cliente-modal__group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="cliente-modal__group">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} />
            </div>

            <div className="cliente-modal__group">
              <label>Dirección</label>
              <input name="direccion" value={form.direccion} onChange={handleChange} />
            </div>

            <div className="cliente-modal__group">
              <label>Ciudad</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange} />
            </div>

            <div className="cliente-modal__group">
              <label>Departamento</label>
              <input name="departamento" value={form.departamento} onChange={handleChange} />
            </div>

            <div className="cliente-modal__group">
              <label>País</label>
              <input name="pais" value={form.pais} onChange={handleChange} />
            </div>

            <div className="cliente-modal__group">
              <label>Estado</label>
              <select
                name="estado"
                value={String(form.estado)}
                onChange={(e) => setForm((s) => ({ ...s, estado: Number(e.target.value) }))}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>

            <div className="cliente-modal__group">
              <label>Notas</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} />
            </div>
          </div>

          <div className="cliente-modal__actions">
            <button type="button" className="btn--cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn--save">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteModal;
