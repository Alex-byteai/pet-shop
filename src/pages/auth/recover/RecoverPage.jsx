import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './RecoverPage.css';

function RecoverPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const verificarCorreo = () => {
    const user = users.find(u => u.email === email);
    if (user) {
      const id = user.id;
      setMessage('Se ha enviado un código de verificación a su correo.');
      setTimeout(() => {
        navigate("/auth/verificationCode", { state: { id }});
      }, 2000);
    } else {
      setError('El correo ingresado no está registrado');
    }
  }

  return (
    <div className="recover-page">
      <div className="recover-container">
        <div className="recover-box">
          <h2 className="recover-title">Recuperar Contraseña</h2>
          <div className="recover-form">
            <div className="form-group">
              <input
                type="email"
                className="recover-input"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              className="recover-button"
              onClick={verificarCorreo}
            >
              Enviar código de recuperación
            </button>
            {error && <p className="recover-error">{error}</p>}
            {message && <p className="recover-success">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoverPage;