import { useEffect, useState, useCallback } from 'react';
import swal from '../utils/swal';
import './CodificacionProductos.css';
import CodificacionProductosModal from '../components/CodificacionProductosModal';

function CodificacionProductos(){
  const apiBase = process.env.REACT_APP_API_URL || '';
  const token = sessionStorage.getItem('token');

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');

  const fetchList = useCallback(async ()=>{
    setLoading(true);
    try{
      const res = await fetch(`${apiBase}productos/listar`, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      const data = await res.json();
      if (Array.isArray(data)) setProductos(data);
      else if (data.productos) setProductos(data.productos);
      else setProductos([]);
    }catch(err){ console.error('Error cargando productos', err); setProductos([]); }
    finally{ setLoading(false); }
  }, [apiBase, token]);

  useEffect(()=>{ fetchList(); }, [fetchList]);

  const openNew = ()=>{ setSelected(null); setShowModal(true); };
  const openEdit = (p)=>{ setSelected(p); setShowModal(true); };
  const handleSaved = ()=>{ setShowModal(false); fetchList(); };

  const handleToggleEstado = async (p)=>{
    const accion = p.estado === 'activo' ? 'Desactivar' : 'Activar';
    const confirmResult = await swal({
      title: `¿${accion} producto?`,
      text: `El producto "${p.nombre_producto || p.id_producto}" será ${accion.toLowerCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });
    if (!confirmResult.isConfirmed) return;
    try{
      const nuevoEstado = p.estado === 'activo' ? 'inactivo' : 'activo';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiBase}productos/cambiarEstado/${p.id_producto}?estado=${nuevoEstado}`, { method: 'PATCH', headers });
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || 'Error cambiando estado');
      swal({ icon: 'success', title: `Producto ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`, timer: 1400, showConfirmButton: false });
      fetchList();
    }catch(err){ console.error('Error cambiar estado producto', err); swal({ icon: 'error', title: 'Error', text: err.message || 'Ocurrió un error' }); }
  };

  const filtered = productos.filter(it => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (it.nombre_producto || '').toLowerCase().includes(s) || (it.codigo_producto || '').toLowerCase().includes(s);
  });

  return (
    <div className="codificacion-productos">
      <header className="codificacion-productos__header">
        <h1>Codificación de productos</h1>
        <div className="codificacion-productos__controls">
          <input aria-label="Buscar productos" placeholder="Buscar por código o descripción" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={openNew} className="btn btn--primary codificacion-productos__btn">Nuevo producto</button>
        </div>
      </header>

      <section className="codificacion-productos__list">
        {loading && <div>Cargando...</div>}
        {!loading && filtered.length === 0 && <div>No hay productos.</div>}
        {!loading && filtered.length > 0 && (
          <div className="codificacion-productos__table-wrapper">
            <table className="codificacion-productos__table table cabecera_estatica">
            <thead>
              <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Talla</th>
                  <th>Color</th>
                  <th>Género</th>
                  <th>Material</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id_producto}>
                  <td>{p.codigo_producto}</td>
                  <td>{p.nombre_producto}</td>
                  <td>{p.tipo_producto}</td>
                  <td>{p.talla || '-'}</td>
                  <td>{p.color || '-'}</td>
                  <td>{p.genero || '-'}</td>
                  <td>{p.material || '-'}</td>
                  <td>{p.precio_unitario}</td>
                  <td>{p.estado}</td>
                  <td>
                    <button aria-label={`Editar producto ${p.id_producto || p.id}`} onClick={() => openEdit(p)} className="btn codificacion-productos__action codificacion-productos__action--edit">Editar</button>
                    <button aria-label={`${p.estado === 'activo' ? 'Desactivar' : 'Activar'} producto ${p.id_producto || p.id}`} onClick={() => handleToggleEstado(p)} className={`btn codificacion-productos__action ${p.estado === 'activo' ? 'codificacion-productos__action--delete' : 'codificacion-productos__action--activate'}`}>
                      {p.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </section>

      <CodificacionProductosModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} />
    </div>
  );
}

export default CodificacionProductos;
