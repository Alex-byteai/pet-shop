import { useState } from "react";
import { orders as ordersData } from "../../data/orders";
import { users } from "../../data/users";
import { useNavigate } from "react-router-dom";
import "./OrdersList.css";

function OrdersList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Combinar orden con datos de usuario
  const orders = ordersData.map((order) => {
    const user = users.find((u) => u.id === order.userId);
    return {
      ...order,
      userName: user ? `${user.name} ${user.surname}` : "Usuario no encontrado",
    };
  });

  // Filtrado de órdenes
  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    return (
      order.id.toString().includes(searchTerm) ||
      order.userName.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="orders-list-container">
      <h2 className="orders-list-title">Listado de Órdenes</h2>

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
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userName}</td>
              <td>{order.date}</td>
              <td>S/ {order.total.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="view-detail-button"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersList;
