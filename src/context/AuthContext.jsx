import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, createUser as apiRegister, getUserByEmail ,getUserById, updateUser as apiUpdateUser, changePassword as apiChangePassword, requestPasswordRecovery, verifyPasswordRecoveryCode, resetUserPassword } from '../services/api';

// Contexto de autenticación para toda la aplicación
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Proveedor de autenticación que envuelve la app
export const AuthProvider = ({ children }) => {
  // Estado del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado de carga para saber si se está verificando el usuario
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Al montar, cargar usuario desde localStorage si existe
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const response = await apiLogin({ email, password });
      if (response) {
        // Traer el usuario completo (con address)
        const userFull = await getUserById(response.id);
        setUser(userFull);
        localStorage.setItem('currentUser', JSON.stringify(userFull));
        // Redirigir según el rol
        if (response.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user/dashboard');
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const newUser = await apiRegister(userData);
      const userToStore = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        registerDate: newUser.registerDate,
        lastLogin: newUser.lastLogin
      };
      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      navigate('/user/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/auth/login');
  };

  // Función para solicitar recuperación de contraseña
  const recoverPassword = async (email) => {
    try {
      const response = await requestPasswordRecovery(email);
      alert(`Tu código de recuperación es: ${response.recoveryCode}`); // Mostrar el código (para desarrollo, quitar en prod)
      return { success: true };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          error: 'No se encontró un usuario con ese email'
        };
      }
      console.error('Error en recuperación de contraseña (solicitud):', error);
      return { success: false, error: error.response?.data?.error || 'Ocurrió un error inesperado' };
    }
  };

  // Función para verificar el código de recuperación
  const verifyRecoveryCode = async (email, code) => {
    try {
      await verifyPasswordRecoveryCode(email, code);
      return { success: true };
    } catch (error) {
      console.error('Error en verificación de código:', error);
      return { success: false, error: error.response?.data?.error || 'Código inválido o expirado' };
    }
  };

  // Función para reestablecer la contraseña
  const resetPassword = async (email, newPassword, code) => {
    try {
      await resetUserPassword(email, newPassword, code);
      return { success: true };
    } catch (error) {
      console.error('Error en reestablecimiento de contraseña:', error);
      return { success: false, error: error.response?.data?.error || 'Ocurrió un error inesperado' };
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');
      await apiUpdateUser(user.id, updates); // Solo actualiza
      // Traer el usuario actualizado (con address)
      const updatedUserBackend = await getUserById(user.id);
      setUser(updatedUserBackend);
      localStorage.setItem('currentUser', JSON.stringify(updatedUserBackend));
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: error.message };
    }
  };

  // Función para cambiar la contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');
      await apiChangePassword(user.id, { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return { success: false, error: error.message };
    }
  };

  // Valor que se provee a los componentes hijos
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    recoverPassword,
    verifyRecoveryCode,
    resetPassword,
    updateProfile,
    changePassword
  };

  // Proveedor del contexto, solo renderiza hijos cuando termina de cargar
  return (
    <AuthContext.Provider value={value}>
      {/* Renderiza hijos solo cuando loading es false */}
      {!loading && children}
    </AuthContext.Provider>
  );
}; 