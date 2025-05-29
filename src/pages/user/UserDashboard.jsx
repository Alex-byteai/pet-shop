import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orders from '../../data/orders';
import './UserDashboard.css';

const ORDERS_PER_PAGE = 5;

export default function UserDashboard() {
  const [userOrders, setUserOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserOrders();
  }, [user, currentPage]);

  const loadUserOrders = () => {
    try {
      // Obtener órdenes del localStorage o del archivo por defecto
      const allOrders = JSON.parse(localStorage.getItem('orders')) || orders;
      
      // Filtrar órdenes del usuario actual
      const userOrders = allOrders.filter(order => order.userid === user.id);
      
      // Ordenar por fecha más reciente
      userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Calcular total de páginas
      const total = Math.ceil(userOrders.length / ORDERS_PER_PAGE);
      setTotalPages(total);

      // Obtener órdenes para la página actual
      const start = (currentPage - 1) * ORDERS_PER_PAGE;
      const ordersToShow = userOrders.slice(start, start + ORDERS_PER_PAGE);
      
      setUserOrders(ordersToShow);
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
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
    return 'https://via.placeholder.com/50x50?text=Producto';
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Mi Cuenta</h1>
        <div className="user-info">
          <span className="user-name">{user.firstName} {user.lastName}</span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>

      <div className="dashboard-nav">
        <Link to="/user/profile" className="nav-link">
          Datos personales
        </Link>
        <Link to="/user/change-password" className="nav-link">
          Cambiar contraseña
        </Link>
        <Link to="/user/orders" className="nav-link">
          Ver todos mis pedidos
        </Link>
      </div>

      <div className="orders-section">
        <h2>Pedidos Recientes</h2>
        
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : userOrders.length > 0 ? (
          <>
            <div className="orders-list">
              {userOrders.map(order => (
                <div key={order.orderid} className="order-card" onClick={() => navigate(`/user/orders`)}>
                  <div className="order-header">
                    <span className="order-number">Pedido #{order.orderid}</span>
                    <span className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <div className="order-info">
                      <span className="order-date">
                        {formatDate(order.date)}
                      </span>
                      <span className="order-items">
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                    <div className="order-total">
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items.map((item, index) => (
                      <div key={index} className="preview-item">
                        <img 
                          src={item.images && item.images.length > 0 ? item.images[0] : getDefaultProductImage()} 
                          alt={item.name || 'Producto'} 
                          className="preview-image" 
                          onError={(e) => {
                            e.target.src = getDefaultProductImage();
                          }}
                        />
                        <div className="preview-details">
                          <span className="item-name">{item.name || 'Producto sin nombre'}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-button"
                >
                  Anterior
                </button>
                
                <span className="page-info">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-orders">
            <p>No tienes pedidos recientes</p>
            <Link to="/" className="shop-link">
              Ir a comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 