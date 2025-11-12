import { useState } from 'react';
import './Ventas.css';
import Navbar from '../components/Navbar';
import Pedidos from './Pedidos';

function Ventas() {
  const [active, setActive] = useState('pedidos');

  return (
    <div className="ventas-page">
      <Navbar />
      <div className="ventas__content">
        <aside className="ventas__sidebar">
          <h2 className="ventas__title">Gestión de Ventas</h2>
          <nav className="ventas__nav">
            <button
              className={`btn ventas__nav-btn ${active === 'pedidos' ? 'btn--primary is-active' : ''}`}
              onClick={() => setActive('pedidos')}
            >
              Pedidos
            </button>
            <button
              className={`btn ventas__nav-btn ${active === 'reportes' ? 'btn--primary is-active' : ''}`}
              onClick={() => setActive('reportes')}
            >
              Reportes
            </button>
          </nav>
        </aside>

        <main className="ventas__main">
          {active === 'pedidos' && <Pedidos />}
          {active === 'reportes' && <div style={{padding:20}}>Sección de reportes (pendiente)</div>}
        </main>
      </div>
    </div>
  );
}

export default Ventas;
