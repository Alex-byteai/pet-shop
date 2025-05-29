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

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/user/orders')} className="back-button">
          Volver a mis pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <button onClick={() => navigate('/user/orders')} className="back-button">
          ← Volver a mis pedidos
        </button>
        <h1>Detalles del Pedido #{order.orderid}</h1>
      </div>

      <div className="order-detail-container">
        <div className="order-info-section">
          <div className="order-status-info">
            <h3>Estado del Pedido</h3>
            <div 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {order.status}
            </div>
          </div>

          <div className="order-date-info">
            <h3>Fecha del Pedido</h3>
            <p>{formatDate(order.date)}</p>
          </div>
        </div>

        <div className="order-items-section">
          <h3>Productos</h3>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-card">
                <img src={item.images[0]} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price-info">
                    <span className="item-quantity">Cantidad: {item.quantity}</span>
                    <span className="item-price">Precio: {formatPrice(item.price)}</span>
                    <span className="item-subtotal">Subtotal: {formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary-section">
          <h3>Resumen del Pedido</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="summary-row">
              <span>IVA (21%):</span>
              <span>{formatPrice(order.total * 0.21)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(order.total * 1.21)}</span>
            </div>
          </div>
        </div>

        {order.status === 'pendiente' && (
          <div className="order-actions">
            <button onClick={handleCancelOrder} className="cancel-button">
              Cancelar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 