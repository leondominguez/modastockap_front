import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import UsersPage from "./pages/UsersPage";
import Clientes from "./pages/Clientes";
import Proveedores from "./pages/Proveedores";
import GestionCompras from "./pages/GestionCompras";

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
      </Routes>
    </Router>
  );
}

export default App;
