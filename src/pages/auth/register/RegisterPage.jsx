import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    // Validar dirección
    if (!formData.address.street.trim()) {
      newErrors.street = 'La calle es requerida';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'El estado/provincia es requerido';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }
    if (!formData.address.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      };
      
      console.log('Datos a enviar al backend:', userData);
      
      const result = await register(userData);

      if (!result.success) {
        setErrors({ submit: result.error });
      }
    } catch (err) {
      setErrors({ submit: 'Error al registrar usuario. Por favor intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Manejar campos anidados (dirección)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Manejar campos normales
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-container register-container">
        <div className="auth-box register-box">
          <h2 className="auth-title register-title">Crear cuenta</h2>
          
          <form className="auth-form register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  className={`auth-input register-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  className={`auth-input register-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`auth-input register-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className={`auth-input register-input ${errors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 123 456 789"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                className={`auth-input register-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className={`auth-input register-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-section">
              <h3 className="section-title">Dirección de Envío</h3>
              
              <div className="form-group">
                <label htmlFor="street" className="form-label">Calle y Número</label>
                <input
                  id="street"
                  type="text"
                  name="address.street"
                  className={`auth-input register-input ${errors.street ? 'error' : ''}`}
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Calle Mayor, 123"
                />
                {errors.street && <span className="error-message">{errors.street}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">Ciudad</label>
                  <input
                    id="city"
                    type="text"
                    name="address.city"
                    className={`auth-input register-input ${errors.city ? 'error' : ''}`}
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Madrid"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">Estado/Provincia</label>
                  <input
                    id="state"
                    type="text"
                    name="address.state"
                    className={`auth-input register-input ${errors.state ? 'error' : ''}`}
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="Madrid"
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">Código Postal</label>
                  <input
                    id="zipCode"
                    type="text"
                    name="address.zipCode"
                    className={`auth-input register-input ${errors.zipCode ? 'error' : ''}`}
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="28001"
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="country" className="form-label">País</label>
                  <input
                    id="country"
                    type="text"
                    name="address.country"
                    className={`auth-input register-input ${errors.country ? 'error' : ''}`}
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="España"
                  />
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="auth-error register-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="auth-button register-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div className="auth-links register-links">
              <div className="auth-separator">¿Ya tienes una cuenta?</div>
              <Link to="/auth/login" className="auth-link register-link login-link">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}