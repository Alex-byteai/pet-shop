import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './OrdersPage.css';

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const ordersPerPage = 5;

  useEffect(() => {
    loadOrders();
  }, [user.id]);

  const loadOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const userOrders = allOrders.filter(order => order.userid === user.id);
      const sortedOrders = userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const updatedOrders = allOrders.map(order => {
        if (order.orderid === orderId) {
          return { ...order, status: 'cancelado' };
        }
        return order;
      });
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      loadOrders();
      setShowCancelModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
    }
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

  // Filtrar y buscar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderid.toString().includes(searchTerm) ||
                         order.items.some(item => 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'todos' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const CancelConfirmationModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cancelar Pedido</h3>
        <p>¿Estás seguro de que deseas cancelar el pedido #{selectedOrder?.orderid}?</p>
        <p>Esta acción no se puede deshacer.</p>
        <div className="modal-actions">
          <button 
            onClick={() => handleCancelOrder(selectedOrder.orderid)}
            className="confirm-button"
          >
            Sí, cancelar pedido
          </button>
          <button 
            onClick={() => {
              setShowCancelModal(false);
              setSelectedOrder(null);
            }}
            className="cancel-button"
          >
            No, mantener pedido
          </button>
        </div>
      </div>
    </div>
  );

  const OrderDetailModal = () => (
    <div className="modal-overlay">
      <div className="modal-content detail-modal">
        <div className="modal-header">
          <h3>Detalles del Pedido #{selectedOrder?.orderid}</h3>
          <button 
            onClick={() => {
              setShowDetailModal(false);
              setSelectedOrder(null);
            }}
            className="close-button"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="order-detail-content">
          <div className="detail-section">
            <h4>Información del Pedido</h4>
            <p><strong>Fecha:</strong> {formatDate(selectedOrder?.date)}</p>
            <p><strong>Estado:</strong> 
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(selectedOrder?.status) }}
              >
                {selectedOrder?.status}
              </span>
            </p>
          </div>

          <div className="detail-section">
            <h4>Productos</h4>
            <div className="detail-items">
              {selectedOrder?.items.map((item, index) => (
                <div key={index} className="detail-item">
                  <img src={item.images[0]} alt={item.name} />
                  <div className="detail-item-info">
                    <h5>{item.name}</h5>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio unitario: {formatPrice(item.price)}</p>
                    <p>Subtotal: {formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4>Resumen</h4>
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedOrder?.total)}</span>
              </div>
              <div className="summary-row">
                <span>IVA (21%):</span>
                <span>{formatPrice(selectedOrder?.total * 0.21)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(selectedOrder?.total * 1.21)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button onClick={() => navigate('/user/dashboard')} className="back-button">
          ← Volver al dashboard
        </button>
        <h1>Mis Pedidos</h1>
      </div>

      <div className="orders-container">
        <div className="orders-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="enviado">Enviados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Cargando pedidos...</div>
        ) : currentOrders.length === 0 ? (
          <div className="no-orders">
            <p>No se encontraron pedidos{statusFilter !== 'todos' ? ` en estado "${statusFilter}"` : ''}.</p>
            <button onClick={() => navigate('/')} className="shop-button">
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {currentOrders.map(order => (
                <div key={order.orderid} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.orderid}</h3>
                      <p className="order-date">{formatDate(order.date)}</p>
                    </div>
                    <div 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.images[0]} alt={item.name} className="item-image" />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p>Precio: {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="more-items">
                        Y {order.items.length - 2} productos más...
                      </div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">{formatPrice(order.total)}</span>
                    </div>
                    <div className="order-actions">
                      <button 
                        className="view-details-button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                      >
                        Ver detalles
                      </button>
                      {order.status.toLowerCase() === 'pendiente' && (
                        <button 
                          className="cancel-order-button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancelar pedido
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Anterior
                </button>
                <span className="page-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showCancelModal && <CancelConfirmationModal />}
      {showDetailModal && <OrderDetailModal />}
    </div>
  );
} 