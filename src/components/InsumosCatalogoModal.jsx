import { useEffect, useState } from "react";
import "./InsumosCatalogoModal.css";

function InsumosCatalogoModal({ show, onClose, onSaved, selected }) {
	const [form, setForm] = useState({
		codigo_insumo: "",
		nombre_insumo: "",
		tipo_insumo: "",
		unidad_medida: "",
		descripcion: "",
		estado: "activo",
		notas: ""
	});
	const [errors, setErrors] = useState({});
	const apiBase = process.env.REACT_APP_API_URL || "";
	const token = sessionStorage.getItem("token");

	useEffect(() => {
		if (selected) {
			setForm({
				codigo_insumo: selected.codigo_insumo || "",
				nombre_insumo: selected.nombre_insumo || "",
				tipo_insumo: selected.tipo_insumo || "",
				unidad_medida: selected.unidad_medida || "",
				descripcion: selected.descripcion || "",
				estado: selected.estado || "activo",
				notas: selected.notas || ""
			});
			setErrors({});
		} else {
			setForm({ codigo_insumo:'', nombre_insumo:'', tipo_insumo:'', unidad_medida:'', descripcion:'', estado:'activo', notas:'' });
			setErrors({});
		}
	}, [selected, show]);

	if (!show) return null;

	const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

	const validate = () => {
		const err = {};
		if (!form.codigo_insumo) err.codigo_insumo = 'Requerido';
		if (!form.nombre_insumo) err.nombre_insumo = 'Requerido';
		if (!form.tipo_insumo) err.tipo_insumo = 'Requerido';
		if (!form.unidad_medida) err.unidad_medida = 'Requerido';
		setErrors(err);
		return Object.keys(err).length === 0;
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		if (!validate()) return;
		try {
			if (!token) throw new Error('NO_TOKEN');
			const method = selected ? 'PUT' : 'POST';
			const url = selected ? `${apiBase}insumos/catalogo/actualizar/${selected.id_insumo}` : `${apiBase}insumos/catalogo/crear`;
			console.debug('Enviando petición', { method, url, body: form });
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify(form)
			});
			if (!res.ok) {
				let errBody = {};
				try { errBody = await res.json(); } catch(e) { errBody = { text: await res.text().catch(()=>'') }; }
				console.debug('Respuesta fallida', { status: res.status, body: errBody });
				const serverMsg = errBody.message || errBody.error || errBody.text || JSON.stringify(errBody);
				throw new Error(`(${res.status}) ${serverMsg}`);
			}
			onSaved();
		} catch (err) {
			console.error('Error guardando insumo:', err);
			if (err.message === 'NO_TOKEN') {
				alert('No autorizado: token de sesión no encontrado. Inicia sesión.');
				return;
			}
			alert('Error al guardar: ' + (err.message || 'desconocido'));
		}
	};

	return (
		<div className="modal__backdrop">
			<div className="modal__container">
				<header className="modal__header">
					<h3>{selected ? 'Editar insumo' : 'Nuevo insumo'}</h3>
					<button onClick={onClose} className="modal__close">×</button>
				</header>

				<form className="modal__body" onSubmit={handleSubmit}>
					<div className="modal__group">
						<label>Código</label>
						<input name="codigo_insumo" value={form.codigo_insumo} onChange={handleChange} />
						{errors.codigo_insumo && <small className="field-error">{errors.codigo_insumo}</small>}
					</div>

					<div className="modal__group">
						<label>Nombre</label>
						<input name="nombre_insumo" value={form.nombre_insumo} onChange={handleChange} />
						{errors.nombre_insumo && <small className="field-error">{errors.nombre_insumo}</small>}
					</div>

					<div className="modal__row">
						<div className="modal__group">
							<label>Tipo</label>
							<input name="tipo_insumo" value={form.tipo_insumo} onChange={handleChange} />
						</div>
						<div className="modal__group">
							<label>Unidad</label>
							<input name="unidad_medida" value={form.unidad_medida} onChange={handleChange} />
						</div>
					</div>

					<div className="modal__group">
						<label>Descripción</label>
						<textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
					</div>

					<div className="modal__group">
						<label>Notas</label>
						<textarea name="notas" value={form.notas} onChange={handleChange} />
					</div>

					<footer className="modal__footer">
						<button type="button" onClick={onClose} className="modal__btn modal__btn--muted">Cancelar</button>
						<button type="submit" className="modal__btn modal__btn--primary">Guardar</button>
					</footer>
				</form>
			</div>
		</div>
	);
}

export default InsumosCatalogoModal;
