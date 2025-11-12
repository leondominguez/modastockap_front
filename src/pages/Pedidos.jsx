import { useEffect, useState } from 'react';
import './Pedidos.css';

function Pedidos() {
  const apiBase = process.env.REACT_APP_API_URL || '';
  const token = sessionStorage.getItem('token');

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    id_cliente: '',
    creado_por: sessionStorage.getItem('usuario') ? JSON.parse(sessionStorage.getItem('usuario')).usuario : '',
    notas: ''
  });

  const [items, setItems] = useState([
    { id_producto: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }
  ]);

  const [creating, setCreating] = useState(false);
  const [createdPedido, setCreatedPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // cargar clientes y productos para selects
    fetch(`${apiBase}/clientes/listar`)
      .then(r => r.json())
      .then(data => setClientes(data.clientes ?? data))
      .catch(() => setClientes([]));

    fetch(`${apiBase}/productos/listar`)
      .then(r => r.json())
      .then(data => setProductos(data ?? []))
      .catch(() => setProductos([]));
  }, [apiBase]);

  // actualizar precio y subtotal cuando se selecciona producto o cambia cantidad
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      // si cambió el producto, ajustar precio_unitario desde productos
      if (field === 'id_producto') {
        const p = productos.find(x => String(x.id_producto) === String(value));
        next[index].precio_unitario = p ? Number(p.precio_unitario) : 0;
      }
      // recalcular subtotal
      const cantidad = Number(next[index].cantidad || 0);
      const precio = Number(next[index].precio_unitario || 0);
      next[index].subtotal = Number((cantidad * precio).toFixed(2));
      return next;
    });
  };

  const addItem = () => setItems(prev => [...prev, { id_producto: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const totalEstimado = items.reduce((s, it) => s + Number(it.subtotal || 0), 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const body = {
        id_cliente: form.id_cliente,
        creado_por: form.creado_por,
        notas: form.notas,
        detalles: items.map(it => ({ id_producto: it.id_producto, cantidad: Number(it.cantidad), precio_unitario: Number(it.precio_unitario), notas: null }))
      };

      const res = await fetch(`${apiBase}/pedidos/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(err.message || 'Error creando pedido');
      }
      const data = await res.json();
      setCreatedPedido(data);
      // resetear formulario
      setItems([{ id_producto: '', cantidad: 1, precio_unitario: 0, subtotal: 0 }]);
      setForm({ ...form, notas: '' });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="pedidos-page">
      <h3>Pedidos</h3>

      <div className="pedidos-grid">
        <section className="pedidos-form">
          <h4>Crear nuevo pedido</h4>
          <form onSubmit={handleSubmit}>
            <label>Cliente</label>
            <select required value={form.id_cliente} onChange={e => setForm({ ...form, id_cliente: e.target.value })}>
              <option value="">-- Seleccione cliente --</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} ({c.numero_documento})</option>
              ))}
            </select>

            <label>Creado por</label>
            <input value={form.creado_por} onChange={e => setForm({ ...form, creado_por: e.target.value })} />

            <label>Notas</label>
            <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />

            <h5>Items</h5>
            {items.map((it, idx) => (
              <div key={idx} className="pedido-item">
                <select required value={it.id_producto} onChange={e => handleItemChange(idx, 'id_producto', e.target.value)}>
                  <option value="">-- Seleccione producto --</option>
                  {productos.map(p => (
                    <option key={p.id_producto} value={p.id_producto}>{p.nombre_producto} - {p.precio_unitario}</option>
                  ))}
                </select>
                <input type="number" min="1" value={it.cantidad} onChange={e => handleItemChange(idx, 'cantidad', e.target.value)} />
                <input type="number" step="0.01" value={it.precio_unitario} onChange={e => handleItemChange(idx, 'precio_unitario', e.target.value)} />
                <div className="item-subtotal">{it.subtotal.toFixed ? it.subtotal.toFixed(2) : Number(it.subtotal).toFixed(2)}</div>
                <button type="button" onClick={() => removeItem(idx)}>Eliminar</button>
              </div>
            ))}

            <div style={{marginTop:8}}>
              <button type="button" onClick={addItem}>Agregar item</button>
            </div>

            <div className="pedido-total">Total estimado: <strong>{totalEstimado}</strong></div>

            <div style={{marginTop:12}}>
              <button className="btn-primary" type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear pedido'}</button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </section>

        <aside className="pedidos-current">
          <h4>Pedido en curso</h4>
          <div>Cliente: {form.id_cliente ? (clientes.find(c => String(c.id_cliente) === String(form.id_cliente))?.nombre ?? form.id_cliente) : '-'}</div>
          <div>Creado por: {form.creado_por || '-'}</div>
          <div>Notas: {form.notas || '-'}</div>
          <h5>Items</h5>
          <ul>
            {items.map((it, i) => (
              <li key={i}>{(productos.find(p => String(p.id_producto) === String(it.id_producto))?.nombre_producto ?? 'Sin producto')} - {it.cantidad} x {it.precio_unitario} = {it.subtotal.toFixed ? it.subtotal.toFixed(2) : Number(it.subtotal).toFixed(2)}</li>
            ))}
          </ul>
          <div className="pedido-total">Total: <strong>{totalEstimado}</strong></div>

          {createdPedido && (
            <div className="created-pedido">
              <h4>Pedido creado</h4>
              <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(createdPedido, null, 2)}</pre>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Pedidos;
