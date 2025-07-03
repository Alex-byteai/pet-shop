import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOrderById, getUserById, getProductById, updateOrder } from "../../services/api"; // Importar funciones de API
// import { orders as ordersData } from "../../data/orders"; // Eliminar o comentar esta línea
// import { users } from "../../data/users"; // Eliminar o comentar esta línea
import "./OrderDetail.css";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar orden por ID desde el backend
      const fetchedOrder = await getOrderById(orderId);
      if (!fetchedOrder) {
        setError("Orden no encontrada");
        setLoading(false);
        return;
      }

      // Cargar usuario por ID desde el backend
      const fetchedUser = await getUserById(fetchedOrder.userid);
      setUser(fetchedUser);

      // Enriquecer los ítems de la orden con detalles completos de los productos
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
      // Actualizar estado de la orden en el backend
      await updateOrder(order.orderid, { status: "cancelado" });
      alert("Orden cancelada correctamente!");
      loadOrderData(); // Recargar los datos de la orden para reflejar el cambio
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
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Cargando detalle de la orden...</div>;
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <h2>{error || "Orden no encontrada"}</h2>
        <button onClick={() => navigate("/admin/orders")} className="back-button">
          Volver a la lista de órdenes
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <h2 className="order-detail-title">Detalle de Orden #{order.orderid}</h2>
      <div className="order-info">
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
          <strong>Estado:</strong> {order.status}
        </p>
      </div>

      <h3 className="order-detail-subtitle">Productos</h3>
      {order.items && order.items.length > 0 ? (
        <table className="order-items-table">
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
                    src={item.images && item.images[0] ? item.images[0] : '/src/assets/placeholder.png'} 
                    alt={item.name || 'Producto'}
                    className="product-thumbnail"
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
        <p>No hay productos en esta orden.</p>
      )}

      <p className="order-total">
        <strong>Total:</strong> {formatPrice(order.total || 0)}
      </p>

      {order.status.toLowerCase() !== "cancelado" && (
        <button className="cancel-button" onClick={cancelarOrden}>
          Cancelar Orden
        </button>
      )}
    </div>
  );
}

export default OrderDetail;
