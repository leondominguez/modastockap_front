// /client/src/components/UserModal.jsx
import React, { useEffect, useState } from "react";
import "./UserModal.css";
import swal from '../utils/swal';
import axios from "axios";

function UserModal({ show, onClose, onUserCreated, selectedUser }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      // precarga datos del usuario
      setForm({
        usuario: selectedUser.usuario || "",
        primer_nombre: selectedUser.primer_nombre || "",
        segundo_nombre: selectedUser.segundo_nombre || "",
        primer_apellido: selectedUser.primer_apellido || "",
        segundo_apellido: selectedUser.segundo_apellido || "",
        tipo_documento: selectedUser.tipo_documento || "",
        numero_documento: selectedUser.numero_documento || "",
        email: selectedUser.correo || "",
        id_rol: selectedUser.id_rol?.toString() || "",
        password: "", // por seguridad no se carga
      });
    } else {
      // limpia formulario (nota: usar la misma clave `email` usada en el resto)
      setForm({
        usuario: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        tipo_documento: "",
        numero_documento: "",
        email: "",
        id_rol: "",
        password: "",
      });
    }

    // Limpia errores cuando cambia de modo
    setErrors({});
  }, [selectedUser]);

  //  Validar un campo
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "usuario":
        if (!value.trim()) message = "El usuario es obligatorio.";
        else if (value.length < 3)
          message = "Debe tener al menos 3 caracteres.";
        break;
      case "primer_nombre":
        if (!value.trim()) message = "El primer nombre es obligatorio.";
        break;
      case "primer_apellido":
        if (!value.trim()) message = "El primer apellido es obligatorio.";
        break;
      case "tipo_documento":
        if (!value) message = "Debe seleccionar un tipo de documento.";
        break;
      case "numero_documento":
        if (!value.trim()) message = "El número de documento es obligatorio.";
        else if (!/^\d+$/.test(value))
          message = "El documento solo puede contener números.";
        break;
      case "email":
        if (!value.trim()) message = "El correo es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          message = "Correo inválido.";
        break;
      case "id_rol":
        if (!value) message = "Debe seleccionar un rol.";
        break;
      case "password":
        if (!value.trim()) message = "La contraseña es obligatoria.";
        else if (value.length < 6)
          message = "Debe tener al menos 6 caracteres.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  //  Validar todos los campos
  const validateAll = () => {
    Object.keys(form).forEach((key) => validateField(key, form[key]));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateAll();

    const hasErrors = Object.values(errors).some((msg) => msg);
    const hasEmpty = Object.keys(form).some(
      (key) =>
        [
          "usuario",
          "primer_nombre",
          "primer_apellido",
          "tipo_documento",
          "numero_documento",
          "email",
          "id_rol",
        ].includes(key) && !form[key]?.trim()
    );

    // Si está creando, también validar contraseña
    if (!selectedUser && !form.password.trim()) {
      swal({
        icon: "warning",
        title: "Formulario incompleto",
        text: "Por favor ingresa una contraseña.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    if (hasErrors || hasEmpty) {
      swal({
        icon: "warning",
        title: "Formulario incompleto",
        text: "Por favor corrige los errores antes de continuar.",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      let response;
      if (selectedUser) {
        // Modo edición
        const url = `${process.env.REACT_APP_API_URL}usuarios/${selectedUser.id_usuario}`;
        const updatedData = { ...form };
        delete updatedData.password; // No se envía si está vacío

        response = await axios.put(url, updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        swal({
          icon: "success",
          title: "Usuario actualizado",
          text: "Los datos del usuario se han modificado correctamente.",
          confirmButtonColor: "#4F46E5",
        });
      } else {
        // Modo creación
        const url = process.env.REACT_APP_API_URL + "usuarios/";
        response = await axios.post(url, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        swal({
          icon: "success",
          title: "Usuario creado",
          text: "El nuevo usuario fue agregado exitosamente.",
          confirmButtonColor: "#4F46E5",
        });
      }

      onUserCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      swal({
        icon: "error",
        title: "Error al guardar usuario",
        text: error.response?.data?.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="user-modal__overlay">
      <div className="user-modal__content">
        <button
          type="button"
          className="user-modal__close modal-close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>
        <h2>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>

        <form onSubmit={handleSubmit} className="user-modal__form" noValidate>
          <div className="user-modal__grid">
            {[
              { name: "usuario", label: "Usuario" },
              { name: "primer_nombre", label: "Primer Nombre" },
              { name: "segundo_nombre", label: "Segundo Nombre" },
              { name: "primer_apellido", label: "Primer Apellido" },
              { name: "segundo_apellido", label: "Segundo Apellido" },
            ].map(({ name, label }) => (
              <div key={name} className="user-modal__group">
                <label>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className={errors[name] ? "input-error" : ""}
                />
                {errors[name] && (
                  <span className="error-text">{errors[name]}</span>
                )}
              </div>
            ))}

            <div className="user-modal__group">
              <label>Tipo de Documento</label>
              <select
                name="tipo_documento"
                value={form.tipo_documento}
                onChange={handleChange}
                className={errors.tipo_documento ? "input-error" : ""}
              >
                <option value="">Seleccione...</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
              {errors.tipo_documento && (
                <span className="error-text">{errors.tipo_documento}</span>
              )}
            </div>

            <div className="user-modal__group">
              <label>Número de Documento</label>
              <input
                name="numero_documento"
                value={form.numero_documento}
                onChange={handleChange}
                className={errors.numero_documento ? "input-error" : ""}
              />
              {errors.numero_documento && (
                <span className="error-text">{errors.numero_documento}</span>
              )}
            </div>

            <div className="user-modal__group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="user-modal__group">
              <label>Rol</label>
              <select
                name="id_rol"
                value={form.id_rol}
                onChange={handleChange}
                className={errors.id_rol ? "input-error" : ""}
              >
                <option value="">Seleccione...</option>
                <option value="1">Administrador</option>
                <option value="2">Supervisor</option>
                <option value="3">Empleado</option>
              </select>
              {errors.id_rol && (
                <span className="error-text">{errors.id_rol}</span>
              )}
            </div>

            <div className="user-modal__group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="user-modal__actions">
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

export default UserModal;
