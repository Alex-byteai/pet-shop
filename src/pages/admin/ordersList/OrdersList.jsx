// src/pages/admin/orders/OrdersList.jsx

import { useState, useEffect } from "react";
import ordersPrev from "../../../data/orders"; // default export de orders.js
import users from "../../../data/users"; // default export de users.js
import { useNavigate } from "react-router-dom";
import "./OrdersList.css";

function OrdersList() {
  const [search, setSearch] = useState("");
  const [ordersState, setOrdersState] = useState([]);
  const navigate = useNavigate();

  // 1️⃣ Carga inicial desde localStorage ("orders") o fallback a ordersPrev
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    setOrdersState(stored ? JSON.parse(stored) : ordersPrev);
  }, []);

  // 2️⃣ Sincronizar cambios en localStorage
  useEffect(() => {
    if (ordersState.length) {
      localStorage.setItem("orders", JSON.stringify(ordersState));
    }
  }, [ordersState]);

  // 3️⃣ Combina cada orden con nombre de usuario
  const ordersWithUser = ordersState.map((o) => {
    const u = users.find((usr) => usr.id === o.userid);
    return {
      ...o,
      userName: u ? `${u.name} ${u.surname}` : "Usuario no encontrado",
    };
  });

  // 4️⃣ Filtrado en memoria
  const filteredOrders = ordersWithUser.filter((order) => {
    const term = search.toLowerCase();
    return (
      order.orderid.toString().includes(term) ||
      order.userName.toLowerCase().includes(term)
    );
  });

  // 5️⃣ Cancelar y persistir
  const cancelarOrden = (orderid) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta orden?")) return;
    const updated = ordersState.map((o) =>
      o.orderid === orderid ? { ...o, status: "Cancelada" } : o
    );
    setOrdersState(updated);
  };

  return (
    <div className="orders-list-container">
      <div className="orders-header">
        <h2 className="orders-list-title">Listado de Órdenes</h2>
        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate("/admin")}
        >
          ← Volver al Dashboard
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por ID de orden o nombre/apellido"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="orders-search-input"
      />

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.orderid}>
              <td>{order.orderid}</td>
              <td>{order.userName}</td>
              <td>{order.date}</td>
              <td>S/ {order.total.toFixed(2)}</td>
              <td
                className={
                  order.status === "Enviado"
                    ? "status-active"
                    : order.status === "Cancelada"
                    ? "status-cancelled"
                    : "status-inactive"
                }
              >
                {order.status}
              </td>
              <td>
                <button
                  className="view-detail-button"
                  onClick={() => navigate(`/admin/orders/${order.orderid}`)}
                >
                  Ver Detalle
                </button>
                {order.status !== "Cancelada" && (
                  <button
                    className="cancel-button"
                    onClick={() => cancelarOrden(order.orderid)}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
