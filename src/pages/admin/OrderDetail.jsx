import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOrderById, getUserById, getProductById, updateOrder } from "../../services/api";

import "./OrderDetail.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getDefaultProductImage = () => {
  return 'https://via.placeholder.com/150x150?text=Sin+Imagen';
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return getDefaultProductImage();
  if (imagePath.startsWith('http')) return imagePath;
  return API_BASE_URL + imagePath;
};

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line
  }, [orderId]);

  const loadOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedOrder = await getOrderById(orderId);
      if (!fetchedOrder) {
        setError("Orden no encontrada");
        setLoading(false);
        return;
      }

      const userId = fetchedOrder?.userid || fetchedOrder?.usuarioId || fetchedOrder?.usuario?.id;
      if (userId) {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
      } else {
        setUser(null);
        console.warn('No se encontró el ID de usuario en la orden', fetchedOrder);
      }

      const enrichedItems = await Promise.all(fetchedOrder.items.map(async (item) => {
        const productDetail = await getProductById(item.productId);
        return { ...item, ...productDetail };
      }));

      setOrder({ ...fetchedOrder, items: enrichedItems });
    } catch (err) {
      console.error("Error al cargar detalle de la orden:", err);
      setError("Error al cargar los detalles de la orden.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarOrden = async () => {
    const confirmCancel = window.confirm("¿Estás seguro de cancelar esta orden?");
    if (!confirmCancel) return;

    try {
      await updateOrder(order.orderid, { status: "cancelado" });
      alert("Orden cancelada correctamente!");
      loadOrderData();
    } catch (error) {
      console.error("Error al cancelar la orden:", error);
      alert("Hubo un error al cancelar la orden.");
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

  if (loading) {
    return <div className="order-detail-loading">Cargando detalle de la orden...</div>;
  }

  if (error || !order) {
    return (
      <div className="order-detail-error-container">
        <h2>{error || "Orden no encontrada"}</h2>
        <button onClick={() => navigate("/admin/orders")} className="order-detail-back-button">
          Volver a la lista de órdenes
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <h2 className="order-detail-title">Detalle de Orden #{order.orderid}</h2>
      <div className="order-detail-info">
        <p>
          <strong>ID:</strong> {order.orderid}
        </p>
        <p>
          <strong>Cliente:</strong> {user ? `${user.firstName} ${user.lastName}` : "Usuario no encontrado"}
        </p>
        <p>
          <strong>Fecha:</strong> {formatDate(order.date)}
        </p>
        <p>
          <strong>Estado:</strong>
          <span className={`order-detail-status-badge order-detail-status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </p>
      </div>

      <h3 className="order-detail-subtitle">Productos</h3>
      {order.items && order.items.length > 0 ? (
        <table className="order-detail-items-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <img
                    src={item.images && item.images[0] ? getImageUrl(item.images[0]) : getDefaultProductImage()}
                    alt={item.name || 'Producto'}
                    className="order-detail-product-thumbnail"
                    onError={(e) => {
                      e.target.src = getDefaultProductImage();
                    }}
                  />
                </td>
                <td>{item.name || 'Producto Desconocido'}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price || 0)}</td>
                <td>{formatPrice((item.quantity * (item.price || 0)))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="order-detail-no-products">No hay productos en esta orden.</p>
      )}

      <p className="order-detail-total">
        <strong>Total:</strong> {formatPrice(order.total || 0)}
      </p>

      {order.status.toLowerCase() !== "cancelado" && (
        <button className="order-detail-cancel-button" onClick={cancelarOrden}>
          Cancelar Orden
        </button>
      )}
    </div>
  );
}

export default OrderDetail;