import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import dashboard1 from "../../../assets/images/admin_images/dashboard/dashboard-1.png";
import dashboard2 from "../../../assets/images/admin_images/dashboard/dashboard-2.png";
import dashboard3 from "../../../assets/images/admin_images/dashboard/dashboard-3.png";
import dashboard4 from "../../../assets/images/admin_images/dashboard/dashboard-4.png";
import dashboard5 from "../../../assets/images/admin_images/dashboard/dashboard-5.png";
import dashboard6 from "../../../assets/images/admin_images/dashboard/dashboard-6.png";
import dashboard7 from "../../../assets/images/admin_images/dashboard/dashboard-7.png";

const usersData = [
  [dashboard1, "Juan Perez", "Activo"],
  [dashboard2, "María Gonzales", "Activo"],
  [dashboard3, "Marco Aurelio", "Activo"],
  [dashboard4, "Ana Díaz", "Activo"],
  [dashboard5, "Carlos Lopez", "Activo"],
  [dashboard6, "Laura Méndez", "Activo"],
  [dashboard7, "Alejandro Ruiz", "Inactivo"],
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleVerUsuarios = () => {
    navigate("/admin/users");
  };

  const handleVerProductos = () => {
    navigate("/admin/listaproductos");
  };

  const handleVerOrdenes = () => {
    navigate("/admin/orders");
  };

  return (
    <div className="admin-dashboard">
      {/* TÍTULOS */}
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Órdenes</h3>
          <p>68</p>
        </div>
        <div className="card">
          <h3>Usuarios nuevos</h3>
          <p>12</p>
        </div>
        <div className="card">
          <h3>Ingresos totales</h3>
          <p>S/2348.00</p>
        </div>
      </div>

      {/* USUARIOS */}
      <div className="users-section">
        <div className="users-registered">
          <div className="section-header">
            <h3>Usuarios registrados</h3>
            <button className="btn-orange" onClick={handleVerUsuarios}>
              Ver todos los usuarios
            </button>
          </div>{" "}
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(([img, name, status], i) => (
                <tr key={i}>
                  <td>
                    <img src={img} alt={name} className="user-img" />
                    {name}
                  </td>
                  <td className={status === "Activo" ? "active" : "inactive"}>
                    {status}
                  </td>
                  <td>
                    <button
                      className={status === "Activo" ? "btn-red" : "btn-green"}
                    >
                      {status === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                    <button className="btn-outline">Ver detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>...</span>
            <span>10</span>
            <span>&gt;</span>
          </div>
        </div>

        {/* DETALLE USUARIO */}
        <div className="user-detail">
          <h3>Detalle del usuario</h3>
          <div className="user-info">
            <img src={dashboard1} alt="Juan Perez" className="detail-img" />
            <div>
              <p>
                <strong>Juan Perez</strong>
              </p>
              <p>Correo: juan.perez@gmail.com</p>
              <p>Fecha de registro: 20/01/2025</p>
              <p>Estado: Activo</p>
            </div>
          </div>
          <table className="user-orders">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["#1234", "20/01/2025", "S/199.00"],
                ["#2345", "21/01/2025", "S/149.00"],
                ["#3456", "22/01/2025", "S/249.00"],
                ["#4567", "23/01/2025", "S/129.00"],
                ["#5678", "24/01/2025", "S/179.00"],
                ["#6789", "25/01/2025", "S/219.00"],
              ].map(([id, date, total], i) => (
                <tr key={i}>
                  <td className="link">{id}</td>
                  <td>{date}</td>
                  <td>{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>...</span>
            <span>10</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>

      {/* LISTADO DE ÓRDENES */}
      <div className="orders-section">
        <div className="section-header">
          <h3>Listado de órdenes</h3>
          <div className="section-buttons">
            <button className="btn-orange" onClick={handleVerProductos}>
              Ver productos
            </button>
            <button className="btn-orange" onClick={handleVerOrdenes}>
              Ver todas las ordenes
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Usuario</th>
              <th>Fecha de órden</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["#1234", "Alejandro Ruiz", "20/01/2025", "S/199.00"],
              ["#2345", "María Gonzales", "21/01/2025", "S/149.00"],
              ["#3456", "Marco Aurelio", "22/01/2025", "S/249.00"],
              ["#4567", "Ana Díaz", "23/01/2025", "S/129.00"],
            ].map(([id, user, date, total], i) => (
              <tr key={i}>
                <td className="link">{id}</td>
                <td>{user}</td>
                <td>{date}</td>
                <td>{total}</td>
                <td className="delivered">Entregado</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>&lt;</span>
          <span className="active">1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>10</span>
          <span>&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
