import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByUserId, getProductById } from '../../services/api';
import './UserDashboard.css';

const ORDERS_PER_PAGE = 5;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function UserDashboard() {
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadUserOrders();
    }
  }, [user?.id, currentPage]);

  const loadUserOrders = async () => {
    setIsLoading(true);
    try {
      // Obtener órdenes del backend
      const fetchedOrders = await getOrdersByUserId(user.id);
      
      // Enriquecer los pedidos con los detalles del producto (igual que en OrdersPage)
      const enrichedOrders = await Promise.all(fetchedOrders.map(async (order) => {
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
          const productDetail = await getProductById(item.productId);
          // Asegurarse de que productDetail no sea null/undefined y tenga las propiedades esperadas
          return { ...item, ...productDetail };
        }));
        return { ...order, items: enrichedItems };
      }));

      // Ordenar por fecha más reciente
      const sortedOrders = enrichedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calcular total de páginas
      const total = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
      setTotalPages(total);

      // Obtener órdenes para la página actual
      const start = (currentPage - 1) * ORDERS_PER_PAGE;
      const ordersToShow = sortedOrders.slice(start, start + ORDERS_PER_PAGE);
      
      setUserOrders(ordersToShow);
    } catch (error) {
      console.error('Error al cargar las órdenes del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'pending';
      case 'enviado':
        return 'completed';
      case 'cancelado':
        return 'cancelled';
      default:
        return '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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

  const getDefaultProductImage = () => {
    return '/src/assets/placeholder.png';
  };

  return (
    <div className="ud-user-dashboard">
      <div className="ud-dashboard-header">
        <h1>Mi Cuenta</h1>
        <div className="ud-user-info">
          <span className="ud-user-name">{user.firstName} {user.lastName}</span>
          <span className="ud-user-email">{user.email}</span>
        </div>
      </div>

      <div className="ud-dashboard-nav">
        <Link to="/user/profile" className="ud-nav-link">
          Datos personales
        </Link>
        <Link to="/user/change-password" className="ud-nav-link">
          Cambiar contraseña
        </Link>
        <Link to="/user/orders" className="ud-nav-link">
          Ver todos mis pedidos
        </Link>
      </div>

      <div className="ud-orders-section">
        <h2>Pedidos Recientes</h2>
        
        {isLoading ? (
          <div className="ud-loading-spinner"></div>
        ) : userOrders.length > 0 ? (
          <>
            <div className="ud-orders-list">
              {userOrders.map(order => (
                <div key={order.orderid} className="ud-order-card" onClick={() => navigate(`/user/orders`)}>
                  <div className="ud-order-header">
                    <span className="ud-order-number">Pedido #{order.orderid}</span>
                    <span className={`ud-order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="ud-order-details">
                    <div className="ud-order-info">
                      <span className="ud-order-date">
                        {formatDate(order.date)}
                      </span>
                      <span className="ud-order-items">
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <div className="ud-order-total">
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <div className="ud-order-items-preview">
                    {order.items.map((item, index) => (
                      <div key={index} className="ud-preview-item">
                        <img 
                          src={item.images && item.images.length > 0 ? (item.images[0].startsWith('http') ? item.images[0] : API_BASE_URL + item.images[0]) : getDefaultProductImage()} 
                          alt={item.name || 'Producto'} 
                          className="ud-preview-image" 
                          onError={(e) => {
                            e.target.src = getDefaultProductImage();
                          }}
                        />
                        <div className="ud-preview-details">
                          <span className="ud-item-name">{item.name || 'Producto sin nombre'}</span>
                          <span className="ud-item-quantity">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="ud-pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="ud-page-button"
                >
                  Anterior
                </button>
                
                <span className="ud-page-info">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ud-page-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="ud-no-orders">
            <p>No tienes pedidos recientes</p>
            <Link to="/" className="ud-shop-link">
              Ir a comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 