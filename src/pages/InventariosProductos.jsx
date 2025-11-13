import { useEffect, useState, useCallback, useMemo } from 'react';
import './InventariosProductos.css';
import './InsumosCatalogo.css';
import InventariosProductosModal from '../components/InventariosProductosModal';
import swal from '../utils/swal';

function InventariosProductos(){
  const apiBase = process.env.REACT_APP_API_URL || '';
  const token = sessionStorage.getItem('token');

  const [inventarios, setInventarios] = useState([]);
  const [productos, setProductos] = useState([]); // para select de códigos
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');

  const fetchList = useCallback(async ()=>{
    setLoading(true);
    try{
      const res = await fetch(`${apiBase}inventarios/listar`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      const data = await res.json();
      if (Array.isArray(data)) setInventarios(data);
      else if (data.inventarios) setInventarios(data.inventarios);
      else setInventarios([]);
    }catch(err){ console.error('Error cargando inventarios', err); setInventarios([]); }
    finally{ setLoading(false); }
  }, [apiBase, token]);

  const fetchProductos = useCallback(async ()=>{
    try{
      const res = await fetch(`${apiBase}productos/listar`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.productos || []);
      setProductos(list);
    }catch(err){ console.error('Error cargando productos', err); setProductos([]); }
  }, [apiBase, token]);

  useEffect(()=>{ fetchList(); fetchProductos(); }, [fetchList, fetchProductos]);

  const openNew = ()=>{ setSelected(null); setShowModal(true); };
  const openEdit = (i)=>{ setSelected(i); setShowModal(true); };
  const handleSaved = ()=>{ setShowModal(false); fetchList(); };

  const handleToggleEstado = async (inv) => {
    const accion = inv.estado === 'activo' ? 'Desactivar' : 'Activar';
    const confirmResult = await swal({
      title: `¿${accion} registro de inventario?`,
      text: `El inventario con código ${inv.codigo_producto} será ${accion.toLowerCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });
    if (!confirmResult.isConfirmed) return;

    try {
      const nuevoEstado = inv.estado === 'activo' ? 'inactivo' : 'activo';
      const res = await fetch(`${apiBase}inventarios/actualizar/${inv.id_inventario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar estado');
      swal({ icon: 'success', title: 'Actualizado', text: `Estado cambiado a ${nuevoEstado}`, timer: 1200, showConfirmButton: false });
      fetchList();
    } catch (err) {
      console.error('Error cambiando estado inventario', err);
      swal({ icon: 'error', title: 'Error', text: err.message || 'No se pudo actualizar estado' });
    }
  };

  const filtered = inventarios.filter(it => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (it.codigo_producto || '').toLowerCase().includes(s) || (it.ubicacion || '').toLowerCase().includes(s);
  });

  // mapa rápido codigo_producto => nombre_producto
  const productosMap = useMemo(() => {
    const m = {};
    productos.forEach(p => {
      if (p && p.codigo_producto) m[p.codigo_producto] = p.nombre_producto || '';
    });
    return m;
  }, [productos]);

    return (
    <div className="inventarios-productos">
      <header className="inventarios-productos__header">
        <h1>Inventario de productos terminados</h1>
        <div className="inventarios-productos__controls">
          <input placeholder="Buscar por código o ubicación" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={openNew} className="inventarios-productos__btn btn btn--primary">Nuevo registro</button>
        </div>
      </header>

      <section className="inventarios-productos__list">
        {loading && <div>Cargando...</div>}
        {!loading && filtered.length === 0 && <div>No hay registros de inventario.</div>}
        {!loading && filtered.length > 0 && (
          <div className="table-responsive inventarios-productos__table-wrapper">
          <table className="inventarios-productos__table table cabecera_estatica">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre producto</th>
                <th>Existencias</th>
                <th>Ubicación</th>
                <th>Fecha entrada</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id_inventario}>
                  <td>{inv.codigo_producto}</td>
                  <td>{productosMap[inv.codigo_producto] || '-'}</td>
                  <td>{inv.cantidad_disponible}</td>
                  <td>{inv.ubicacion || '-'}</td>
                  <td>{inv.fecha_entrada || '-'}</td>
                  <td>{inv.estado}</td>
                  <td className="inventarios-productos__desc">{inv.notas || '-'}</td>
                  <td>
                    <button onClick={() => openEdit(inv)} className="inventarios-productos__action inventarios-productos__action--edit btn">Editar</button>
                    <button onClick={() => handleToggleEstado(inv)} className={`btn inventarios-productos__action ${inv.estado === 'activo' ? 'inventarios-productos__action--delete' : 'inventarios-productos__action--activate'}`} style={{ marginLeft: 8 }}>
                      {inv.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>

  <InventariosProductosModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} productos={productos} />
    </div>
  );
}

export default InventariosProductos;
