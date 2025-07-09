import axios from 'axios';

// URL base de la API, configurable por variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Instancia de axios configurada para la API
const api = axios.create({
  baseURL: API_BASE_URL + '/api',
});

// Función helper para construir URLs de imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return IMAGE_BASE_URL + imagePath;
};

// ===================== PRODUCTOS =====================

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Obtener un producto por su ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

// Subir imagen de producto
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.imageUrl;
};

// Obtener todos los productos (incluyendo inactivos o borrados)
export const getAllProducts = async () => {
  try {
    const response = await api.get('/products/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// ===================== CATEGORÍAS =====================

// Obtener todas las categorías
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Obtener categorías destacadas
export const getFeaturedCategories = async () => {
  try {
    const response = await api.get('/categories/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    throw error;
  }
};

// Obtener una categoría por su ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

// Crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Actualizar una categoría existente
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};

// Marcar una categoría como destacada
export const setCategoryFeatured = async (id, featured) => {
  try {
    const response = await api.put(`/categories/${id}/featured`, { featured });
    return response.data;
  } catch (error) {
    console.error('Error setting category featured:', error);
    throw error;
  }
};

// Subir imagen de categoría
export const uploadCategoryImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/categories/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.imageUrl;
};

// ===================== USUARIOS =====================

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Buscar usuario por email
export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/search`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Actualizar usuario existente
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

// Iniciar sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// ===================== ÓRDENES =====================

// Obtener todas las órdenes
export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Obtener una orden por su ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

// Obtener órdenes por ID de usuario
export const getOrdersByUserId = async (userId) => {
  try {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user with id ${userId}:`, error);
    throw error;
  }
};

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Actualizar una orden existente
export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
};

// Eliminar una orden
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error;
  }
};

// Cambiar la contraseña de un usuario
export const changePassword = async (id, passwords) => {
  try {
    const response = await api.put(`/users/${id}/change-password`, passwords);
    return response.data;
  } catch (error) {
    console.error(`Error changing password for user with id ${id}:`, error);
    throw error;
  }
};

// ===================== RECUPERACIÓN DE CONTRASEÑA =====================

// Solicitar recuperación de contraseña
export const requestPasswordRecovery = async (email) => {
  try {
    const response = await api.post('/users/recover-password-request', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password recovery:', error);
    throw error;
  }
};

// Verificar código de recuperación
export const verifyPasswordRecoveryCode = async (email, code) => {
  try {
    const response = await api.post('/users/verify-recovery-code', { email, code });
    return response.data;
  } catch (error) {
    console.error('Error verifying password recovery code:', error);
    throw error;
  }
};

// Reestablecer contraseña de usuario
export const resetUserPassword = async (email, newPassword, code) => {
  try {
    const response = await api.post('/users/reset-password', { email, newPassword, code });
    return response.data;
  } catch (error) {
    console.error('Error resetting user password:', error);
    throw error;
  }
};

// ===================== PRODUCTOS DESTACADOS Y NUEVOS =====================

// Obtener productos más vendidos o destacados
export const getTopProducts = async () => {
  try {
    const response = await api.get('/products/top');
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

// Obtener productos nuevos
export const getNewProducts = async () => {
  try {
    const response = await api.get('/products/new');
    return response.data;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
}; 