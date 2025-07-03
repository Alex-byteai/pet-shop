import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './OrderDetail.css';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    loadOrder();
  }, [orderId, user.id]);

  const loadOrder = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const foundOrder = allOrders.find(o => o.orderid === parseInt(orderId) && o.userid === user.id);
      
      if (!foundOrder) {
        setError('Pedido no encontrado');
        return;
      }

      setOrder(foundOrder);
    } catch (error) {
      console.error('Error al cargar el pedido:', error);
      setError('Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    try {
      setIsCancelling(true);
      const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
      const updatedOrders = allOrders.map(o => {
        if (o.orderid === parseInt(orderId)) {
          return { ...o, status: 'cancelado' };
        }
        return o;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      loadOrder();
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      setError('Error al cancelar el pedido');
    } finally {
      setIsCancelling(false);
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

  const handleBack = () => {
    navigate('/user/orders');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'od-status-badge-pending';
      case 'enviado':
        return 'od-status-badge-sent';
      case 'cancelado':
        return 'od-status-badge-canceled';
      default:
        return 'od-status-badge-unknown';
    }
  };

  const getDefaultProductImage = () => {
    // Implement the logic to return a default product image
    return 'https://via.placeholder.com/150';
  };

  return (
    <div className="od-order-detail-page">
      <div className="od-order-detail-header">
        <button onClick={handleBack} className="od-back-button">
          ← Volver
        </button>
        <h1>Detalles del Pedido #{orderId}</h1>
      </div>

      {loading ? (
        <div className="od-loading-spinner">Cargando detalles del pedido...</div>
      ) : error ? (
        <div className="od-error-container">
          <h2>Error al cargar el pedido</h2>
          <p>{error}</p>
        </div>
      ) : order ? (
        <div className="od-order-detail-container">
          <div className="od-order-info-section">
            <div className="od-order-status-info">
              <h3>Estado del Pedido</h3>
              <span className={`od-status-badge ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="od-order-date-info">
              <h3>Fecha del Pedido</h3>
              <p>{formatDate(order.date)}</p>
            </div>
          </div>

          <div className="od-order-items-section">
            <h3>Productos</h3>
            <div className="od-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="od-item-card">
                  <img
                    src={item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : API_BASE_URL + item.images[0]) : getDefaultProductImage()}
                    alt={item.name}
                    className="od-item-image"
                    onError={(e) => {
                      e.target.src = getDefaultProductImage();
                    }}
                  />
                  <div className="od-item-info">
                    <h4>{item.name}</h4>
                    <p className="od-item-description">{item.description}</p>
                    <div className="od-item-price-info">
                      <span className="od-item-quantity">
                        Cantidad: {item.quantity}
                      </span>
                      <span className="od-item-price">
                        Precio: {formatPrice(item.price)}
                      </span>
                      <span className="od-item-subtotal">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="od-order-summary-section">
            <h3>Resumen del Pedido</h3>
            <div className="od-summary-details">
              <div className="od-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="od-summary-row">
                <span>Envío</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="od-summary-row total">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.status === 'pendiente' && (
            <div className="od-order-actions">
              <button
                onClick={handleCancelOrder}
                className="od-cancel-button"
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelando...' : 'Cancelar Pedido'}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
} 