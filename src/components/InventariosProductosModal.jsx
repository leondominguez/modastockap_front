import './InventariosProductosModal.css';
import { useEffect, useState } from 'react';
import swal from '../utils/swal';

function InventariosProductosModal({ show, onClose, onSaved, selected, productos = [] }){
  const apiBase = process.env.REACT_APP_API_URL || '';
  const token = sessionStorage.getItem('token');

  const [form, setForm] = useState({ codigo_producto: '', cantidad_disponible: 0, ubicacion: '', fecha_entrada: '', estado: 'activo', notas: '' });

  useEffect(()=>{
    if (selected) {
      setForm({
        codigo_producto: selected.codigo_producto,
        cantidad_disponible: selected.cantidad_disponible ?? 0,
        ubicacion: selected.ubicacion || '',
        fecha_entrada: selected.fecha_entrada || '',
        estado: selected.estado || 'activo',
        notas: selected.notas || ''
      });
    } else {
      setForm({ codigo_producto: '', cantidad_disponible: 0, ubicacion: '', fecha_entrada: '', estado: 'activo', notas: '' });
    }
  }, [selected, show]);

  if (!show) return null;

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const url = selected ? `${apiBase}inventarios/actualizar/${selected.id_inventario}` : `${apiBase}inventarios/crear`;
      const method = selected ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      swal({ icon: 'success', title: 'Guardado', text: 'Inventario guardado correctamente', timer:1200, showConfirmButton:false });
      onSaved && onSaved(data);
      onClose && onClose();
    }catch(err){
      console.error('Error guardando inventario', err);
      swal({ icon: 'error', title: 'Error', text: err.message || 'No se pudo guardar' });
    }
  };

  return (
    <div className="inventario-modal-backdrop" role="dialog" aria-modal="true">
      <div className="inventario-modal-card" aria-labelledby="inventario-modal-title">
      <button className="inventario-modal-close modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <h3 id="inventario-modal-title">{selected ? 'Editar inventario' : 'Nuevo inventario'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Código producto</label>
          <select required value={form.codigo_producto} onChange={e=>handleChange('codigo_producto', e.target.value)}>
            <option value="">-- Seleccione código --</option>
            {productos.map(p => (<option key={p.id_producto} value={p.codigo_producto}>{p.codigo_producto} — {p.nombre_producto}</option>))}
          </select>

          <label>Cantidad disponible</label>
          <input type="number" min={0} value={form.cantidad_disponible} onChange={e=>handleChange('cantidad_disponible', Number(e.target.value))} required />

          <label>Ubicación</label>
          <input value={form.ubicacion} onChange={e=>handleChange('ubicacion', e.target.value)} />

          <label>Fecha entrada</label>
          <input type="date" value={form.fecha_entrada} onChange={e=>handleChange('fecha_entrada', e.target.value)} />

          <label>Estado</label>
          <select value={form.estado} onChange={e=>handleChange('estado', e.target.value)}>
            <option value="activo">activo</option>
            <option value="reservado">reservado</option>
            <option value="agotado">agotado</option>
          </select>

          <label>Notas</label>
          <textarea value={form.notas} onChange={e=>handleChange('notas', e.target.value)} />

          <div className="inventario-modal-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn--primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventariosProductosModal;
