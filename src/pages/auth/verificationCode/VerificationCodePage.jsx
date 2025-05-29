import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerificationCodePage.css';

function VerificationCodePage() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const idbuscar = location.state?.id;
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const navigate = useNavigate();
  const CORRECT_CODE = "az"; 

  const handleCodeSubmit = () => {
    if (code === CORRECT_CODE) {
      setVerified(true);
      setError('');
      setSuccess('Código verificado correctamente');
    } else {
      setError('Código incorrecto. Por favor, intente nuevamente.');
      setSuccess('');
    }
  };

  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      setError("Por favor, complete todos los campos");
      setSuccess('');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setSuccess('');
      return;
    }

    users[idbuscar - 1].contra = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess("Contraseña actualizada correctamente");
    setError('');
    setTimeout(() => {
      navigate("/auth/login");
    }, 2000);
  };

  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-box">
          <h2 className="verification-title">
            {!verified ? 'Verificar Código' : 'Nueva Contraseña'}
          </h2>

          {!verified ? (
            <div className="verification-form">
              <div className="form-group">
                <input
                  type="text"
                  className="verification-input"
                  placeholder="Ingrese el código de verificación"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <button 
                className="verification-button"
                onClick={handleCodeSubmit}
              >
                Verificar Código
              </button>
            </div>
          ) : (
            <div className="verification-form">
              <div className="form-group">
                <input
                  type="password"
                  className="verification-input"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="verification-input"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <button 
                className="verification-button"
                onClick={handlePasswordReset}
              >
                Cambiar Contraseña
              </button>
            </div>
          )}
          
          {error && <p className="verification-error">{error}</p>}
          {success && <p className="verification-success">{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default VerificationCodePage;
