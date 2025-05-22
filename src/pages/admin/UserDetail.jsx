import { useParams, Link } from "react-router-dom";
import { users } from "../../data/users";
import { orders } from "../../data/orders";
import "./UserDetail.css";

function UserDetail() {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));

  if (!user) {
    return <p>Usuario no encontrado</p>;
  }

  // Filtrar órdenes del usuario
  const userOrders = orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="user-detail-container">
      <h2 className="user-detail-title">Detalle del Usuario</h2>

      <div className="user-info">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Nombre:</strong> {user.name} {user.surname}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {user.role}
        </p>
        <p>
          <strong>Estado:</strong> {user.active ? "Activo" : "Desactivado"}
        </p>
      </div>

      <h3 className="user-detail-subtitle">Últimas Órdenes</h3>
      {userOrders.length === 0 ? (
        <p>Este usuario no tiene órdenes registradas.</p>
      ) : (
        <table className="user-orders-table">
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>S/ {order.total.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <Link to={`/admin/orders/${order.id}`}>Ver Detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserDetail;
