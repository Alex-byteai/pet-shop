// src/pages/admin/orders/OrderDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import ordersPrev from "../../../data/orders"; // default export: LS or defaults
import users from "../../../data/users"; // default export: LS or defaults
import { useState, useEffect } from "react";
import "./OrderDetail.css";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // 1️⃣ Estado local para órdenes
  const [ordenes, setOrdenes] = useState([]);

  // 2️⃣ Carga inicial desde localStorage o fallback a ordersPrev
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    setOrdenes(stored ? JSON.parse(stored) : ordersPrev);
  }, []);

  // 3️⃣ Buscar la orden actual
  const order = ordenes.find((o) => o.orderid === parseInt(orderId, 10));
  if (!order) return <p>Orden no encontrada</p>;

  // 4️⃣ Obtener nombre de cliente
  const user = users.find((u) => u.id === order.userid);
  const userName = user
    ? `${user.name} ${user.surname}`
    : "Usuario no encontrado";

  // 5️⃣ Cancelar y persistir
  const cancelarOrden = () => {
    if (!window.confirm("¿Estás seguro de cancelar esta orden?")) return;
    const updated = ordenes.map((o) =>
      o.orderid === order.orderid ? { ...o, status: "Cancelada" } : o
    );
    setOrdenes(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
    navigate("/admin/orders");
  };

  const volverALista = () => navigate("/admin/orders");

  return (
    <div className="order-detail-container">
      <h2 className="order-detail-title">Detalle de Orden</h2>

      <div className="order-info">
        <p>
          <strong>ID:</strong> {order.orderid}
        </p>
        <p>
          <strong>Cliente:</strong> {userName}
        </p>
        <p>
          <strong>Fecha:</strong> {order.date}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={
              order.status === "Enviado"
                ? "status-active"
                : order.status === "Cancelada"
                ? "status-cancelled"
                : "status-inactive"
            }
          >
            {order.status}
          </span>
        </p>
      </div>

      <h3 className="order-detail-subtitle">Productos</h3>
      {order.items?.length > 0 ? (
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>{item.cantidad}</td>
                <td>S/ {item.precio.toFixed(2)}</td>
                <td>S/ {(item.cantidad * item.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay productos en esta orden.</p>
      )}

      <p className="order-total">
        <strong>Total:</strong> S/ {order.total.toFixed(2)}
      </p>

      <div className="order-buttons">
        <button className="order-button back-button" onClick={volverALista}>
          Volver a la lista
        </button>
        {order.status !== "Cancelada" && (
          <button
            className="order-button cancel-button"
            onClick={cancelarOrden}
          >
            Cancelar Orden
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
