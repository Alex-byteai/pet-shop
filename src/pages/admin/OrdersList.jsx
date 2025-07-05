import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, getUsers, getProductById } from "../../services/api"; // Importar funciones de API
// import { orders as ordersData } from "../../data/orders"; // Eliminar o comentar esta línea
// import { users } from "../../data/users"; // Eliminar o comentar esta línea
import "./OrdersList.css";

function OrdersList() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]); // Estado para las órdenes
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []); // Cargar órdenes una vez al montar el componente

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders();
      // Ya no es necesario enriquecer con getUsers, el backend trae order.usuario
      // Ordenar por fecha más reciente
      const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error al cargar las órdenes para el administrador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrado de órdenes
  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    const userName = order.usuario ? `${order.usuario.firstName} ${order.usuario.lastName}` : "Usuario no encontrado";
    return (
      order.orderid.toString().includes(searchTerm) ||
      userName.toLowerCase().includes(searchTerm) ||
      order.items.some(item => item.name?.toLowerCase().includes(searchTerm))
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
        placeholder="Buscar por ID de orden, cliente o producto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="orders-search-input"
      />

      {isLoading ? (
        <div className="loading-message">Cargando órdenes...</div>
      ) : (
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
                <td>{order.usuario ? `${order.usuario.firstName} ${order.usuario.lastName}` : "Usuario no encontrado"}</td>
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
      )}

      {filteredOrders.length === 0 && !isLoading && (
        <div className="no-orders-message">
          No se encontraron órdenes que coincidan con la búsqueda
        </div>
      )}
    </div>
  );
}

export default OrdersList;
