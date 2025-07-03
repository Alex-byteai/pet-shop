import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getUserById, getOrdersByUserId, getProductById } from '../../services/api'; // Importar funciones de API
import './UserDetail.css';

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar datos del usuario desde la API
      const foundUser = await getUserById(userId);
      
      if (!foundUser) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      setUser(foundUser);

      // Cargar pedidos del usuario desde la API y enriquecerlos
      const fetchedOrders = await getOrdersByUserId(userId);
      const enrichedOrders = await Promise.all(fetchedOrders.map(async (order) => {
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
          const productDetail = await getProductById(item.productId);
          return { ...item, ...productDetail };
        }));
        return { ...order, items: enrichedItems };
      }));

      const userOrders = enrichedOrders
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10); // Mostrar solo los últimos 10 pedidos

      setUserOrders(userOrders);
    } catch (error) {
      console.error('Error al cargar datos del usuario desde la API:', error);
      setError('Error al cargar los datos del usuario.');
    } finally {
      setLoading(false);
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
    return <div className="loading">Cargando datos del usuario...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/admin/users')} className="back-button">
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/users')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
        <h1>Detalle del Usuario</h1>
      </div>

      <div className="user-info-section">
        <h2>Información Personal</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>ID</label>
            <span>{user.id}</span>
          </div>
          <div className="info-item">
            <label>Nombre Completo</label>
            <span>{user.firstName} {user.lastName}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <label>Teléfono</label>
            <span>{user.phone}</span>
          </div>
          <div className="info-item">
            <label>Fecha de Registro</label>
            <span>{formatDate(user.registerDate)}</span>
          </div>
          <div className="info-item">
            <label>Último Acceso</label>
            <span>{formatDate(user.lastLogin)}</span>
          </div>
          <div className="info-item">
            <label>Estado</label>
            <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
              {user.active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="info-item">
            <label>Rol</label>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>

        <div className="address-info">
          <h3>Dirección</h3>
          <p>{user.address.street}</p>
          <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
          <p>{user.address.country}</p>
        </div>
      </div>

      <div className="user-orders-section">
        <h2>Últimos Pedidos</h2>
        {userOrders.length === 0 ? (
          <div className="no-orders">
            <p>Este usuario no tiene pedidos registrados.</p>
          </div>
        ) : (
          <div className="orders-list">
            {userOrders.map(order => (
              <div key={order.orderid} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.orderid}</h3>
                    <p className="order-date">{formatDate(order.date)}</p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ 
                      backgroundColor: 
                        order.status === 'pendiente' ? '#ffc107' :
                        order.status === 'enviado' ? '#28a745' :
                        order.status === 'cancelado' ? '#dc3545' : '#6c757d'
                    }}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.images && item.images[0] ? item.images[0] : '/src/assets/placeholder.png'}
                        alt={item.name} 
                        className="item-image" 
                      />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Cantidad: {item.quantity}</p>
                        <p>Precio: {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">{formatPrice(order.total)}</span>
                  </div>
                  <Link to={`/admin/orders/${order.orderid}`} className="view-order-button">
                    Ver pedido completo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
