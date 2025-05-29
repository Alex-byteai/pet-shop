import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserSlash, FaUserCheck } from 'react-icons/fa';
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

  const loadUsers = () => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      setUsers(savedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = (userId) => {
    try {
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, active: !user.active };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setShowConfirmModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al actualizar estado del usuario:', error);
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{selectedUser?.active ? 'Desactivar' : 'Activar'} Usuario</h3>
        <p>¿Estás seguro de que deseas {selectedUser?.active ? 'desactivar' : 'activar'} al usuario {selectedUser?.firstName} {selectedUser?.lastName}?</p>
        {selectedUser?.active && (
          <p className="warning">El usuario no podrá iniciar sesión después de ser desactivado.</p>
        )}
        <div className="modal-actions">
          <button 
            onClick={() => handleToggleUserStatus(selectedUser.id)}
            className="confirm-button"
          >
            Sí, {selectedUser?.active ? 'desactivar' : 'activar'} usuario
          </button>
          <button 
            onClick={() => {
              setShowConfirmModal(false);
              setSelectedUser(null);
            }}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="user-list-page">
      <div className="page-header">
        <h1>Usuarios Registrados</h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : currentUsers.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron usuarios{searchTerm && ' que coincidan con la búsqueda'}.</p>
        </div>
      ) : (
        <>
          <div className="users-table">
            <table>
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
                  <tr key={user.id} className={!user.active ? 'inactive-user' : ''}>
                    <td>{user.id}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.registerDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/users/${user.id}`} className="view-button">
                          Ver detalle
                        </Link>
                        <button
                          className={`toggle-status-button ${user.active ? 'deactivate' : 'activate'}`}
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
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-button"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-button"
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
