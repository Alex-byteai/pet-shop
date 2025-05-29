import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../data/users';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Obtener usuarios actualizados del localStorage
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      
      // Buscar usuario por email y contraseña
      const foundUser = currentUsers.find(u => 
        u.email === email && 
        u.contra === password && 
        u.active === true
      );

      if (!foundUser) {
        throw new Error('Credenciales incorrectas o usuario inactivo');
      }

      // Crear objeto de usuario sin la contraseña
      const userToStore = {
        id: foundUser.id,
        firstName: foundUser.name,
        lastName: foundUser.surname,
        email: foundUser.email,
        role: foundUser.role
      };

      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      // Redirigir según el rol
      if (foundUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Obtener usuarios actuales
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      
      // Verificar si el email ya existe
      if (currentUsers.some(u => u.email === userData.email)) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const newUser = {
        id: currentUsers.length + 1,
        name: userData.firstName,
        surname: userData.lastName,
        email: userData.email,
        contra: userData.password,
        role: 'cliente',
        active: true
      };

      // Agregar nuevo usuario a la lista
      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Crear objeto de usuario para la sesión
      const userToStore = {
        id: newUser.id,
        firstName: newUser.name,
        lastName: newUser.surname,
        email: newUser.email,
        role: newUser.role
      };

      setUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      navigate('/user/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/auth/login');
  };

  const recoverPassword = async (email) => {
    try {
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      const user = currentUsers.find(u => u.email === email && u.active === true);
      
      if (!user) {
        throw new Error('No se encontró un usuario activo con ese email');
      }

      // Generar código de recuperación (6 dígitos)
      const recoveryCode = Math.floor(100000 + Math.random() * 900000);
      
      // Almacenar el código en localStorage
      const recoveryData = {
        email,
        code: recoveryCode,
        timestamp: Date.now()
      };
      localStorage.setItem('passwordRecovery', JSON.stringify(recoveryData));

      // En un caso real, aquí se enviaría el email
      // Como es frontend, mostramos el código en una alerta
      alert(`Tu código de recuperación es: ${recoveryCode}`);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyRecoveryCode = async (email, code) => {
    try {
      const recoveryData = JSON.parse(localStorage.getItem('passwordRecovery'));
      
      if (!recoveryData || 
          recoveryData.email !== email || 
          recoveryData.code !== parseInt(code) ||
          Date.now() - recoveryData.timestamp > 3600000) { // Expira después de 1 hora
        throw new Error('Código inválido o expirado');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      const updatedUsers = currentUsers.map(u => {
        if (u.email === email) {
          return { ...u, contra: newPassword };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('passwordRecovery');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      // Actualizar en la lista de usuarios
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      const updatedUsers = currentUsers.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            name: updates.firstName,
            surname: updates.lastName,
            email: updates.email
          };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Actualizar usuario actual
      const updatedUser = {
        ...user,
        firstName: updates.firstName,
        lastName: updates.lastName,
        email: updates.email
      };

      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');

      // Verificar contraseña actual
      const currentUsers = JSON.parse(localStorage.getItem('users')) || users;
      const currentUser = currentUsers.find(u => u.id === user.id);

      if (currentUser.contra !== currentPassword) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Actualizar contraseña
      const updatedUsers = currentUsers.map(u => {
        if (u.id === user.id) {
          return { ...u, contra: newPassword };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    recoverPassword,
    verifyRecoveryCode,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 