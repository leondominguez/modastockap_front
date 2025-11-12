import { useState } from 'react';
import './GestionInventario.css';
import Navbar from '../components/Navbar';
import CodificacionProductos from './CodificacionProductos';
import InventariosProductos from './InventariosProductos';

function GestionInventario(){
  const [active, setActive] = useState('codificacion');

  return (
    <div className="gestion-inventario-page">
      <Navbar />
      <div className="gi__content">
        <aside className="gi__sidebar">
          <h2>Gestión de Inventario</h2>
          <nav className="gi__nav">
            <button className={"gi__nav-btn " + (active==='codificacion' ? 'is-active' : '')} onClick={()=>setActive('codificacion')}>Codificación de productos</button>
            <button className={"gi__nav-btn " + (active==='inventario' ? 'is-active' : '')} onClick={()=>setActive('inventario')}>Inventario</button>
          </nav>
        </aside>

        <main className="gi__main">
          {active==='codificacion' && <CodificacionProductos />}
          {active==='inventario' && <InventariosProductos />}
        </main>
      </div>
    </div>
  );
}

export default GestionInventario;
