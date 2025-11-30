import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import UsersPage from "./pages/UsersPage";
import Clientes from "./pages/Clientes";
import Proveedores from "./pages/Proveedores";
import GestionCompras from "./pages/modulo_compra/GestionCompras";
import GestionVentas from "./pages/GestionVentas";
import GestionInventario from "./pages/GestionInventario";
import GestionOrdenes from "./pages/GestionOrdenes";

// Pequeños wrappers para rutas públicas/privadas basadas en sessionStorage.token
const isAuthenticated = () => !!sessionStorage.getItem("token");

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  // Si ya estamos autenticados, no mostramos el login y redirigimos a landing
  return isAuthenticated() ? <Navigate to="/landing" replace /> : children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirige la ruta raíz a /login para iniciar sesión por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login público: si ya hay token, nos lleva a /landing */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas: requieren token */}
        <Route
          path="/landing"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/proveedores"
          element={
            <PrivateRoute>
              <Proveedores />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-compras"
          element={
            <PrivateRoute>
              <GestionCompras />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-ventas"
          element={
            <PrivateRoute>
              <GestionVentas />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-inventario"
          element={
            <PrivateRoute>
              <GestionInventario />
            </PrivateRoute>
          }
        />
        <Route
          path="/gestion-ordenes"
          element={
            <PrivateRoute>
              <GestionOrdenes />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
