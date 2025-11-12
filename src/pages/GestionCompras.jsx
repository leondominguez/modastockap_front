import { useState } from "react";
import "./GestionCompras.css";
import InsumosCatalogo from "./InsumosCatalogo";
import InsumosProveedor from "./InsumosProveedor";
import Navbar from "../components/Navbar";

function GestionCompras() {
  const [active, setActive] = useState("catalogo");

  return (
    <div className="gestion-compras">
      <Navbar />
      <div className="gc__content">
        <aside className="gestion-compras__sidebar">
          <h2 className="gc__title">Gestión de compras</h2>
          <nav className="gc__nav">
            <button className={"gc__nav-btn btn " + (active === 'catalogo' ? 'is-active' : '')} onClick={() => setActive('catalogo')}>Catálogo de insumos</button>
            <button className={"gc__nav-btn btn " + (active === 'proveedor' ? 'is-active' : '')} onClick={() => setActive('proveedor')}>Insumos por proveedor</button>
          </nav>
        </aside>

        <main className="gestion-compras__main">
          {active === 'catalogo' && <InsumosCatalogo />}
          {active === 'proveedor' && <InsumosProveedor />}
        </main>
      </div>
    </div>
  );
}

export default GestionCompras;
