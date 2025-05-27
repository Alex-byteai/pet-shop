import React, { useState } from 'react';

const UserProfile = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  let userId = parseInt(localStorage.getItem('currentUserId'));

  if (!userId || !users.some(user => user.id === userId)) {
    userId = users.length > 0 ? users[0].id : null;
  }

  if (!userId) {
    return <p>No hay usuarios registrados en el sistema.</p>;
  }

  const currentUser = users.find(user => user.id === userId);
  const [newPassword, setNewPassword] = useState('');

  const userOrders = orders.filter(order => order.userid === currentUser.id);

  const handleChangePassword = () => {
    if (newPassword.trim().length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? { ...user, password: newPassword } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Contraseña cambiada exitosamente');
    setNewPassword('');
  };

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {currentUser.name} {currentUser.surname}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Rol:</strong> {currentUser.role}</p>
      <p><strong>Estado:</strong> {currentUser.active ? 'Activo' : 'Inactivo'}</p>

      <h3>Órdenes del usuario</h3>
      {userOrders.length === 0 ? (
        <p>No tienes órdenes registradas.</p>
      ) : (
        userOrders.map(order => (
          <div key={order.orderid} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <p><strong>ID de Orden:</strong> {order.orderid}</p>
            <p><strong>Fecha:</strong> {order.date}</p>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.nombre} — Cantidad: {item.cantidad} — Precio: ${item.precio.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))
      )}

      <h3>Cambiar contraseña</h3>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Cambiar</button>
    </div>
  );
};

export default UserProfile;
