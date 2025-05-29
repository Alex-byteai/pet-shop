import { useState } from 'react';
import { users, indice } from '../../../data/users';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [contra, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const verificarLogin = () => {
    const user = users.find(u => u.email === email);
    if (user) {
      const indice2 = user.id - 1;

      if (contra === user.contra) {
        indice.ind = indice2;
        navigate("/auth/dashboard");
      } else {
        indice.ind = -1;
        setError('Credenciales incorrectas');
      }      
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Inicio de sesión</h2>
          <div className="login-form">
            <div className="form-group">
              <input 
                type="email" 
                className="login-input"
                placeholder="Email" 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                className="login-input"
                placeholder="Contraseña" 
                onChange={e => setContrasena(e.target.value)} 
              />
            </div>
            <button className="login-button" onClick={verificarLogin}>
              Iniciar sesión
            </button>
            {error && <p className="login-error">{error}</p>}
            <div className="login-links">
              <Link to="/auth/register" className="login-link">Registrarse</Link>
              <Link to="/auth/recover" className="login-link">Recuperar Contraseña</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


