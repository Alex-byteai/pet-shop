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
    const user = users.find((u) => u.id === order.userid);
    return {
      ...order,
      userName: user ? `${user.firstName} ${user.lastName}` : "Usuario no encontrado",
    };
  });

  // Filtrado de órdenes
  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    return (
      order.orderid.toString().includes(searchTerm) ||
      order.userName.toLowerCase().includes(searchTerm)
    );
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#ffc107';
      case 'enviado':
        return '#28a745';
      case 'cancelado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

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
            <tr key={order.orderid}>
              <td>{order.orderid}</td>
              <td>{order.userName}</td>
              <td>{formatDate(order.date)}</td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    display: 'inline-block'
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  className="view-detail-button"
                  onClick={() => navigate(`/admin/orders/${order.orderid}`)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <div className="no-orders-message">
          No se encontraron órdenes que coincidan con la búsqueda
        </div>
      )}
    </div>
  );
}

export default OrdersList;
