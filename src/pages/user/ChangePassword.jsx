import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ChangePassword.css';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('La contraseña actual es requerida');
      return false;
    }
    if (!formData.newPassword) {
      setError('La nueva contraseña es requerida');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      if (result.success) {
        setSuccess('Contraseña actualizada correctamente');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cp-change-password-page">
      <div className="cp-password-header">
        <button onClick={() => navigate('/user/dashboard')} className="cp-back-button">
          ← Volver al dashboard
        </button>
        <h1>Cambiar Contraseña</h1>
      </div>

      <div className="cp-password-container">
        <form onSubmit={handleSubmit} className="cp-password-form">
          <div className="cp-form-group">
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="cp-password-input"
              placeholder="Ingresa tu contraseña actual"
              required
            />
          </div>

          <div className="cp-form-group">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="cp-password-input"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="cp-form-group">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="cp-password-input"
              placeholder="Repite tu nueva contraseña"
              required
            />
          </div>

          {error && <div className="cp-error-message">{error}</div>}
          {success && <div className="cp-success-message">{success}</div>}

          <div className="cp-password-actions">
            <button
              type="submit"
              className="cp-save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user/dashboard')}
              className="cp-cancel-button"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 