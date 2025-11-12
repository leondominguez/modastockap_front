import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import UsersPage from "./pages/UsersPage";
import Clientes from "./pages/Clientes";
import Proveedores from "./pages/Proveedores";
import GestionCompras from "./pages/GestionCompras";
import GestionVentas from "./pages/GestionVentas";
import GestionInventario from "./pages/GestionInventario";
import InventariosProductos from "./pages/InventariosProductos";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/gestion-compras" element={<GestionCompras />} />
        <Route path="/gestion-ventas" element={<GestionVentas />} />
        <Route path="/gestion-inventario" element={<GestionInventario />} />
        <Route path="/inventarios" element={<InventariosProductos />} />
      </Routes>
    </Router>
  );
}

export default App;
