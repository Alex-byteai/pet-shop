import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/api";

import "./OrdersList.css";

function OrdersList() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders();
      const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error al cargar las órdenes para el administrador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    const userName = order.usuario ? `${order.usuario.firstName} ${order.usuario.lastName}` : "Usuario no encontrado";
    return (
      order.orderid.toString().includes(searchTerm) ||
      userName.toLowerCase().includes(searchTerm) ||
      order.items.some(item => item.name?.toLowerCase().includes(searchTerm))
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="orders-list-container">
      <h2 className="orders-list-title">Listado de Órdenes</h2>

      <input
        type="text"
        placeholder="Buscar por ID de orden, cliente o producto"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reiniciar a página 1 cuando se busca
        }}
        className="orders-list-search-input"
      />

      {isLoading ? (
        <div className="orders-list-loading-message">Cargando órdenes...</div>
      ) : currentOrders.length > 0 ? (
        <>
          <div className="orders-list-users-table">
            <table className="orders-list-table">
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
                {currentOrders.map((order) => (
                  <tr key={order.orderid}>
                    <td>{order.orderid}</td>
                    <td>{order.usuario ? `${order.usuario.firstName} ${order.usuario.lastName}` : "Usuario no encontrado"}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`orders-list-status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="orders-list-view-detail-button"
                        onClick={() => navigate(`/admin/orders/${order.orderid}`)}
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="orders-list-pagination">
            <button
              className="orders-list-page-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="orders-list-page-info">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="orders-list-page-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <div className="orders-list-no-orders-message">
          No se encontraron órdenes que coincidan con la búsqueda
        </div>
      )}
    </div>
  );
}

export default OrdersList;
