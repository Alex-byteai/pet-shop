// src/pages/Register.jsx

import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (formData) => {
    const { name, surname, email, password } = formData;

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el email ya existe
    if (storedUsers.some(user => user.email === email)) {
      alert('El correo ya está registrado');
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      surname,
      email,
      password,
      role: 'cliente',
      active: true
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const newUserOrders = [
      {
        orderid: Date.now(),
        userid: newUser.id,
        date: new Date().toISOString().slice(0, 10),
        status: 'pendiente',
        total: 0,
        items: []
      }
    ];
    const updatedOrders = [...storedOrders, ...newUserOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    localStorage.setItem('currentUserId', newUser.id);
    window.location.href = '/user/profile';
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleRegister(formData);
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="surname"
          placeholder="Apellido"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
