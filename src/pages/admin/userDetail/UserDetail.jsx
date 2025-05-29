import { useParams, useNavigate } from "react-router-dom";
import { users as usersData } from "../../../data/users";
import { orders as ordersData } from "../../../data/orders";
import { useState, useEffect } from "react";
import "./UserDetail.css";

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    setUsuarios(storedUsers ? JSON.parse(storedUsers) : usersData);

    const storedOrders = localStorage.getItem("orders");
    setOrdenes(storedOrders ? JSON.parse(storedOrders) : ordersData);
  }, []);

  const user = usuarios.find((u) => u.id === parseInt(userId, 10));
  if (!user) return <p>Usuario no encontrado</p>;

  const userOrders = ordenes
    .filter((o) => o.userid === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="user-detail-container">
      {/* Header */}
      <div className="user-header">
        <h2 className="user-detail-title">Detalle del Usuario</h2>
        <button
          className="back-button"
          onClick={() => navigate("/admin/users")}
        >
          ← Volver al Listado
        </button>
      </div>

      {/* Información del usuario */}
      <div className="user-info">
        <p>
          <strong>ID: </strong> {user.id} <br />
          <strong>Nombre: </strong>{" "}
          <strong>
            {user.name} {user.surname}
          </strong>
          <br />
          <strong>Email: </strong> {user.email} <br />
          <strong>Rol: </strong> {user.role} <br />
          <strong>Estado: </strong>{" "}
          <span className={user.active ? "status-active" : "status-inactive"}>
            {user.active ? "Activo" : "Desactivado"}
          </span>
        </p>
      </div>

      {/* Órdenes */}
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
              <tr key={order.orderid}>
                <td>{order.orderid}</td>
                <td>{order.date}</td>
                <td>S/ {order.total.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    className="view-detail-button"
                    onClick={() => navigate(`/admin/orders/${order.orderid}`)}
                  >
                    Ver Detalle
                  </button>
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
