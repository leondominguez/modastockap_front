import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./RegistrarCompras.css";

import TablaProductos from "./TablaProductos";

const dataTemporal = [
  {
    codigoInsumo: "HI002",
    descripcion: "Hilo Sintético",
    lote: "axada dad",
    presentacion: "Carrete",
    cantidadOrdenada: 12,
    cantidadComprada: 12,
    medida: "Unidades",
    valorUnidad: "$1000",
    descuento: "10%",
    tipoRegistro: "ordenado adicional excedente",
    iva: 19,
    total: 10800,
  },
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
  ,
  {
    codigoInsumo: "TEL001",
    descripcion: "Tela Seda",
    lote: "fsgfdg",
    presentacion: "Rollo",
    cantidadOrdenada: 12,
    cantidadComprada: 6,
    medida: "Metros",
    valorUnidad: "$1000",
    descuento: "0%",
    tipoRegistro: "ordenado",
    iva: 19,
    total: 6000,
  },
];

function RegistrarCompra() {
  const [formData, setFormData] = useState({
    proveedor: "",
  });

  return (
    <>
      <Container fluid className="registrar-compra-container">
        {/* ---------------------- FILA PRINCIPAL ---------------------- */}
        <Row>
          <Col md={4}>
            <h5>Datos de la factura de compra</h5>
            <hr style={{ width: "60%" }}></hr>
          </Col>
          <Col md={8} style={{ textAlign: "end" }}>
            <h5 style={{ marginRight: "2%" }}>ID compra #001</h5>
            <hr></hr>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px", padding: "5px" }}>
          {/* NIT + botón buscar */}
          <Col xs={3}>
            <Form.Label>NIT Proveedor</Form.Label>
            <Row>
              <Col xs={9}>
                <Form.Control type="text" placeholder="Ingrese NIT" />
              </Col>
              <Col xs={1}>
                <Button style={{ marginBottom: "6px" }}>Buscar</Button>
              </Col>
            </Row>
          </Col>

          {/* Número factura */}
          <Col xs={2}>
            <Form.Label>Numero factura</Form.Label>
            <Form.Control type="text" />
          </Col>

          {/* Fecha compra */}
          <Col xs={2}>
            <Form.Label>Fecha Compra</Form.Label>
            <Form.Control type="date" />
          </Col>

          {/* Porcentaje IVA */}
          <Col xs={1}>
            <Form.Label>Porcentaje IVA</Form.Label>
            <Form.Control type="number" />
          </Col>

          {/* Modalidad pago */}
          <Col xs={2}>
            <Form.Label>Modalidad Pago</Form.Label>
            <Form.Control as="select" defaultValue={0}>
              <option>Seleccione</option>
              <option>Contado</option>
              <option>Crédito</option>
            </Form.Control>
          </Col>

          {/* Adjuntar */}
          <Col xs={2}>
            <Form.Label>Adjuntar Factura</Form.Label>
            <Form.Control type="file" />
          </Col>
        </Row>

        {/* ---------------------- INFO PROVEEDOR ---------------------- */}
        <Row style={{ marginBottom: "20px", padding: "5px" }}>
          <Col xs={3}>
            <strong>Telares Importados De Colombia SAS</strong>
            <br />
            NIT : 832002320
          </Col>

          {/* ---------------------- TOTALES ---------------------- */}
          <Col xs={2}>
            <small>Cantidad de productos</small>
            <div className="fw-bold text-primary">10</div>
          </Col>

          <Col md={2}>
            <small>Descuentos</small>
            <div className="fw-bold text-primary">10800</div>
          </Col>

          <Col md={2}>
            <small>Subtotal</small>
            <div className="fw-bold text-primary">250000</div>
          </Col>

          <Col xs={2}>
            <small>Total IVA</small>
            <div className="fw-bold text-primary">250000</div>
          </Col>

          <Col xs={1}>
            <small>Valor total</small>
            <div className="fw-bold text-primary" style={{ fontSize: "20px" }}>
              250000
            </div>
          </Col>
        </Row>
      </Container>
      {/* // DETALLES DE PRODUCTOS */}
      <h4 style={{ margin: ".4%" }}>Detalles de Productos</h4>
      <Container fluid className="detalles-productos-container">
        <Row>
          <Col xs={2}>
            <Form.Check
              title="Producto"
              label="Producto"
              type="radio"
              style={{ fontWeight: "bold" }}
            />
          </Col>
          <Col xs={2}>
            <Form>
              <Form.Check
                title="Adicional"
                label="Adicional"
                type="radio"
                style={{ fontWeight: "bold" }}
              />
            </Form>
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            <Form.Control type="text" placeholder="Código insumo" />
          </Col>
          <Col xs={2}>
            <Form.Control type="text" placeholder="Número de orden" />
          </Col>
          <Col xs={3}>
            <Button style={{ marginBottom: "6px" }}>Añadir</Button>
          </Col>
          <Col sm={2} style={{}}>
            <Button variant="success" style={{ marginRight: "10px" }}>
              Guardar compra
            </Button>
          </Col>
          <Col sm={2} style={{ textAlign: "right" }}>
            <Button variant="danger">Cancelar</Button>
          </Col>
        </Row>
        <Row>
          <TablaProductos data={dataTemporal} />
        </Row>
      </Container>
    </>
  );
}

export default RegistrarCompra;
