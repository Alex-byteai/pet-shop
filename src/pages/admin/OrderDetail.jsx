import { useParams } from "react-router-dom";
import { orders as ordersData } from "../../data/orders";
import { users } from "../../data/users";
import { useState } from "react";
import "./OrderDetail.css";

function OrderDetail() {
  const { orderId } = useParams();
  const [ordenes, setOrdenes] = useState(ordersData);

  const orderIndex = ordenes.findIndex((o) => o.id === parseInt(orderId));
  const order = ordenes[orderIndex];

  if (!order) {
    return <p>Orden no encontrada</p>;
  }

  const user = users.find((u) => u.id === order.userId);
  const userName = user
    ? `${user.name} ${user.surname}`
    : "Usuario no encontrado";

  const cancelarOrden = () => {
    const confirm = window.confirm("¿Estás seguro de cancelar esta orden?");
    if (!confirm) return;

    const nuevaOrden = { ...order, status: "Cancelada" };
    const nuevasOrdenes = [...ordenes];
    nuevasOrdenes[orderIndex] = nuevaOrden;
    setOrdenes(nuevasOrdenes);
  };

  return (
    <div className="order-detail-container">
      <h2 className="order-detail-title">Detalle de Orden</h2>
      <div className="order-info">
        <p>
          <strong>ID:</strong> {order.id}
        </p>
        <p>
          <strong>Cliente:</strong> {userName}
        </p>
        <p>
          <strong>Fecha:</strong> {order.date}
        </p>
        <p>
          <strong>Estado:</strong> {order.status}
        </p>
      </div>

      <h3 className="order-detail-subtitle">Productos</h3>
      {order.items && order.items.length > 0 ? (
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
            {order.items.map((item, idx) => (
              <tr key={idx}>
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

      {order.status !== "Cancelada" && (
        <button className="cancel-button" onClick={cancelarOrden}>
          Cancelar Orden
        </button>
      )}
    </div>
  );
}

export default OrderDetail;
