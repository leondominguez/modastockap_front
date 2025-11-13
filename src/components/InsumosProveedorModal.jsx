import { useEffect, useState } from "react";
import "./InsumosProveedorModal.css";

function InsumosProveedorModal({ show, onClose, onSaved, selected }) {
	const [form, setForm] = useState({ id_insumo: '', id_proveedor: '', precio_unitario:'', condiciones_pago:'', estado:'activo', notas:'' });
	const [insumos, setInsumos] = useState([]);
	const [proveedores, setProveedores] = useState([]);
	const apiBase = process.env.REACT_APP_API_URL || '';
	const token = sessionStorage.getItem('token');

	useEffect(()=>{
			const load = async ()=>{
				try {
					const [r1, r2] = await Promise.all([
						fetch(`${apiBase}insumos/catalogo/listar`, { headers: { Authorization: `Bearer ${token}` } }),
						fetch(`${apiBase}proveedores/listar`, { headers: { Authorization: `Bearer ${token}` } })
					]);
					const d1 = await r1.json();
					const d2 = await r2.json();
					setInsumos(d1.insumos || d1);
					setProveedores(d2.proveedores || d2);
				} catch (err) { console.error(err); }
			};
		if (show) load();
	}, [show, apiBase, token]);

	useEffect(()=>{
		if (selected) setForm({ id_insumo:selected.id_insumo, id_proveedor:selected.id_proveedor, precio_unitario:selected.precio_unitario, condiciones_pago:selected.condiciones_pago, estado:selected.estado||'activo', notas:selected.notas||'' });
		else setForm({ id_insumo:'', id_proveedor:'', precio_unitario:'', condiciones_pago:'', estado:'activo', notas:'' });
	}, [selected, show]);

	if (!show) return null;

	const handleChange = (e) => setForm(f=>({...f, [e.target.name]: e.target.value }));

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		try {
			const method = selected ? 'PUT' : 'POST';
			if (!token) throw new Error('NO_TOKEN');
			const url = selected ? `${apiBase}insumos/proveedor/actualizar/${selected.id_insumo_proveedor}` : `${apiBase}insumos/proveedor/crear`;
			console.debug('Enviando petición vínculo', { method, url, body: form });
			const res = await fetch(url, { method, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(form) });
			if (!res.ok) {
				let errBody = {};
				try { errBody = await res.json(); } catch(e) { errBody = { text: await res.text().catch(()=>'') }; }
				console.debug('Respuesta fallida vínculo', { status: res.status, body: errBody });
				throw new Error(`(${res.status}) ${errBody.message || errBody.error || errBody.text || JSON.stringify(errBody)}`);
			}
			onSaved && onSaved();
			onClose && onClose();
		} catch (err) { console.error(err); alert(err.message); }
	};

	return (
		<div className="insumos-proveedor__backdrop" role="dialog" aria-modal="true">
			<div className="insumos-proveedor__container" aria-labelledby="insumos-proveedor-title">
				<header className="insumos-proveedor__header">
					<h3 id="insumos-proveedor-title">{selected ? 'Editar vínculo' : 'Nuevo vínculo proveedor-insumo'}</h3>
					<button onClick={onClose} aria-label="Cerrar" className="insumos-proveedor__close modal-close">×</button>
				</header>
				<form className="insumos-proveedor__body" onSubmit={handleSubmit}>
					<div className="insumos-proveedor__group">
						<label>Insumo</label>
						<select name="id_insumo" value={form.id_insumo} onChange={handleChange}>
							<option value="">-- Seleccione --</option>
							{insumos.map(i=> <option key={i.id_insumo} value={i.id_insumo}>{i.codigo_insumo} - {i.nombre_insumo}</option>)}
						</select>
					</div>

					<div className="insumos-proveedor__group">
						<label>Proveedor</label>
						<select name="id_proveedor" value={form.id_proveedor} onChange={handleChange}>
							<option value="">-- Seleccione --</option>
							{proveedores.map(p=> <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>)}
						</select>
					</div>

					<div className="insumos-proveedor__group">
						<label>Precio unitario</label>
						<input name="precio_unitario" value={form.precio_unitario} onChange={handleChange} />
					</div>

					<div className="insumos-proveedor__group">
						<label>Condiciones de pago</label>
						<input name="condiciones_pago" value={form.condiciones_pago} onChange={handleChange} />
					</div>

					<div className="insumos-proveedor__group">
						<label>Notas</label>
						<textarea name="notas" value={form.notas} onChange={handleChange} />
					</div>

					<footer className="insumos-proveedor__footer">
						<button type="button" onClick={onClose} className="insumos-proveedor__btn insumos-proveedor__btn--muted">Cancelar</button>
						<button type="submit" className="insumos-proveedor__btn insumos-proveedor__btn--primary">Guardar</button>
					</footer>
				</form>
			</div>
		</div>
	);
}

export default InsumosProveedorModal;
