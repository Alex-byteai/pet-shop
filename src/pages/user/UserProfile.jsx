import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido');
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
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="up-user-profile-page">
      <div className="up-profile-header">
        <button onClick={() => navigate('/user/dashboard')} className="up-back-button">
          ← Volver
        </button>
        <h1>Mi Perfil</h1>
      </div>

      <div className="up-profile-container">
        <form onSubmit={handleSubmit} className="up-profile-form">
          <div className="up-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="up-profile-input"
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="lastName">Apellidos</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          {error && <div className="up-error-message">{error}</div>}
          {success && <div className="up-success-message">{success}</div>}

          <div className="up-profile-actions">
            {!isEditing ? (
              <button type="button" onClick={() => setIsEditing(true)} className="up-edit-button">
                Editar Perfil
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="up-save-button"
                  disabled={!hasChanges || isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                    });
                    setError('');
                  }}
                  className="up-cancel-button"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>

        <div className="up-profile-links">
          <button
            onClick={() => navigate('/user/change-password')}
            className="up-change-password-button"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>
    </div>
  );
} 