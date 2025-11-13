import { useEffect, useState } from 'react';
import './CodificacionProductosModal.css';

function CodificacionProductosModal({ show, onClose, onSaved, selected }){
  const [form, setForm] = useState({ codigo_producto:'', nombre_producto:'', tipo_producto:'', talla:'', color:'', genero:'', material:'', precio_unitario:0, estado:'activo', notas:'' });
  const [errors, setErrors] = useState({});
  const apiBase = process.env.REACT_APP_API_URL || '';
  const token = sessionStorage.getItem('token');

  useEffect(()=>{
    if (selected) {
      setForm({
        codigo_producto: selected.codigo_producto || '',
        nombre_producto: selected.nombre_producto || '',
        tipo_producto: selected.tipo_producto || '',
        talla: selected.talla || '',
        color: selected.color || '',
        genero: selected.genero || '',
        material: selected.material || '',
        precio_unitario: selected.precio_unitario || 0,
        estado: selected.estado || 'activo',
        notas: selected.notas || ''
      });
      setErrors({});
    } else {
      setForm({ codigo_producto:'', nombre_producto:'', tipo_producto:'', talla:'', color:'', genero:'', material:'', precio_unitario:0, estado:'activo', notas:'' });
      setErrors({});
    }
  }, [selected, show]);

  if (!show) return null;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    // codigo_producto ahora es obligatorio
    if (!form.codigo_producto) err.codigo_producto = 'Requerido';
    if (!form.nombre_producto) err.nombre_producto = 'Requerido';
    if (!form.tipo_producto) err.tipo_producto = 'Requerido';
    if (!form.precio_unitario || Number(form.precio_unitario) <= 0) err.precio_unitario = 'Precio debe ser mayor que 0';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try{
      const method = selected ? 'PUT' : 'POST';
      const url = selected ? `${apiBase}productos/actualizar/${selected.id_producto}` : `${apiBase}productos/crear`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json', ...(token?{ Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        // Map server validation to field errors when possible
        if (body && body.message && body.message.toLowerCase().includes('codigo')) {
          setErrors(e => ({ ...e, codigo_producto: body.message }));
          return;
        }
        throw new Error(body.message || JSON.stringify(body) || 'Error');
      }
      onSaved();
    }catch(err){
      console.error('Error guardando producto', err);
      alert('Error al guardar producto: ' + (err.message || err));
    }
  };

  return (
    <div className="codificacion-productos__backdrop">
      <div className="codificacion-productos__container">
        <header className="codificacion-productos__header">
          <h3>{selected ? 'Editar producto' : 'Nuevo producto'}</h3>
          <button onClick={onClose} className="codificacion-productos__close modal-close">×</button>
        </header>

        <form className="codificacion-productos__body" onSubmit={handleSubmit}>
          <div className="codificacion-productos__group">
            <label>Código</label>
            <input name="codigo_producto" value={form.codigo_producto} onChange={handleChange} />
            {errors.codigo_producto && <small className="codificacion-productos__field-error">{errors.codigo_producto}</small>}
          </div>

          <div className="codificacion-productos__group">
            <label>Nombre</label>
            <input name="nombre_producto" value={form.nombre_producto} onChange={handleChange} />
            {errors.nombre_producto && <small className="codificacion-productos__field-error">{errors.nombre_producto}</small>}
          </div>

          <div className="codificacion-productos__row">
            <div className="codificacion-productos__group">
              <label>Tipo</label>
              <input name="tipo_producto" value={form.tipo_producto} onChange={handleChange} />
            </div>
            <div className="codificacion-productos__group">
              <label>Talla</label>
              <input name="talla" value={form.talla} onChange={handleChange} />
            </div>
          </div>

          <div className="codificacion-productos__row">
            <div className="codificacion-productos__group">
              <label>Color</label>
              <input name="color" value={form.color} onChange={handleChange} />
            </div>
            <div className="codificacion-productos__group">
              <label>Género</label>
              <input name="genero" value={form.genero} onChange={handleChange} />
            </div>
          </div>

          <div className="codificacion-productos__row">
            <div className="codificacion-productos__group">
              <label>Material</label>
              <input name="material" value={form.material} onChange={handleChange} />
            </div>
            <div className="codificacion-productos__group">
              <label>Precio unitario</label>
              <input name="precio_unitario" type="number" step="0.01" value={form.precio_unitario} onChange={e=>setForm(f=>({...f, precio_unitario: Number(e.target.value)}))} />
              {errors.precio_unitario && <small className="codificacion-productos__field-error">{errors.precio_unitario}</small>}
            </div>
          </div>

          <div className="codificacion-productos__group">
            <label>Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} />
          </div>

          <footer className="codificacion-productos__footer">
            <button type="button" onClick={onClose} className="codificacion-productos__btn codificacion-productos__btn--muted">Cancelar</button>
            <button type="submit" className="codificacion-productos__btn codificacion-productos__btn--primary">Guardar</button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default CodificacionProductosModal;
