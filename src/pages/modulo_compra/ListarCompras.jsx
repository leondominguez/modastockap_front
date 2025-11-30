import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./ListarCompras.css";
import TablaListarCompras from "./TablaListarCompras";
import { CSVLink } from "react-csv";

function ListarCompras() {
  const [search, setSearch] = useState("");
  const dataTemporal = [
    {
      id: 1,
      factura: "123465",
      nit: "832000",
      proveedor: "Telares",
      fecha: "2025-01-15",
      cantidadProductos: 12,
      usuario: "admin",
      modalidadPago: "crédito",
      iva: 19,
      totalIva: 19000,
      descuentos: 1500,
      subTotal: 100000,
      total: 119000,
      saldo: 5000,
      notas: "prueba ndo",
    },
    {
      id: 2,
      factura: "123465",
      nit: "832000",
      proveedor: "Telares",
      fecha: "2025-01-17",
      cantidadProductos: 12,
      usuario: "admin",
      modalidadPago: "crédito",
      iva: 19,
      totalIva: 19000,
      descuentos: 0,
      subTotal: 85000,
      total: 104000,
      saldo: 3000,
      notas: "abono pendiente",
    },
    {
      id: 3,
      factura: "555222",
      nit: "900111",
      proveedor: "Insumos Hilos S.A",
      fecha: "2025-01-12",
      cantidadProductos: 8,
      usuario: "empleado1",
      modalidadPago: "contado",
      iva: 19,
      totalIva: 11000,
      descuentos: 500,
      subTotal: 60000,
      total: 70500,
      saldo: 0,
      notas: "sin observaciones",
    },
    {
      id: 4,
      factura: "999888",
      nit: "830022",
      proveedor: "Comercializadora XYZ",
      fecha: "2025-01-10",
      cantidadProductos: 4,
      usuario: "admin",
      modalidadPago: "crédito",
      iva: 19,
      totalIva: 5000,
      descuentos: 200,
      subTotal: 25000,
      total: 29800,
      saldo: 29800,
      notas: "pago pendiente",
    },
    {
      id: 5,
      factura: "456789",
      nit: "760012",
      proveedor: "Hilazas y Más",
      fecha: "2025-01-13",
      cantidadProductos: 10,
      usuario: "empleado2",
      modalidadPago: "contado",
      iva: 19,
      totalIva: 17500,
      descuentos: 800,
      subTotal: 90000,
      total: 106700,
      saldo: 0,
      notas: "ok",
    },
  ];

  const filteredData = dataTemporal.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.nit.toLowerCase().includes(searchLower) ||
      item.proveedor.toLowerCase().includes(searchLower)
    );
  });

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Factura", key: "factura" },
    { label: "NIT", key: "nit" },
    { label: "Proveedor", key: "proveedor" },
    { label: "Fecha", key: "fecha" },
    { label: "Cantidad Productos", key: "cantidadProductos" },
    { label: "Usuario", key: "usuario" },
    { label: "Modalidad Pago", key: "modalidadPago" },
    { label: "% IVA", key: "iva" },
    { label: "Total IVA", key: "totalIva" },
    { label: "Descuentos", key: "descuentos" },
    { label: "SubTotal", key: "subTotal" },
    { label: "Total", key: "total" },
    { label: "Saldo", key: "saldo" },
    { label: "Notas", key: "notas" },
  ];

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h2>Lista de Compras</h2>
      </div>
      <Container fluid className="listar-compras-container">
        <Row style={{ textAlign: "center" }}>
          <h4>Auditoría de compras y estados de pago</h4>
        </Row>
        <Row>
          <Col md={2}>
            <label>Número de factura</label>
            <Form.Control type="text" placeholder="Ingrese número de factura" />
          </Col>
          <Col md={2}>
            <label>Modalidad de pago</label>
            <Form.Select>
              <option>Seleccione modalidad</option>
              <option>Contado</option>
              <option>Crédito</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="primary" style={{ margin: "10%" }}>
              Buscar
            </Button>
          </Col>
          <Col md={2}>
            <label>Fecha inicial</label>
            <Form.Control type="date" />
          </Col>
          <Col md={2}>
            <label>Fecha final</label>
            <Form.Control type="date" />
          </Col>
          <Col md={2}>
            <Button variant="primary" style={{ margin: "10%" }}>
              Calcular
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md={2}>
            <label>Fecha inicial</label>
            <Form.Control type="date" />
          </Col>
          <Col md={2}>
            <label>Fecha final</label>
            <Form.Control type="date" />
          </Col>
          <Col md={2}>
            <Button variant="primary" style={{ margin: "10%" }}>
              Buscar
            </Button>
          </Col>
          <Col md={2}>
            <label>Total pendiente</label>
            <Form.Control type="text" placeholder="$0.00" disabled />
            {"VALOR"}
          </Col>
          <Col md={2}>
            <label>Saldo Total</label>
            <Form.Control type="text" placeholder="$0.00" disabled />
            {"VALOR"}
          </Col>
          <Col md={2}>
            <label>Valor Total Compras</label>
            <Form.Control type="text" placeholder="$0.00" disabled />
            {"VALOR"}
          </Col>
        </Row>
      </Container>

      <div style={{ margin: ".6%", padding: "2px" }}>
        <h3>Listado de Compras</h3>
      </div>
      <Container fluid className="listar-compras-container">
        <Row>
          <Col md={4}>
            <label>Buscar</label>
            <Form.Control
              type="text"
              placeholder="Buscar por NIT o proveedor"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={8} style={{ textAlign: "end", marginBottom: "1%", padding: "2" }}>
            <CSVLink
              headers={csvHeaders}
              data={filteredData}
              filename="compras_export.csv"
              className="btn btn-success"
              style={{ marginTop: "30px" }}
            >
              Exportar CSV
            </CSVLink>
          </Col>
        </Row>
        <Row>
          <TablaListarCompras data={filteredData} />
        </Row>
      </Container>
    </>
  );
}
export default ListarCompras;
