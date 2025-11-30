import { useEffect, useState, useCallback } from "react";
import InsumosCatalogoModal from "../../components/InsumosCatalogoModal";
import swal from '../../utils/swal';
import "./InsumosCatalogo.css";

function InsumosCatalogo() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");

  const apiBase = process.env.REACT_APP_API_URL || "";
  const token = sessionStorage.getItem("token");

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}insumos/catalogo/listar`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setInsumos(data.insumos || data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [apiBase, token]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const openNew = () => { setSelected(null); setShowModal(true); };
  const openEdit = (i) => { setSelected(i); setShowModal(true); };

  const handleSaved = () => { setShowModal(false); fetchList(); };

  const handleToggleEstado = async (insumo) => {
    const accion = insumo.estado === 'activo' ? 'Desactivar' : 'Activar';
    const confirm = await swal({
      title: `¿${accion} insumo?`,
      text: `El insumo "${insumo.nombre_insumo || insumo.codigo_insumo}" será ${accion.toLowerCase()}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = sessionStorage.getItem('token');
      const nuevoEstado = insumo.estado === 'activo' ? 'inactivo' : 'activo';
      const id = insumo.id_insumo;
      const url = `${apiBase}insumos/catalogo/cambiarEstado/${id}?estado=${nuevoEstado}`;
      const res = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error((await res.json().catch(()=>({}))).message || 'Error cambiando estado');
      swal({ icon: 'success', title: `Insumo ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`, timer: 1400, showConfirmButton: false });
      fetchList();
    } catch (err) {
      console.error('Error cambiar estado insumo:', err);
      swal({ icon: 'error', title: 'Error', text: err.message || 'Ocurrió un error' });
    }
  };

  const filtered = insumos.filter(it => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (it.nombre_insumo || '').toLowerCase().includes(s) || (it.codigo_insumo || '').toLowerCase().includes(s);
  });

  return (
    <div className="insumos-catalogo">
      <header className="insumos-catalogo__header">
        <h1>Catálogo de insumos</h1>
        <div className="insumos-catalogo__controls">
          <input aria-label="Buscar insumos" placeholder="Buscar por código o nombre" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={openNew} className="btn btn--primary insumos-catalogo__btn">Nuevo insumo</button>
        </div>
      </header>

      <section className="insumos-catalogo__list">
        <div className="insumos-catalogo__table-wrapper">
          {loading && <div>Cargando...</div>}
          {!loading && filtered.length === 0 && <div>No hay insumos.</div>}
          {!loading && filtered.length > 0 && (
            <table className="insumos-catalogo__table table cabecera_estatica">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(it => (
                  <tr key={it.id_insumo}>
                    <td>{it.codigo_insumo}</td>
                    <td>{it.nombre_insumo}</td>
                    <td className="insumos-catalogo__desc">{it.descripcion || '-'}</td>
                    <td>{it.tipo_insumo}</td>
                    <td>{it.unidad_medida}</td>
                    <td>{it.estado}</td>
                    <td>
                      <button aria-label={`Editar insumo ${it.id_insumo || it.id}`} onClick={() => openEdit(it)} className="btn insumos-catalogo__action insumos-catalogo__action--edit">Editar</button>
                      <button aria-label={`${it.estado === 'activo' ? 'Desactivar' : 'Activar'} insumo ${it.id_insumo || it.id}`} onClick={() => handleToggleEstado(it)} className={`btn insumos-catalogo__action ${it.estado === 'activo' ? 'insumos-catalogo__action--delete' : 'insumos-catalogo__action--activate'}`}>
                        {it.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <InsumosCatalogoModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} />
    </div>
  );
}

export default InsumosCatalogo;
