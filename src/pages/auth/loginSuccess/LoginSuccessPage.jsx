import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './LoginSuccessPage.css';

function LoginSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="login-success-page">
      <div className="login-success-container">
        <div className="login-success-box">
          <div className="success-icon">✓</div>
          <h2 className="login-success-title">¡Inicio de sesión exitoso!</h2>
          <p className="login-success-message">
            Serás redirigido al menú principal en unos segundos...
          </p>
          <button 
            className="login-success-button"
            onClick={() => navigate("/")}
          >
            Ir al menú principal
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSuccessPage;
