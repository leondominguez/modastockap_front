import { useState } from "react";
import "./GestionCompras.css";
import InsumosCatalogo from "./InsumosCatalogo";
import InsumosProveedor from "./InsumosProveedor";
import Navbar from "../../components/Navbar";
import RegistrarCompra from "./RegistrarCompras";
import ListarCompras from "./ListarCompras";

function GestionCompras() {
  const [active, setActive] = useState("catalogo");

  return (
    <div className="gestion-compras">
      <Navbar />
      <div className="gestion-compras__content">
        <aside className="gestion-compras__sidebar">
          <h2 className="gestion-compras__title">Gestión de compras</h2>
          <nav className="gestion-compras__nav">
            <button
              className={
                "gestion-compras__nav-btn btn " +
                (active === "catalogo" ? "is-active" : "")
              }
              onClick={() => setActive("catalogo")}
            >
              Catálogo de insumos
            </button>
            <button
              className={
                "gestion-compras__nav-btn btn " +
                (active === "proveedor" ? "is-active" : "")
              }
              onClick={() => setActive("proveedor")}
            >
              Insumos por proveedor
            </button>
            <button
              className={
                "gestion-compras__nav-btn btn " +
                (active === "inventarios" ? "is-active" : "")
              }
              onClick={() => setActive("inventarios")}
            >
              Inventario de insumos
            </button>
            <button
              className={
                "gestion-compras__nav-btn btn " +
                (active === "registrarCompras" ? "is-active" : "")
              }
              onClick={() => setActive("registrarCompras")}
            >
              Registrar compras
            </button>
            <button
              className={
                "gestion-compras__nav-btn btn " +
                (active === "listarCompras" ? "is-active" : "")
              }
              onClick={() => setActive("listarCompras")}
            >
              Listar compras
            </button>
          </nav>
        </aside>

        <main className="gestion-compras__main">
          {active === "catalogo" && <InsumosCatalogo />}
          {active === "proveedor" && <InsumosProveedor />}
          {active === "registrarCompras" && <RegistrarCompra />}
          {active === "listarCompras" && <ListarCompras />}
        </main>
      </div>
    </div>
  );
}

export default GestionCompras;
