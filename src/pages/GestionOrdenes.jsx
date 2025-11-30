// /client/src/pages/GestionOrdenes.jsx

import React, { useEffect, useState, useCallback } from "react";
import "./GestionOrdenes.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserModal from "../components/UserModal";
import swal from "../utils/swal";

function GestionOrdenes() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="ordenes">
      <Navbar />

        <main className="ordenes__main">
            <div className="ordenes__content">
                <h1 className="ordenes__title">Gestión de Órdenes</h1>
                <p className="ordenes__subtitle">
                    Aquí puedes gestionar las órdenes de producción.
                </p>
            </div>
        </main>
    </div>
  );
}

export default GestionOrdenes;
