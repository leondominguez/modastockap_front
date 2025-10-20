// /client/src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";
import Navbar from "../components/Navbar";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ usuario: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "auth/login";
    console.log("Enviando:", form);
    console.log("URL API:", process.env.REACT_APP_API_URL);

    axios
      .post(url, form)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        // Guardar token y usuario en sessionStorage
        sessionStorage.setItem("token", response.data.token);
        if (response.data.usuario) {
          sessionStorage.setItem(
            "usuario",
            JSON.stringify(response.data.usuario)
          );
        }
        // Redirigir
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        // Manejar errores
      });
  };

  return (
    <div className="login">
      <Navbar />
      <main className="login__main">
        <form className="login__card" onSubmit={handleSubmit}>
          <h2 className="login__title">Iniciar sesión</h2>

          <div className="login__group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="usuario123"
              required
            />
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
            />
          </div>

          <button type="submit" className="login__button">
            Entrar
          </button>

          <p className="login__footer">
            ¿No tienes cuenta? <a href="#">Contáctanos</a>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;
