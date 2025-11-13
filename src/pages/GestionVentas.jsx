import { useState } from 'react';
import './GestionVentas.css';
import Navbar from '../components/Navbar';
import Pedidos from './Pedidos';

function GestionVentas() {
  const [active, setActive] = useState('pedidos');

  return (
    <div className="gestion-ventas-page">
      <Navbar />
      <div className="gestion-ventas__content">
        <aside className="gestion-ventas__sidebar">
          <h2 className="gestion-ventas__title">Gestión de Ventas</h2>
          <nav className="gestion-ventas__nav">
            <button
              className={`btn gestion-ventas_nav-btn ${active === 'pedidos' ? 'btn--primary is-active' : ''}`}
              onClick={() => setActive('pedidos')}
            >
              Pedidos
            </button>
            <button
              className={`btn gestion-ventas_nav-btn ${active === 'reportes' ? 'btn--primary is-active' : ''}`}
              onClick={() => setActive('reportes')}
            >
              Reportes
            </button>
          </nav>
        </aside>

        <main className="gestion-ventas_main">
          {active === 'pedidos' && <Pedidos />}
          {active === 'reportes' && <div style={{padding:20}}>Sección de reportes (pendiente)</div>}
        </main>
      </div>
    </div>
  );
}

export default GestionVentas;
