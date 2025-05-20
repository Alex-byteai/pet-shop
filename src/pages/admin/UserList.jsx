import { useState } from "react";
import { users as usersData } from "../../data/users";
import { useNavigate } from "react-router-dom";
import "./UserList.css";

function UserList() {
  const [search, setSearch] = useState("");
  const [usuarios, setUsuarios] = useState(usersData);
  const navigate = useNavigate();

  // Función para filtrar usuarios
  const filteredUsers = usuarios.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.surname.toLowerCase().includes(searchTerm)
    );
  });

  // Desactivar usuario
  const desactivarUsuario = (id) => {
    const confirm = window.confirm(
      "¿Seguro que deseas desactivar este usuario?"
    );
    if (!confirm) return;

    const actualizados = usuarios.map((u) =>
      u.id === id ? { ...u, active: false } : u
    );
    setUsuarios(actualizados);
  };

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Listado de Usuarios</h2>

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
              <td>{user.active ? "Activo" : "Desactivado"}</td>
              <td>
                <button
                  className="view-detail-button"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  Ver Detalle
                </button>{" "}
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
