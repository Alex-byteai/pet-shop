import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './RecoverPage.css';

export default function RecoverPage() {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { recoverPassword, verifyRecoveryCode, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await recoverPassword(email);
      if (result.success) {
        setStep(2);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Por favor ingresa el código');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyRecoveryCode(email, code);
      if (result.success) {
        setStep(3);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await resetPassword(email, newPassword);
      if (result.success) {
        alert('Contraseña actualizada correctamente');
        navigate('/auth/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-container">
        <div className="recover-box">
          <h2 className="recover-title">Recuperar contraseña</h2>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="recover-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  className="recover-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="recover-button"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCodeSubmit} className="recover-form">
              <div className="form-group">
                <label htmlFor="code">Código de verificación</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ingresa el código"
                  className="recover-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="recover-button"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Verificar código'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="recover-form">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="recover-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="recover-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="recover-button"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          )}

          <div className="recover-links">
            <button
              onClick={() => navigate('/auth/login')}
              className="back-button"
            >
              Volver al login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}