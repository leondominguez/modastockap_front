import React from "react";
import { Table, Button } from "react-bootstrap";

import "./TablaProductos.css";

const TablaProductos = ({ data = [] }) => {
  return (
    <div className="tabla-scroll">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Código Insumo</th>
            <th>Descripción</th>
            <th>Lote</th>
            <th>Presentación</th>
            <th>Cantidad Ordenada</th>
            <th>Cantidad Comprada</th>
            <th>Medida</th>
            <th>Valor unidad</th>
            <th>% Descuento</th>
            <th>Tipo Registro</th>
            <th>% IVA</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.codigoInsumo}</td>
              <td>{item.descripcion}</td>
              <td>{item.lote}</td>
              <td>{item.presentacion}</td>
              <td>{item.cantidadOrdenada}</td>
              <td>{item.cantidadComprada}</td>
              <td>{item.medida}</td>
              <td>{item.valorUnidad}</td>
              <td>{item.descuento}</td>
              <td>{item.tipoRegistro}</td>
              <td>{item.iva}</td>
              <td>{item.total}</td>
              <td>
                {" "}
                <Button variant="danger" size="sm">
                  ✖
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaProductos;
