import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import { Usuario } from './models/Usuario.js';
import { Address } from './models/Address.js';
import { Producto } from './models/producto.js';
import { Category } from './models/category.js';
import { Subcategory } from './models/Subcategory.js';
import { Order } from './models/order.js';
import { Item } from './models/Item.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

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
    cb(null, path.join(__dirname, 'public/images/categories'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'category-' + uniqueSuffix + ext);
  }
});
const uploadCategories = multer({ storage: storageCategories });

// Servir imágenes estáticas
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Sincronizar modelos
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conexión y sincronización con la BD exitosa');
  } catch (error) {
    console.error('Error al conectar/sincronizar la BD:', error);
  }
})();

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Producto.findAll({ where: { active: true } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/all', async (req, res) => {
  try {
    const products = await Producto.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Producto.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Producto.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const [updated] = await Producto.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    const product = await Producto.findByPk(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Producto.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar producto' });
  }
});

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: [{ model: Subcategory, as: "subcategories" }] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Subcategory, as: "subcategories" }] });
    if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear categoría' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Categoría no encontrada' });
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar categoría' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar categoría' });
  }
});

// --- USERS ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await Usuario.findAll({ include: [{ model: Address, as: "address" }] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id, { include: [{ model: Address, as: "address" }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await Usuario.create(req.body, { include: [{ model: Address, as: "address" }] });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const [updated] = await Usuario.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
    const user = await Usuario.findByPk(req.params.id, { include: [{ model: Address, as: "address" }] });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await Usuario.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [{ model: Item, as: "items" }] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: Item, as: "items" }] });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

app.get('/api/orders/user/:userid', async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userid: req.params.userid }, include: [{ model: Item, as: "items" }] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener órdenes del usuario' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body, { include: [{ model: Item, as: "items" }] });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear orden' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, { where: { orderid: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Orden no encontrada' });
    const order = await Order.findByPk(req.params.id, { include: [{ model: Item, as: "items" }] });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar orden' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { orderid: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json({ message: 'Orden eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar orden' });
  }
});

app.get('/api/products/top', async (req, res) => {
  try {
    const bestSellers = await Producto.findAll({ where: { isBestSeller: true } });
    if (bestSellers.length > 0) return res.json(bestSellers);
    const topProducts = await Producto.findAll({
      order: [['soldCount', 'DESC']],
      limit: 10
    });
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos top' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// --- CATEGORÍAS DESTACADAS ---
app.get('/api/categories/featured', async (req, res) => {
  try {
    const featured = await Category.findAll({ where: { featured: true } });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías destacadas' });
  }
});

// --- PRODUCTOS NUEVOS ---
app.get('/api/products/new', async (req, res) => {
  try {
    const newOnes = await Producto.findAll({ where: { isNew: true } });
    if (newOnes.length > 0) return res.json(newOnes);
    const newProducts = await Producto.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(newProducts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos nuevos' });
  }
});

// --- RECUPERACIÓN DE CONTRASEÑA (básico, requiere campos en modelo Usuario) ---
app.post('/api/users/recover-password-request', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Simulación: agrega campos recoveryCode y recoveryExpires si no existen en el modelo
    user.recoveryCode = Math.floor(100000 + Math.random() * 900000);
    user.recoveryExpires = Date.now() + 3600000;
    await user.save();

    res.json({ message: 'Código de recuperación enviado (simulado)', recoveryCode: user.recoveryCode });
  } catch (err) {
    res.status(500).json({ error: 'Error en recuperación de contraseña' });
  }
});

app.post('/api/users/verify-recovery-code', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || user.recoveryCode !== parseInt(code) || Date.now() > user.recoveryExpires) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }
    res.json({ message: 'Código verificado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar código' });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  const { email, newPassword, code } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || user.recoveryCode !== parseInt(code) || Date.now() > user.recoveryExpires) {
      return res.status(400).json({ error: 'Código de verificación inválido o expirado' });
    }
    user.password = newPassword;
    user.recoveryCode = null;
    user.recoveryExpires = null;
    await user.save();
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});

// --- BUSCAR USUARIO POR EMAIL ---
app.get('/api/users/search', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar usuario' });
  }
});

// --- SUBIDA DE IMÁGENES DE PRODUCTO ---
app.post('/api/products/upload-image', uploadProducts.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  const imageUrl = `/images/products/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- SUBIDA DE IMÁGENES DE CATEGORÍA ---
app.post('/api/categories/upload-image', uploadCategories.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }
  const imageUrl = `/images/categories/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- MARCAR/DESMARCAR CATEGORÍA COMO FEATURED ---
app.put('/api/categories/:id/featured', async (req, res) => {
  const { featured } = req.body;
  try {
    const [updated] = await Category.update({ featured: !!featured }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Categoría no encontrada' });
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar categoría destacada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
