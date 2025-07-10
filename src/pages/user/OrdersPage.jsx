import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUserId, updateOrder, getProductById } from '../../services/api';
import './OrdersPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    if (user?.id) {
      console.log('Fetching orders for user ID:', user.id);
      loadOrders();
    } else {
      console.log('No user ID available, not fetching orders.');
    }
  }, [user?.id, location.pathname]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrdersByUserId(user.id);
      console.log('Fetched orders raw:', fetchedOrders);
      
      // Enriquecer los pedidos con los detalles del producto
      const enrichedOrders = await Promise.all(fetchedOrders.map(async (order) => {
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
          const productDetail = await getProductById(item.productId);
          return { ...item, ...productDetail };
        }));
        return { ...order, items: enrichedItems };
      }));

      const sortedOrders = enrichedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrder(orderId, { status: 'cancelado' });
      loadOrders(); // Recargar pedidos después de la actualización
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
      currency: 'USD'
    }).format(price);
  };

  // Filtrar y buscar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderid.toString().includes(searchTerm) ||
                         order.items.some(item => 
                           item.name?.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'todos' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('Filtered orders:', filteredOrders);

  // Calcular paginación
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const CancelConfirmationModal = () => (
    <div className="op-modal-overlay">
      <div className="op-modal-content">
        <div className="op-detail-modal">
          <div className="op-modal-header">
            <h2>Confirmar Cancelación</h2>
            <button
              onClick={() => setShowCancelModal(false)}
              className="op-close-button"
            >
              ×
            </button>
          </div>
          <p>¿Estás seguro de que deseas cancelar el pedido #{selectedOrder?.orderid}?</p>
          <div className="op-modal-actions">
            <button
              onClick={() => handleCancelOrder(selectedOrder.orderid)}
              className="op-confirm-button"
            >
              Sí, cancelar pedido
            </button>
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedOrder(null);
              }}
              className="op-cancel-button"
            >
              No, mantener pedido
            </button>
          </div>
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
                  <img src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : API_BASE_URL + item.images[0]) : '/src/assets/placeholder.png'} alt={item.name} />
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
    <div className="op-orders-page">
      <div className="op-orders-header">
        <button onClick={() => navigate('/user/dashboard')} className="op-back-button">
          ← Volver al dashboard
        </button>
        <h1>Mis Pedidos</h1>
      </div>

      <div className="op-orders-container">
        <div className="op-orders-toolbar">
          <div className="op-search-box">
            <FaSearch className="op-search-icon" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="op-filter-box">
            <FaFilter className="op-filter-icon" />
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
          <div className="op-loading">Cargando pedidos...</div>
        ) : currentOrders.length === 0 ? (
          <div className="op-no-orders">
            <p>No se encontraron pedidos{statusFilter !== 'todos' ? ` en estado "${statusFilter}"` : ''}.</p>
            <button onClick={() => navigate('/')} className="op-shop-button">
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div className="op-orders-list">
              {currentOrders.map(order => (
                <div key={order.orderid} className="op-order-card">
                  <div className="op-order-header">
                    <div className="op-order-info">
                      <h3>Pedido #{order.orderid}</h3>
                      <p className="op-order-date">{formatDate(order.date)}</p>
                    </div>
                    <div 
                      className="op-order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="op-order-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="op-order-item">
                        <img src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : API_BASE_URL + item.images[0]) : '/src/assets/placeholder.png'} alt={item.name} className="op-item-image" />
                        <div className="op-item-details">
                          <h4>{item.name}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p>Precio: {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="op-more-items">
                        Y {order.items.length - 2} productos más...
                      </div>
                    )}
                  </div>

                  <div className="op-order-footer">
                    <div className="op-order-total">
                      <span>Total:</span>
                      <span className="op-total-amount">{formatPrice(order.total)}</span>
                    </div>
                    <div className="op-order-actions">
                      <button 
                        className="op-view-details-button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                      >
                        Ver detalles
                      </button>
                      {order.status.toLowerCase() === 'pendiente' && (
                        <button 
                          className="op-cancel-order-button"
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
              <div className="op-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="op-pagination-button"
                >
                  Anterior
                </button>
                <span className="op-page-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="op-pagination-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showDetailModal && (
        <div className="op-modal-overlay">
          <div className="op-modal-content op-detail-modal">
            <div className="op-modal-header">
              <h3>Detalles del Pedido #{selectedOrder?.orderid}</h3>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedOrder(null);
                }}
                className="op-close-button"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="op-detail-section">
              <h4>Información del Pedido</h4>
              <p><strong>Fecha:</strong> {formatDate(selectedOrder?.date)}</p>
              <p><strong>Estado:</strong> 
                <span 
                  className="op-status-badge"
                  style={{ backgroundColor: getStatusColor(selectedOrder?.status) }}
                >
                  {selectedOrder?.status}
                </span>
              </p>
            </div>

            <div className="op-detail-section">
              <h4>Productos</h4>
              <div className="op-detail-items">
                {selectedOrder?.items.map((item, index) => (
                  <div key={index} className="op-detail-item">
                    <img src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : API_BASE_URL + item.images[0]) : '/src/assets/placeholder.png'} alt={item.name} />
                    <div className="op-detail-item-info">
                      <h5>{item.name}</h5>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio unitario: {formatPrice(item.price)}</p>
                      <p>Subtotal: {formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="op-detail-section">
              <h4>Resumen</h4>
              <div className="op-order-summary">
                <div className="op-summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder?.total)}</span>
                </div>
                <div className="op-summary-row">
                  <span>IVA (21%):</span>
                  <span>{formatPrice(selectedOrder?.total * 0.21)}</span>
                </div>
                <div className="op-summary-row total">
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder?.total * 1.21)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && <CancelConfirmationModal />}
    </div>
  );
} 