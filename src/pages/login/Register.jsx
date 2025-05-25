import { useState } from 'react';
import { users,indice } from '../../data/users';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setnombre] = useState('');
  const [apellido, setapellido] = useState('');
  const [email, setEmail] = useState('');
  const [contras, setContra] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !contras) {
      setError('Rellenar todos los campos es obligatorio');
      return;
    }

    if (users.some(user => user.email === email)) {
      setError('El correo ya está registrado.');
      return;
    }

    const newUser = {
      id: users.length + 1,
      nombre,
      apellido,
      email,
      contra: contras,
      role: 'cliente',
      active: false,
    };

    indice.ind=newUser.id-1;
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Nuevo usuario:', newUser);
    navigate("/");
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setnombre(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setapellido(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={contras}
          onChange={(e) => setContra(e.target.value)}
        />
        <br />
        <button type="submit">Registrarse</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Register;
