import { useEffect, useState, useCallback } from "react";
import InsumosCatalogoModal from "../components/InsumosCatalogoModal";
import Swal from "sweetalert2";
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
    const confirm = await Swal.fire({
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
      Swal.fire({ icon: 'success', title: `Insumo ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'}`, timer: 1400, showConfirmButton: false });
      fetchList();
    } catch (err) {
      console.error('Error cambiar estado insumo:', err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Ocurrió un error' });
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
          <input placeholder="Buscar por código o nombre" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={openNew} className="insumos-catalogo__btn">Nuevo insumo</button>
        </div>
      </header>

      <section className="insumos-catalogo__list">
        {loading && <div>Cargando...</div>}
        {!loading && filtered.length === 0 && <div>No hay insumos.</div>}
        {!loading && filtered.length > 0 && (
          <table className="insumos__table">
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
                    <td className="insumos__desc">{it.descripcion || '-'}</td>
                    <td>{it.tipo_insumo}</td>
                    <td>{it.unidad_medida}</td>
                    <td>{it.estado}</td>
                  <td>
                    <button onClick={() => openEdit(it)} className="insumos__action clientes__action clientes__action--edit">Editar</button>
                    <button onClick={() => handleToggleEstado(it)} className={`insumos__action clientes__action ${it.estado === 'activo' ? 'clientes__action--delete' : 'clientes__action--activate'}`}>
                      {it.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <InsumosCatalogoModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} />
    </div>
  );
}

export default InsumosCatalogo;
