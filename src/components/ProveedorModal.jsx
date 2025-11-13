import React, { useEffect, useState } from "react";
import "./ProveedorModal.css"; // estilos específicos para proveedor
import swal from '../utils/swal';
import axios from "axios";

function ProveedorModal({ show, onClose, onSaved, selectedProveedor }) {
  const [form, setForm] = useState({
    tipo_documento: "",
    numero_documento: "",
    razon_social: "",
    nombre_contacto: "",
    telefono_contacto: "",
    email_contacto: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    pais: "",
    estado: 0,
    notas: "",
  });
  const [errors, setErrors] = useState({});
  const apiBase = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (selectedProveedor) {
      setForm({
        tipo_documento: selectedProveedor.tipo_documento || "",
        numero_documento: selectedProveedor.numero_documento || "",
        razon_social: selectedProveedor.razon_social || "",
        nombre_contacto: selectedProveedor.nombre_contacto || "",
        telefono_contacto: selectedProveedor.telefono_contacto || "",
        email_contacto: selectedProveedor.email_contacto || "",
        direccion: selectedProveedor.direccion || "",
        ciudad: selectedProveedor.ciudad || "",
        departamento: selectedProveedor.departamento || "",
        pais: selectedProveedor.pais || "",
        estado: selectedProveedor.estado ?? 0,
        notas: selectedProveedor.notas || "",
      });
    } else {
      setForm({
        tipo_documento: "",
        numero_documento: "",
        razon_social: "",
        nombre_contacto: "",
        telefono_contacto: "",
        email_contacto: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        pais: "",
        estado: 0,
        notas: "",
      });
    }
    setErrors({});
  }, [selectedProveedor, show]);

  if (!show) return null;

  const validate = () => {
    const e = {};
    if (!form.tipo_documento || !form.tipo_documento.trim()) e.tipo_documento = "Tipo de documento requerido";
    if (!form.numero_documento || !form.numero_documento.trim()) e.numero_documento = "Número de documento requerido";
    if (!form.razon_social || !form.razon_social.trim()) e.razon_social = "Razón social requerida";
    if (form.email_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_contacto)) e.email_contacto = "Email inválido";
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
      if (selectedProveedor && (selectedProveedor.id_proveedor || selectedProveedor.id)) {
        const id = selectedProveedor.id_proveedor || selectedProveedor.id;
        res = await axios.put(`${apiBase}proveedores/actualizar/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        swal({ icon: "success", title: "Proveedor actualizado", timer: 1200, showConfirmButton: false });
      } else {
        res = await axios.post(`${apiBase}proveedores/crear`, payload, { headers: { Authorization: `Bearer ${token}` } });
        swal({ icon: "success", title: "Proveedor creado", timer: 1200, showConfirmButton: false });
      }
      if (onSaved) onSaved(res.data);
      onClose();
    } catch (error) {
      console.error("ProveedorModal error:", error);
      swal({ icon: "error", title: "Error", text: error.response?.data?.message || "Ocurrió un error al guardar el proveedor." });
    }
  };

  return (
    <div className="proveedor-modal__overlay" role="dialog" aria-modal="true">
      <div className="proveedor-modal__content">
        <h2 style={{ display: 'inline-block', marginRight: '8px' }}>{selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>
        <button onClick={onClose} className="proveedor-modal__close modal-close" aria-label="Cerrar">×</button>
        <form className="proveedor-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="proveedor-modal__grid">
            <div className="proveedor-modal__group">
              <label>Tipo Documento</label>
              <select name="tipo_documento" value={form.tipo_documento} onChange={handleChange} className={errors.tipo_documento ? "input-error" : ""}>
                <option value="">Seleccione...</option>
                <option value="CC">CC</option>
                <option value="NIT">NIT</option>
                <option value="PAS">PAS</option>
                <option value="CE">CE</option>
              </select>
              {errors.tipo_documento && <span className="error-text">{errors.tipo_documento}</span>}
            </div>

            <div className="proveedor-modal__group">
              <label>Número Documento</label>
              <input name="numero_documento" value={form.numero_documento} onChange={handleChange} className={errors.numero_documento ? "input-error" : ""} />
              {errors.numero_documento && <span className="error-text">{errors.numero_documento}</span>}
            </div>

            <div className="proveedor-modal__group">
              <label>Razón Social</label>
              <input name="razon_social" value={form.razon_social} onChange={handleChange} className={errors.razon_social ? "input-error" : ""} />
              {errors.razon_social && <span className="error-text">{errors.razon_social}</span>}
            </div>

            <div className="proveedor-modal__group">
              <label>Contacto</label>
              <input name="nombre_contacto" value={form.nombre_contacto} onChange={handleChange} />
            </div>

            <div className="proveedor-modal__group">
              <label>Teléfono</label>
              <input name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} />
            </div>

            <div className="proveedor-modal__group">
              <label>Email</label>
              <input name="email_contacto" value={form.email_contacto} onChange={handleChange} />
              {errors.email_contacto && <span className="error-text">{errors.email_contacto}</span>}
            </div>

            <div className="proveedor-modal__group">
              <label>Dirección</label>
              <input name="direccion" value={form.direccion} onChange={handleChange} />
            </div>

            <div className="proveedor-modal__group">
              <label>Ciudad</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange} />
            </div>

            <div className="proveedor-modal__group">
              <label>Estado</label>
              <select name="estado" value={String(form.estado)} onChange={(e) => setForm((s) => ({ ...s, estado: Number(e.target.value) }))}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>

            <div className="proveedor-modal__group">
              <label>Notas</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} />
            </div>
          </div>

          <div className="proveedor-modal__actions">
            <button type="button" className="btn--cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn--save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProveedorModal;