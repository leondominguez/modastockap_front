import { useEffect, useState } from 'react';
import './Pedidos.css'; // Asegúrate de que la importación sea correcta

// --- Componente del Modal de Búsqueda de Productos ---
// --- Componente del Modal de Búsqueda de Productos (Versión Actualizada) ---
function ProductSearchModal({ isOpen, onClose, productos, onSelectProduct, onCreateNewProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productos);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(productos);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const results = productos.filter(p =>
        p.nombre_producto.toLowerCase().includes(lowercasedTerm) ||
        String(p.id_producto).toLowerCase().includes(lowercasedTerm)
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, productos]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (product) => {
    onSelectProduct(product);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNewProduct(searchTerm);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Buscar Producto</h4>
          <button onClick={onClose} className="btn btn--danger">&times;</button>
        </div>
        <div className="modal-body">
          <div className="search-bar">
            <label>Buscar:</label>
            <input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="table-responsive">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Valor Unitario</th>
                  <th className="action-cell">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 && filteredProducts.map(p => (
                  <tr key={p.id_producto}>
                    <td>{p.id_producto}</td>
                    <td>{p.nombre_producto}</td>
                    <td>${Number(p.precio_unitario).toFixed(2)}</td>
                    <td className="action-cell">
                      <button onClick={() => handleSelect(p)} className="btn btn--success">Adicionar</button>
                    </td>
                  </tr>
                ))}

                {/* --- LÓGICA ACTUALIZADA --- */}
                {/* Se muestra si no hay resultados y el usuario ha escrito algo */}
                {filteredProducts.length === 0 && searchTerm !== '' && (
                  <tr>
                    <td colSpan="4" className="no-results-cell">
                      <span>No se encontraron productos para "<strong>{searchTerm}</strong>".</span>
                      <button onClick={handleCreateNew} className="btn btn--primary">
                        Adicionar como Nuevo Producto
                      </button>
                    </td>
                  </tr>
                )}

                {/* Se muestra si no hay resultados y el campo de búsqueda está vacío */}
                {productos.length === 0 && searchTerm === '' && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No hay productos para mostrar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Componente Principal de Pedidos ---
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

  const initialItem = { id_producto: '', descripcion: '', talla: '', cantidad: 1, precio_unitario: 0, subtotal: 0 };
  const [items, setItems] = useState([initialItem]);

  const [creating, setCreating] = useState(false);
  const [createdPedido, setCreatedPedido] = useState(null);
  const [error, setError] = useState(null);

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  useEffect(() => {
    fetch(`${apiBase}/clientes/listar`).then(r => r.json()).then(data => setClientes(data.clientes ?? data)).catch(() => setClientes([]));
    fetch(`${apiBase}/productos/listar`).then(r => r.json()).then(data => setProductos(data ?? [])).catch(() => setProductos([]));
  }, [apiBase]);

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const next = [...prev];
      let currentItem = { ...next[index], [field]: value };

      if (field === 'id_producto') {
        const p = productos.find(x => String(x.id_producto) === String(value));
        currentItem.precio_unitario = p ? Number(p.precio_unitario) : 0;
        if (!currentItem.descripcion) { currentItem.descripcion = p ? p.nombre_producto : ''; }
      }

      const cantidad = Number(currentItem.cantidad || 0);
      const precio = Number(currentItem.precio_unitario || 0);
      currentItem.subtotal = Number((cantidad * precio).toFixed(2));

      next[index] = currentItem;
      return next;
    });
  };

  const addItem = () => setItems(prev => [...prev, initialItem]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const totalEstimado = items.reduce((s, it) => s + Number(it.subtotal || 0), 0).toFixed(2);

  // --- Lógica del Modal ---
  const openProductSearch = (index) => {
    setCurrentItemIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectProductFromModal = (product) => {
    if (currentItemIndex !== null) {
      handleItemChange(currentItemIndex, 'id_producto', product.id_producto);
    }
  };

  const handleCreateNewProductFromModal = (description) => {
    const newItem = {
      ...initialItem,
      id_producto: '', // Se deja vacío para indicar que es un producto nuevo
      descripcion: description, // Se pre-llena con el texto buscado
    };
    // Añade la nueva fila a la tabla
    setItems(prev => [...prev, newItem]);
  };

  // ... (handleSubmit y otra lógica sin cambios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const body = {
        id_cliente: form.id_cliente,
        creado_por: form.creado_por,
        notas: form.notas,
        detalles: items.map(it => ({
          id_producto: it.id_producto,
          cantidad: Number(it.cantidad),
          precio_unitario: Number(it.precio_unitario),
          notas: it.descripcion,
          talla: it.talla
        }))
      };

      const res = await fetch(`${apiBase}/pedidos/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(err.message || 'Error creando pedido');
      }

      const data = await res.json();
      setCreatedPedido(data);
      setItems([initialItem]);
      setForm({ ...form, id_cliente: '', notas: '' });

    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <ProductSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productos={productos}
        onSelectProduct={handleSelectProductFromModal}
        onCreateNewProduct={handleCreateNewProductFromModal}

      />

      <div className="pedidos-page">
        <form onSubmit={handleSubmit} className="pedido-card">

          <header className="pedido-header">
            <div className="datos-pedido">
              <label>Datos del Pedido</label>
              <select required value={form.id_cliente} onChange={e => setForm({ ...form, id_cliente: e.target.value })}>
                <option value="">-- Seleccione un Cliente --</option>
                {clientes.map(c => (<option key={c.id_cliente} value={c.id_cliente}>{c.nombre} ({c.numero_documento})</option>))}
              </select>
            </div>
            <div className="total-container">
              <label>Total</label>
              <div className="total-display">${totalEstimado}</div>
            </div>
          </header>

          <main className="pedido-body">
            <div className="add-item-container">
              <button type="button" className="btn btn--secondary" onClick={addItem} aria-label="Adicionar producto">Adicionar Producto</button>
            </div>

            <div className="table-responsive">
              <table className="items-table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Código (Producto)</th>
                    <th style={{ width: '25%' }}>Descripción (Editable)</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Valor Unitario</th>
                    <th>Subtotal</th>
                    <th className="action-cell">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => {
                    const selectedProduct = productos.find(p => String(p.id_producto) === String(it.id_producto));
                    return (
                      <tr key={idx}>
                        <td className="product-selector-cell">
                          <div className={`product-display ${!selectedProduct ? 'placeholder' : ''}`}>
                            {selectedProduct ? selectedProduct.nombre_producto : 'Ninguno seleccionado'}
                          </div>
                          <button type="button" className="btn btn--secondary" onClick={() => openProductSearch(idx)}>Buscar</button>
                        </td>
                        <td><textarea value={it.descripcion} onChange={e => handleItemChange(idx, 'descripcion', e.target.value)} rows="1"></textarea></td>
                        <td><input type="text" value={it.talla} onChange={e => handleItemChange(idx, 'talla', e.target.value)} /></td>
                        <td><input type="number" min="1" value={it.cantidad} onChange={e => handleItemChange(idx, 'cantidad', e.target.value)} /></td>
                        <td><input type="number" step="0.01" value={it.precio_unitario} onChange={e => handleItemChange(idx, 'precio_unitario', e.target.value)} /></td>
                        <td className="subtotal-cell">${Number(it.subtotal).toFixed(2)}</td>
                        <td className="action-cell"><button type="button" className="btn btn--danger" onClick={() => removeItem(idx)}>Eliminar</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </main>

          <footer className="pedido-footer">
            <div className="notas-container">
              <label>Notas Generales del Pedido</label>
              <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
            </div>
            <div className="actions">
              <button className="btn btn--primary" type="submit" disabled={creating} aria-label="Crear pedido">{creating ? 'Creando...' : 'Crear Pedido'}</button>
            </div>
          </footer>

          {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
          {createdPedido && (
            <div className="created-pedido">
              <h4>Pedido Creado Exitosamente</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(createdPedido, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Pedidos;
