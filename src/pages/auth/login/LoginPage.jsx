import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir según su rol
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container login-container">
        <div className="auth-box login-box">
          <h2 className="auth-title login-title">Inicio de sesión</h2>
          
          <form className="auth-form login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                id="email"
                type="email" 
                className="auth-input login-input"
                placeholder="tu@email.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input 
                id="password"
                type="password" 
                className="auth-input login-input"
                placeholder="Tu contraseña" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>

            {error && (
              <div className="auth-error login-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="auth-button login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <div className="auth-links login-links">
              <Link to="/auth/recover" className="auth-link login-link">
                ¿Olvidaste tu contraseña?
              </Link>
              <div className="auth-separator">o</div>
              <Link to="/auth/register" className="auth-link login-link register-link">
                Crear una cuenta nueva
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


