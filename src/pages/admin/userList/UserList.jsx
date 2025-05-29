// src/pages/admin/UserList.jsx

import { useState, useEffect } from "react";
import { users as usersData } from "../../../data/users"; // módulo sin modificar
import { useNavigate } from "react-router-dom";
import "./UserList.css";

function UserList() {
  const [search, setSearch] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // 1️⃣ Carga inicial desde localStorage ("users") o fallback a usersData
  useEffect(() => {
    const stored = localStorage.getItem("users");
    setUsuarios(stored ? JSON.parse(stored) : usersData);
  }, []);

  // 2️⃣ Guarda cada cambio de 'usuarios' en la misma clave "users"
  useEffect(() => {
    if (usuarios.length) {
      localStorage.setItem("users", JSON.stringify(usuarios));
    }
  }, [usuarios]);

  // 3️⃣ Filtrado
  const filteredUsers = usuarios.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.id.toString().includes(term) ||
      user.name.toLowerCase().includes(term) ||
      user.surname.toLowerCase().includes(term)
    );
  });

  // 4️⃣ Desactivar y persistir
  const desactivarUsuario = (id) => {
    if (!window.confirm("¿Seguro que deseas desactivar este usuario?")) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: false } : u))
    );
  };

  return (
    <div className="user-list-container">
      <div className="user-header">
        <h2 className="user-list-title">Listado de Usuarios</h2>
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          Volver al Dashboard
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por ID, nombre o apellido"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="user-search-input"
      />

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={user.active ? "status-active" : "status-inactive"}
                >
                  {user.active ? "Activo" : "Desactivado"}
                </span>
              </td>
              <td>
                <button
                  className="view-detail-button"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  Ver Detalle
                </button>
                {user.active && (
                  <button
                    className="deactivate-button"
                    onClick={() => desactivarUsuario(user.id)}
                  >
                    Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
