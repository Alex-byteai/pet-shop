import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { getSequelizeInstance } from './config/database.js'; // New import

const sequelize = getSequelizeInstance(); // Initialize sequelize here

// Import model definition functions
import { defineProducto } from './models/Producto.js';
import { defineCategory } from './models/Category.js';
import { defineUsuario } from './models/Usuario.js';
import { defineAddress } from './models/Address.js';
import { defineSubcategory } from './models/Subcategory.js';
import { defineItem } from './models/Item.js';
import { defineOrder } from './models/Order.js';

// Define models by passing the sequelize instance
export const Producto = defineProducto(sequelize);
export const Category = defineCategory(sequelize);
export const Usuario = defineUsuario(sequelize);
export const Address = defineAddress(sequelize);
export const Subcategory = defineSubcategory(sequelize);
export const Item = defineItem(sequelize);
export const Order = defineOrder(sequelize);

import { setupAssociations } from './models/associations.js'; // Import the associations setup function
setupAssociations(Usuario, Address, Order, Item, Producto, Category, Subcategory); // Call the setup function with all defined models

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app
const app = express();
app.use(express.json());
app.use(cors());


// Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Configuración de multer para subir imágenes de productos
const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const uploadProducts = multer({ storage: storageProducts });

// Configuración de multer para subir imágenes de categorías
const storageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    // Asegúrate de que esta carpeta exista: backend/public/images/categories
    cb(null, path.join(__dirname, 'public/images/categories'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'category-' + uniqueSuffix + ext);
  }
});
const uploadCategories = multer({ storage: storageCategories });

// Sincronizar modelos con la base de datos
sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos sincronizada');
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});

