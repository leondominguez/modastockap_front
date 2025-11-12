import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import './CodificacionProductos.css';
import './InsumosCatalogo.css';
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
    const confirmResult = await Swal.fire({
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
      Swal.fire({ icon: 'success', title: `Producto ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`, timer: 1400, showConfirmButton: false });
      fetchList();
    }catch(err){ console.error('Error cambiar estado producto', err); Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Ocurrió un error' }); }
  };

  const filtered = productos.filter(it => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (it.nombre_producto || '').toLowerCase().includes(s) || (it.codigo_producto || '').toLowerCase().includes(s);
  });

  return (
    <div className="insumos-catalogo">
      <header className="insumos-catalogo__header">
        <h1>Codificación de productos</h1>
        <div className="insumos-catalogo__controls">
          <input aria-label="Buscar productos" placeholder="Buscar por código o descripción" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={openNew} className="btn btn--primary insumos-catalogo__btn">Nuevo producto</button>
        </div>
      </header>

      <section className="insumos-catalogo__list">
        {loading && <div>Cargando...</div>}
        {!loading && filtered.length === 0 && <div>No hay productos.</div>}
        {!loading && filtered.length > 0 && (
          <table className="insumos__table">
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
                    <button aria-label={`Editar producto ${p.id_producto || p.id}`} onClick={() => openEdit(p)} className="btn insumos__action insumos__action--edit">Editar</button>
                    <button aria-label={`${p.estado === 'activo' ? 'Desactivar' : 'Activar'} producto ${p.id_producto || p.id}`} onClick={() => handleToggleEstado(p)} className={`btn insumos__action ${p.estado === 'activo' ? 'insumos__action--delete' : 'insumos__action--activate'}`}>
                      {p.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <CodificacionProductosModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} />
    </div>
  );
}

export default CodificacionProductos;
