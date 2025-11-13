import { useEffect, useState, useCallback } from "react";
import InsumosProveedorModal from "../components/InsumosProveedorModal";
import "./InsumosProveedor.css";
import swal from '../utils/swal';

function InsumosProveedor(){
  const [vinculos, setVinculos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");

  const apiBase = process.env.REACT_APP_API_URL || "";
  const token = sessionStorage.getItem("token");

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      // traer vínculos, proveedores e insumos en paralelo para poder mostrar datos legibles
      const [rV, rP, rI] = await Promise.all([
        fetch(`${apiBase}insumos/proveedor/listar`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBase}proveedores/listar`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBase}insumos/catalogo/listar`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dV = await rV.json();
      const dP = await rP.json();
      const dI = await rI.json();
      setVinculos(dV.vinculos || dV);
      setProveedores(dP.proveedores || dP);
      setInsumos(dI.insumos || dI);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [apiBase, token]);

  useEffect(()=>{ fetchList(); },[fetchList]);

  const openNew = () => { setSelected(null); setShowModal(true); };
  const openEdit = (v) => { setSelected(v); setShowModal(true); };
  const handleSaved = () => { setShowModal(false); fetchList(); };

  const handleToggleEstado = async (v) => {
    try {
      const accion = v.estado === 'activo' || v.estado === 1 ? 'Desactivar' : 'Activar';
      const confirm = await swal({
        title: `¿${accion} vínculo?`,
        text: `El vínculo del insumo ${v.id_insumo} con el proveedor será ${accion.toLowerCase()}.`,
        icon: 'warning',
        showCancelButton: true
      });
      if (!confirm.isConfirmed) return;
      const nuevoEstado = (v.estado === 'activo' || v.estado === 1) ? '0' : '1';
      const id = v.id_insumo_proveedor || v.id;
      const url = `${apiBase}insumos/proveedor/cambiarEstado/${id}?estado=${nuevoEstado}`;
      const res = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Error cambiando estado');
      swal({ icon: 'success', title: `Vínculo ${nuevoEstado === '1' ? 'activado' : 'desactivado'}`, timer: 1200, showConfirmButton: false });
      fetchList();
    } catch (err) { console.error('Error toggle estado vínculo:', err); swal({ icon: 'error', title: 'Error', text: err.message || '' }); }
  };

  const filtered = vinculos.filter(it => {
    if (!q) return true;
    const s = q.toLowerCase();
    const prov = proveedores.find(p => (p.id_proveedor || p.id) === it.id_proveedor);
    const provText = prov ? ((prov.numero_documento ? prov.numero_documento + ' ' : '') + (prov.razon_social || prov.nombre_contacto || '')) : (''+ (it.id_proveedor || ''));
    const ins = insumos.find(i => (i.id_insumo || i.id) === it.id_insumo);
    const insText = ins ? (((ins.codigo_insumo||'') + ' ' + (ins.nombre_insumo||'')).toLowerCase()) : (''+ (it.id_insumo || '') );
    return (''+it.id_insumo).includes(s) || insText.includes(s) || (''+it.id_proveedor).includes(s) || provText.toLowerCase().includes(s) || (it.notas||'').toLowerCase().includes(s);
  });

  return (
    <div className="insumos-proveedor">
      <header className="insumos-proveedor__header">
        <h1>Insumos por proveedor</h1>
        <div className="insumos-proveedor__controls">
          <input aria-label="Buscar vínculos" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={openNew} className="btn btn--primary insumos-proveedor__btn">Nuevo vínculo</button>
        </div>
      </header>

      <section className="insumos-proveedor__list">
        <div className="insumos-proveedor__table-wrapper">
          {loading && <div>Cargando...</div>}
          {!loading && filtered.length === 0 && <div>No hay vínculos.</div>}
          {!loading && filtered.length > 0 && (
            <table className="insumos-proveedor__table table cabecera_estatica">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Código Insumo</th>
                  <th>Nombre Insumo</th>
                  <th>Proveedor</th>
                  <th>NIT</th>
                  <th>Precio</th>
                  <th>Condiciones</th>
                  <th>Notas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id_insumo_proveedor}>
                    <td>{v.id_insumo}</td>
                    <td>{(() => { const i = insumos.find(x => (x.id_insumo||x.id) === v.id_insumo); return i ? i.codigo_insumo : ''; })()}</td>
                    <td>{(() => { const i = insumos.find(x => (x.id_insumo||x.id) === v.id_insumo); return i ? i.nombre_insumo : ''; })()}</td>
                    <td>{(() => { const p = proveedores.find(x => (x.id_proveedor||x.id) === v.id_proveedor); return p ? (p.razon_social || p.nombre_contacto || '') : v.id_proveedor; })()}</td>
                    <td>{(() => { const p = proveedores.find(x => (x.id_proveedor||x.id) === v.id_proveedor); return p ? (p.numero_documento || '') : ''; })()}</td>
                    <td>{v.precio_unitario}</td>
                    <td>{v.condiciones_pago || ''}</td>
                    <td>{v.notas || ''}</td>
                    <td>{v.estado}</td>
                    <td>
                      <button aria-label={`Editar vínculo ${v.id_insumo_proveedor || v.id}`} className="btn insumos-proveedor__action insumos-proveedor__action--edit" onClick={()=>openEdit(v)}>Editar</button>
                      <button aria-label={`${v.estado === 'activo' || v.estado === 1 ? 'Desactivar' : 'Activar'} vínculo ${v.id_insumo_proveedor || v.id}`} className={`btn insumos-proveedor__action ${v.estado === 'activo' || v.estado === 1 ? 'insumos-proveedor__action--delete' : 'insumos-proveedor__action--activate'}`} onClick={()=> handleToggleEstado(v)}>{v.estado === 'activo' || v.estado === 1 ? 'Desactivar' : 'Activar'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <InsumosProveedorModal show={showModal} onClose={() => setShowModal(false)} onSaved={handleSaved} selected={selected} />
    </div>
  );
}

export default InsumosProveedor;
