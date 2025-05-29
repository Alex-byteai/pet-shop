import { useState } from 'react';
import { users, indice } from '../../../data/users';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
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

    indice.ind = newUser.id - 1;
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Nuevo usuario:', newUser);
    navigate("/");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-box">
          <h2 className="register-title">Registro de Usuario</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="register-input"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setnombre(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                className="register-input"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setapellido(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                className="register-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                className="register-input"
                placeholder="Contraseña"
                value={contras}
                onChange={(e) => setContra(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="register-button">
              Registrarse
            </button>
            
            {error && <p className="register-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