// Endpoints para productos
app.get('/api/products', async (req, res) => {
  try {
    // Filtrar solo productos activos para el frontend general
    const activeProducts = await Producto.findAll({
      where: { active: true },
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    res.json(activeProducts);
  } catch (error) {
    console.error('Error al obtener productos activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products/top', async (req, res) => {
  try {
    // Si hay productos marcados como isBestSeller, devolver solo esos
    const bestSellers = await Producto.findAll({
      where: { isBestSeller: true, active: true },
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    if (bestSellers.length > 0) {
      return res.json(bestSellers);
    }
    // Si no, usar soldCount como fallback y asegurarse de que estén activos
    const topProducts = await Producto.findAll({
      where: { active: true },
      order: [['soldCount', 'DESC']],
      limit: 10,
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    res.json(topProducts);
  } catch (error) {
    console.error('Error al obtener productos top:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products/new', async (req, res) => {
  try {
    // Si hay productos marcados como isNew, devolver solo esos y que estén activos
    const newOnes = await Producto.findAll({
      where: { isNew: true, active: true },
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    if (newOnes.length > 0) {
      return res.json(newOnes);
    }
    // Si no, usar createdAt como fallback y asegurarse de que estén activos
    const newProducts = await Producto.findAll({
      where: { active: true },
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    res.json(newProducts);
  } catch (error) {
    console.error('Error al obtener productos nuevos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nuevo endpoint para obtener TODOS los productos (activos e inactivos) para el admin
app.get('/api/products/all', async (req, res) => {
  try {
    const products = await Producto.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' } // Updated alias
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Producto.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Subcategory, as: 'productSubcategory' }
      ]
    });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Producto.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const [updated] = await Producto.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedProduct = await Producto.findByPk(req.params.id);
      return res.json(updatedProduct);
    }
    return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Producto.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(204).json({ message: 'Producto eliminado' });
    }
    return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoints para categorías
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Subcategory, as: 'subcategories' }]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/categories/featured', async (req, res) => {
  try {
    const featuredCategories = await Category.findAll({ where: { featured: true } });
    res.json(featuredCategories);
  } catch (error) {
    console.error('Error al obtener categorías destacadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Subcategory,
        as: 'subcategories'
      }]
    });
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { subcategories, ...categoryData } = req.body;

    const newCategory = await Category.create(categoryData);

    if (subcategories && subcategories.length > 0) {
      // Create subcategories and associate them with the new category
      const subcategoryInstances = subcategories.map(name => ({ name, categoryId: newCategory.id }));
      await Subcategory.bulkCreate(subcategoryInstances);
    }

    // Fetch the newly created category with its subcategories
    const categoryWithSubcategories = await Category.findByPk(newCategory.id, {
      include: [{
        model: Subcategory,
        as: 'subcategories'
      }]
    });

    res.status(201).json(categoryWithSubcategories);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Subcategory, as: 'subcategories' }]
    });
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Actualizar datos principales
    await category.update({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      featured: req.body.featured,
      updatedAt: req.body.updatedAt || new Date().toISOString()
    });

    // Actualizar subcategorías
    if (Array.isArray(req.body.subcategories)) {
      // Elimina las subcategorías actuales
      await Subcategory.destroy({ where: { categoryId: category.id } });
      // Crea las nuevas subcategorías
      const newSubs = req.body.subcategories.map(name => ({
        name,
        categoryId: category.id
      }));
      await Subcategory.bulkCreate(newSubs);
    }

    // Devuelve la categoría actualizada con subcategorías
    const updatedCategory = await Category.findByPk(category.id, {
      include: [{ model: Subcategory, as: 'subcategories' }]
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoints para usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await Usuario.findAll({
      include: [{
        model: Address,
        as: 'address'
      }]
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Muevo la ruta de búsqueda por email antes de las rutas por ID
app.get('/api/users/search', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  try {
    const user = await Usuario.findOne({
      where: { email: email.toLowerCase().trim() },
      include: [{ model: Address, as: 'address' }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al buscar usuario por email:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
});

// Ahora las rutas por ID
app.get('/api/users/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }
  try {
    const user = await Usuario.findByPk(req.params.id, {
      include: [{
        model: Address,
        as: 'address'
      }]
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    console.log('Datos recibidos en registro:', req.body);
    const { address, ...userData } = req.body;
    
    console.log('Datos del usuario:', userData);
    console.log('Datos de dirección:', address);

    // Crear el usuario primero
    const newUser = await Usuario.create(userData);
    console.log('Usuario creado:', newUser.id);

    // Si hay datos de dirección, crear la dirección y asociarla
    if (address) {
      const newAddress = await Address.create({
        ...address,
        usuarioId: newUser.id
      });
      console.log('Dirección creada:', newAddress.id);
    }

    // Obtener el usuario con su dirección incluida
    const userWithAddress = await Usuario.findByPk(newUser.id, {
      include: [{
        model: Address,
        as: 'address'
      }]
    });

    console.log('Usuario final con dirección:', userWithAddress);
    res.status(201).json(userWithAddress);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }
  try {
    const { address, ...userData } = req.body;

    const user = await Usuario.findByPk(req.params.id, {
      include: [{
        model: Address,
        as: 'address'
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await user.update(userData);

    if (address) {
      if (user.address) {
        await user.address.update(address);
      } else {
        // If no existing address, create one and associate it
        await Address.create({ ...address, usuarioId: user.id });
      }
    }

    const updatedUser = await Usuario.findByPk(req.params.id, {
      include: [{
        model: Address,
        as: 'address'
      }]
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }
  try {
    const deleted = await Usuario.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(204).json({ message: 'Usuario eliminado' });
    }
    return res.status(404).json({ error: 'Usuario no encontrado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para cambiar contraseña de usuario
app.put('/api/users/:id/change-password', async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }
    await user.update({ password: newPassword });
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoints para recuperación de contraseña
app.post('/api/users/recover-password-request', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    const recoveryExpires = Date.now() + 3600000; // 1 hora de validez

    await user.update({ recoveryCode, recoveryExpires });

    res.json({ message: 'Código de recuperación enviado (simulado)', recoveryCode });
  } catch (error) {
    console.error('Error en la solicitud de recuperación de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/users/verify-recovery-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });

    console.log('Verificando código:', {
      recibido: code,
      enBD: user?.recoveryCode,
      expira: user?.recoveryExpires,
      ahora: Date.now(),
      email: email
    });

    if (!user || String(user.recoveryCode).trim() !== String(code).trim() || Date.now() > user.recoveryExpires) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    res.json({ message: 'Código verificado correctamente' });
  } catch (error) {
    console.error('Error al verificar código de recuperación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  const { email, newPassword, code } = req.body; // Incluir el código para una verificación final
  try {
    const user = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (String(user.recoveryCode).trim() !== String(code).trim() || Date.now() > user.recoveryExpires) {
      return res.status(400).json({ error: 'Código de verificación inválido o expirado' });
    }

    await user.update({
      password: newPassword,
      recoveryCode: null, // Limpiar el código de recuperación después de usarlo
      recoveryExpires: null // Limpiar la fecha de expiración
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email, password } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json(user);
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoints para órdenes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Item, as: 'items' }
      ]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Item, as: 'items' }
      ]
    });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    console.error('Error al obtener orden por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/orders/user/:userid', async (req, res) => {
  try {
    const userOrders = await Order.findAll({
      where: { usuarioId: req.params.userid }, // Changed from 'userid' to 'usuarioId' based on model association
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Item, as: 'items' }
      ]
    });
    res.json(userOrders);
  } catch (error) {
    console.error('Error al obtener órdenes de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La orden debe tener al menos un item.' });
    }
    // Calcular el total de la orden de forma segura
    let total = 0;
    for (const item of items) {
      // Buscar el producto en la base de datos
      const product = await Producto.findByPk(item.productId);
      if (!product || !product.active) {
        return res.status(400).json({ error: `Producto con ID ${item.productId} no existe o está inactivo.` });
      }
      total += Number(product.price) * Number(item.quantity);
    }
    // Crear la orden principal con el total calculado
    const newOrder = await Order.create({
      ...orderData,
      total,
      date: new Date().toISOString()
    });
    // Crear los items asociados
    for (const item of items) {
      await Item.create({
        orderId: newOrder.orderid,
        productId: item.productId,
        quantity: item.quantity
      });
    }
    // Devolver la orden con los items y usuario incluidos
    const orderWithItems = await Order.findByPk(newOrder.orderid, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Item, as: 'items' }
      ]
    });
    res.status(201).json(orderWithItems);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { orderid: req.params.id }
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id);
      return res.json(updatedOrder);
    }
    return res.status(404).json({ error: 'Orden no encontrada' });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { orderid: req.params.id }
    });
    if (deleted) {
      return res.status(204).json({ message: 'Orden eliminada' });
    }
    return res.status(404).json({ error: 'Orden no encontrada' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para subir imagen de producto
app.post('/api/products/upload-image', uploadProducts.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  // Devolver la URL relativa para guardar en el producto
  const imageUrl = `/images/products/${req.file.filename}`;
  res.json({ imageUrl });
});

// Nuevo Endpoint para subir imagen de categoría
app.post('/api/categories/upload-image', uploadCategories.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  const imageUrl = `/images/categories/${req.file.filename}`;
  res.json({ imageUrl });
});

// Endpoint para marcar/desmarcar una categoría como featured
app.put('/api/categories/:id/featured', async (req, res) => {
  const { featured } = req.body;
  try {
    const [updated] = await Category.update({ featured: !!featured }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.id);
      return res.json(updatedCategory);
    }
    return res.status(404).json({ error: 'Categoría no encontrada' });
  } catch (error) {
    console.error('Error al actualizar estado de categoría destacada:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Middleware de verificación de roles
function requireRole(role) {
  return (req, res, next) => {
    // Suponiendo que el usuario ya está autenticado y su rol está en req.user.role
    // En un sistema real, deberías extraer el usuario del token JWT o sesión
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol ' + role });
    }
    next();
  };
}

// Ejemplo de uso en un endpoint sensible (eliminar producto)
// app.delete('/api/products/:id', requireRole('admin'), async (req, res, next) => {
//   try {
//     const deleted = await Producto.destroy({ where: { id: req.params.id } });
//     if (deleted) {
//       return res.status(204).json({ message: 'Producto eliminado' });
//     }
//     return res.status(404).json({ error: 'Producto no encontrado' });
//   } catch (error) {
//     next(error);
//   }
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
