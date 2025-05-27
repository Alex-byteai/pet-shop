import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = e => {
    e.preventDefault();

    // 1. Obtener usuarios desde localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // 2. Buscar usuario por email y contraseña
    const user = storedUsers.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // 3. Guardar sesión
      localStorage.setItem('currentUserId', user.id);

      // 4. Redirigir al perfil
      window.location.href = '/user/profile';
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
