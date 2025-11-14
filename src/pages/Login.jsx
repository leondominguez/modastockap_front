// /client/src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import swal from '../utils/swal';

function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (field, value) => {
    let message = "";

    if (field === "usuario") {
      if (!value.trim()) {
        message = "El usuario o correo es obligatorio";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
        value.length < 3
      ) {
        message = "Debe ser un correo válido o tener al menos 3 caracteres";
      }
    }

    if (field === "password") {
      if (!value.trim()) message = "La contraseña es obligatoria";
      else if (value.length < 6) message = "Debe tener al menos 6 caracteres";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar antes de enviar
    validate("usuario", form.usuario);
    validate("password", form.password);

    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors || !form.usuario || !form.password) {
      swal({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor corrige los errores antes de continuar.",
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#A5B4FC",
      });

      return;
    }

    setIsSubmitting(true);
    const url = process.env.REACT_APP_API_URL + "auth/login";

    try {
      const response = await axios.post(url, form);
      console.log("Respuesta del servidor:", response.data);

      sessionStorage.setItem("token", response.data.token);
      if (response.data.usuario) {
        sessionStorage.setItem(
          "usuario",
          JSON.stringify(response.data.usuario)
        );
      }

      await swal({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al sistema 👋",
        confirmButtonColor: "#4F46E5",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.href = "/"; // Redirección tras éxito
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      swal({
        icon: "error",
        title: "Error de autenticación",
        text:
          error.response?.data?.message || "Usuario o contraseña incorrectos.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormInvalid =
    !form.usuario ||
    !form.password ||
    Object.values(errors).some((msg) => msg !== "");

  return (
    <div className="login">
      <Navbar />
      <main className="login__main">
        <form className="login__card" onSubmit={handleSubmit} noValidate>
          <h2 className="login__title">Iniciar sesión</h2>

          <div className="login__group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="usuario123 o correo@example.com"
              required
              className={errors.usuario ? "input-error" : ""}
            />
            {errors.usuario && (
              <span className="error-text">{errors.usuario}</span>
            )}
          </div>

          <div className="login__group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="login__button"
            disabled={isFormInvalid || isSubmitting}
            aria-label="Iniciar sesión"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <p className="login__footer">
            ¿No tienes cuenta? <a href="/contacto">Contáctanos</a>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;
