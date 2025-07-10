import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import { getUsers, updateUser } from '../../services/api';
import './UserList.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      const updatedUser = { ...userToUpdate, active: !userToUpdate.active };
      await updateUser(userId, { active: updatedUser.active });

      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === userId ? updatedUser : u))
      );
      setShowConfirmModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al actualizar estado del usuario:', error);
      alert('Error al actualizar el estado del usuario.');
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return user.id.toString().includes(searchTermLower) ||
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower);
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const ConfirmationModal = () => (
    <div className="user-list-modal-overlay">
      <div className="user-list-modal-content">
        <h3>{selectedUser?.active ? 'Desactivar' : 'Activar'} Usuario</h3>
        <p>¿Estás seguro de que deseas {selectedUser?.active ? 'desactivar' : 'activar'} al usuario {selectedUser?.firstName} {selectedUser?.lastName}?</p>
        {selectedUser?.active && (
          <p className="user-list-warning">El usuario no podrá iniciar sesión después de ser desactivado.</p>
        )}
        <div className="user-list-modal-actions">
          <button
            onClick={() => handleToggleUserStatus(selectedUser.id)}
            className="user-list-confirm-button"
          >
            Sí, {selectedUser?.active ? 'desactivar' : 'activar'} usuario
          </button>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              setSelectedUser(null);
            }}
            className="user-list-cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-list-page">
      <div className="user-list-header">
        <h1 className="user-list-header-title">Usuarios Registrados</h1>
        <div className="user-list-search-box">
          <FaSearch className="user-list-search-icon" />
          <input
            type="text"
            className="user-list-search-input"
            placeholder="Buscar por ID, nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="user-list-loading">Cargando usuarios...</div>
      ) : currentUsers.length === 0 ? (
        <div className="user-list-no-results">
          <p>No se encontraron usuarios{searchTerm && ' que coincidan con la búsqueda'}.</p>
        </div>
      ) : (
        <>
          <div className="user-list-users-table">
            <table className="user-list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Fecha de Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id} className={!user.active ? 'user-list-inactive-user' : ''}>
                    <td>{user.id}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.registerDate ? new Date(user.registerDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                    <td>
                      <span className={`user-list-status-badge ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="user-list-action-buttons">
                        <Link to={`/admin/users/${user.id}`} className="user-list-view-button">
                          Ver detalle
                        </Link>
                        <button
                          className={`user-list-toggle-status-button ${user.active ? 'deactivate' : 'activate'}`}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowConfirmModal(true);
                          }}
                        >
                          {user.active ? (
                            <>
                              <FaUserSlash />
                              <span>Desactivar</span>
                            </>
                          ) : (
                            <>
                              <FaUserCheck />
                              <span>Activar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="user-list-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="user-list-page-button"
              >
                Anterior
              </button>
              <span className="user-list-page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="user-list-page-button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {showConfirmModal && <ConfirmationModal />}
    </div>
  );
}