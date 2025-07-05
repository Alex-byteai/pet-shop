import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById, getProductById, updateOrder } from '../../services/api';
import './OrderDetail.css';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    loadOrder();
  }, [orderId, user.id]);

  const loadOrder = async () => {
    try {
      console.log('Cargando pedido con ID:', orderId);
      // Cargar el pedido desde la API del backend
      const foundOrder = await getOrderById(orderId);
      console.log('Pedido encontrado:', foundOrder);
      
      if (!foundOrder || foundOrder.usuarioId !== user.id) {
        setError('Pedido no encontrado');
        setLoading(false);
        return;
      }

      // Enriquecer los items con los detalles completos de los productos
      const enrichedOrder = {
        ...foundOrder,
        items: await Promise.all(foundOrder.items.map(async (item) => {
          console.log('Enriqueciendo item:', item);
          const productDetail = await getProductById(item.productId);
          console.log('Detalles del producto:', productDetail);
          return {
            ...item,
            ...productDetail,
            name: productDetail?.name || 'Producto sin nombre',
            description: productDetail?.description || 'Sin descripción disponible',
            price: productDetail?.price || item.price || 0,
            images: productDetail?.images || []
          };
        }))
      };

      console.log('Pedido enriquecido:', enrichedOrder);
      setOrder(enrichedOrder);
    } catch (error) {
      console.error('Error al cargar el pedido:', error);
      setError('Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      // Usar la API para cancelar el pedido
      await updateOrder(orderId, { status: 'cancelado' });
      // Recargar los datos del pedido
      await loadOrder();
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
    return 'https://via.placeholder.com/150x150?text=Sin+Imagen';
  };

  const getImageUrl = (imagePath) => {
    console.log('getImageUrl recibió:', imagePath);
    if (!imagePath) {
      console.log('No hay imagen, usando default');
      return getDefaultProductImage();
    }
    if (imagePath.startsWith('http')) {
      console.log('URL completa, usando tal como está:', imagePath);
      return imagePath;
    }
    const fullUrl = API_BASE_URL + imagePath;
    console.log('Construyendo URL completa:', fullUrl);
    return fullUrl;
  };

  const handleImageError = (index) => {
    setImageErrors(prev => new Set(prev).add(index));
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
                    src={imageErrors.has(index) ? getDefaultProductImage() : (item.images?.[0] ? getImageUrl(item.images[0]) : getDefaultProductImage())}
                    alt={item.name}
                    className="od-item-image"
                    onError={() => handleImageError(index)}
                    onLoad={() => {
                      // Si la imagen carga correctamente, remover del set de errores
                      setImageErrors(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(index);
                        return newSet;
                      });
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