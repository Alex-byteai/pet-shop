import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const defaultAddress = { street: '', city: '', state: '', zipCode: '', country: '' };
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    address: { ...defaultAddress, ...(user.address || {}) },
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DEBUG: Log isEditing state
  console.log('isEditing:', isEditing);

  // Check if form data has changed from initial user data
  const hasChanges = 
    formData.firstName !== user.firstName ||
    formData.lastName !== user.lastName ||
    formData.email !== user.email ||
    formData.phone !== user.phone ||
    JSON.stringify(formData.address) !== JSON.stringify(user.address);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested address object if needed, or flat input for now
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
    // Basic validation for address fields if they are required
    // if (!formData.address.street.trim()) {
    //   setError('La calle es requerida');
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      setError('No hay cambios para guardar');
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="up-user-profile-page">
      <div className="up-profile-header">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="up-edit-button"
          style={{ marginBottom: '1rem' }}
          disabled={isEditing}
        >
          Editar Perfil
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

          {/* Address Fields */}
          <div className="up-form-group">
            <label htmlFor="address.street">Calle</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="address.city">Ciudad</label>
            <input
              type="text"
              id="address.city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="address.state">Provincia</label>
            <input
              type="text"
              id="address.state"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="address.zipCode">Código Postal</label>
            <input
              type="text"
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          <div className="up-form-group">
            <label htmlFor="address.country">País</label>
            <input
              type="text"
              id="address.country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              disabled={!isEditing}
              className={`up-profile-input ${isEditing ? 'editing' : ''}`}
            />
          </div>

          {error && <div className="up-error-message">{error}</div>}
          {success && <div className="up-success-message">{success}</div>}

          {isEditing && (
            <div className="up-profile-actions">
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
                    phone: user.phone || '',
                    address: { ...defaultAddress, ...(user.address || {}) },
                  });
                  setError('');
                  setSuccess('');
                }}
                className="up-cancel-button"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          )}
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
      {/* Fallback visual si nunca se habilita edición */}
      {isEditing && <div style={{color:'red'}}>Modo edición activo</div>}
    </div>
  );
} 