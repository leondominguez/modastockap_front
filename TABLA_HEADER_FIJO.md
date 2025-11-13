# Patrón: Tabla con Header Fijo

Este documento explica cómo usar el patrón de tabla con header fijo implementado en `theme.css`.

## ¿Cuándo usar este patrón?

Úsalo cuando necesites una tabla donde:
- El header debe permanecer visible mientras haces scroll
- Tienes muchos registros que requieren scroll vertical
- Quieres mantener las columnas alineadas visualmente

## Clases globales disponibles (theme.css)

- `.table-fixed-container` - Contenedor principal de la tabla
- `.table-fixed-header` - Contenedor del header fijo
- `.table-fixed-body` - Contenedor del body con scroll

## Variables CSS disponibles

```css
--table-header-bg: color de fondo del header
--table-header-color: color del texto del header
--table-border: color de los bordes
--table-fixed-header-border-bottom: borde inferior del header
--table-fixed-cell-padding: padding de las celdas (default: 12px)
--table-radius: border-radius del contenedor
--card-shadow: sombra del contenedor
```

## Estructura HTML/JSX

```jsx
<section className="mi-pagina__list table-fixed-container">
  {datos.length > 0 ? (
    <>
      {/* HEADER FIJO */}
      <div className="mi-pagina__table-header table-fixed-header">
        <table>
          <thead>
            <tr>
              <th style={{width: '100px'}}>Columna 1</th>
              <th style={{width: '200px'}}>Columna 2</th>
              <th style={{width: '150px'}}>Columna 3</th>
              {/* ... más columnas */}
            </tr>
          </thead>
        </table>
      </div>
      
      {/* BODY CON SCROLL */}
      <div className="mi-pagina__table-wrapper table-fixed-body">
        <table className="mi-pagina__table">
          {/* IMPORTANTE: colgroup debe tener los mismos anchos que el header */}
          <colgroup>
            <col style={{width: '100px'}} />
            <col style={{width: '200px'}} />
            <col style={{width: '150px'}} />
            {/* ... más columnas */}
          </colgroup>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                <td>{item.col1}</td>
                <td>{item.col2}</td>
                <td>{item.col3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <p className="mi-pagina__empty">No hay datos</p>
  )}
</section>
```

## CSS de la página (opcional)

Puedes extender o personalizar usando las clases específicas de tu página:

```css
/* mi-pagina.css */
@import "../styles/theme.css";

/* Contenedor padre que contiene la tabla */
.mi-pagina {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height));
  padding: 2rem;
}

/* El contenedor de la tabla necesita flex: 1 */
.mi-pagina__list {
  flex: 1;
  min-height: 0;
}

/* Opcional: Personalizar colores del header para esta página */
.mi-pagina__table-header th {
  background: #custom-color; /* sobrescribe --table-header-bg */
}

/* Opcional: Personalizar celdas */
.mi-pagina__table td {
  /* estilos adicionales específicos */
}
```

## ⚠️ IMPORTANTE: Alineación de columnas

Para que el header y el body se alineen correctamente:

1. **Usar anchos fijos** en las columnas (en píxeles)
2. **Los anchos deben ser IDÉNTICOS** entre:
   - `<th style={{width: 'Xpx'}}>` en el header
   - `<col style={{width: 'Xpx'}} />` en el colgroup del body
3. **Usar `table-layout: fixed`** (ya incluido en las clases globales)

## Ejemplo completo: Clientes.jsx

Ver `src/pages/Clientes.jsx` y `src/pages/Clientes.css` como referencia de implementación.

## Personalización por página

Si necesitas cambiar colores u otros aspectos específicos para una página:

```css
/* Cambiar el color de fondo del header solo en Proveedores */
.proveedores .table-fixed-header th {
  background: #fff2e6;
  color: #2b2b2b;
}

/* Ajustar padding de celdas solo en Inventario */
.inventario .table-fixed-body td {
  padding: 8px 10px;
}
```

## Solución de problemas

### El header no se queda fijo
- Verifica que el contenedor padre tenga `flex: 1` y `min-height: 0`
- Verifica que estés usando `table-fixed-container`, `table-fixed-header` y `table-fixed-body`

### Las columnas no se alinean
- Verifica que los anchos en `<th>` y `<col>` sean idénticos
- Asegúrate de usar anchos fijos (px) no porcentajes ni auto
- Verifica que ambas tablas tengan `table-layout: fixed`

### Hay scroll horizontal no deseado
- Ajusta los anchos de las columnas para que sumen menos que el ancho del contenedor
- O permite scroll horizontal dejando `overflow-x: auto` en `table-fixed-body`

## Ventajas de este patrón

✅ Header completamente fijo (no depende de `position: sticky`)  
✅ Funciona en todos los navegadores modernos  
✅ No se ve afectado por propiedades CSS como `transform` o `will-change`  
✅ Reutilizable en cualquier módulo con clases globales  
✅ Fácil de personalizar con variables CSS  

## Módulos que ya lo usan

- ✅ Clientes (`src/pages/Clientes.jsx`)
- ✅ Usuarios (`src/pages/UsersPage.jsx`)
- 🔲 Inventarios (por implementar)
- 🔲 Proveedores (por implementar)
- 🔲 Pedidos (por implementar)
