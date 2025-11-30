import React from "react";
import { Table, Button } from "react-bootstrap";

import "./TablaProductos.css";

const TablaProductos = ({ data = [] }) => {
  return (
    <div className="tabla-scroll">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Factura</th>
            <th>Nit</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Cantidad productos</th>
            <th>Usuario</th>
            <th>Modalidad Pago</th>
            <th>% Iva</th>
            <th>Total IVA</th>
            <th>Descuentos</th>
            <th>SubTotal</th>
            <th>Total</th>
            <th>Saldo</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.factura}</td>
              <td>{row.nit}</td>
              <td>{row.proveedor}</td>
              <td>{row.fecha}</td>
              <td>{row.cantidadProductos}</td>
              <td>{row.usuario}</td>
              <td>{row.modalidadPago}</td>
              <td>{row.iva}</td>
              <td>{row.totalIva}</td>
              <td>{row.descuentos}</td>
              <td>{row.subTotal}</td>
              <td>{row.total}</td>
              <td>{row.saldo}</td>
              <td>{row.notas}</td>
              <td className="acciones-col">
                <button className="btn btn-link">
                  Ver detalle / Realizar Abono
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaProductos;
