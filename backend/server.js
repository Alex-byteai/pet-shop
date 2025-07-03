import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import multer from 'multer';

// __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app
const app = express();
app.use(express.json());
app.use(cors());

// Utilidades para leer y escribir archivos JSON
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf-8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
}

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

// Endpoints para productos
app.get('/api/products', (req, res) => {
  const products = readJSON('products.json');
  // Filtrar solo productos activos para el frontend general
  const activeProducts = products.filter(p => p.active !== false);
  res.json(activeProducts);
});

app.get('/api/products/top', (req, res) => {
  const products = readJSON('products.json');
  // Si hay productos marcados como isBestSeller, devolver solo esos
  const bestSellers = products.filter(p => p.isBestSeller);
  if (bestSellers.length > 0) {
    return res.json(bestSellers);
  }
  // Si no, usar soldCount como fallback
  const topProducts = products
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 10);
  res.json(topProducts);
});

app.get('/api/products/new', (req, res) => {
  const products = readJSON('products.json');
  // Si hay productos marcados como isNew, devolver solo esos
  const newOnes = products.filter(p => p.isNew);
  if (newOnes.length > 0) {
    return res.json(newOnes);
  }
  // Si no, usar createdAt como fallback
  const newProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
  res.json(newProducts);
});

// Nuevo endpoint para obtener TODOS los productos (activos e inactivos) para el admin
app.get('/api/products/all', (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const products = readJSON('products.json');
  const newProduct = { ...req.body, id: Date.now() };
  products.push(newProduct);
  writeJSON('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  products[idx] = { ...products[idx], ...req.body };
  writeJSON('products.json', products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  const deleted = products.splice(idx, 1);
  writeJSON('products.json', products);
  res.json(deleted[0]);
});

// Endpoints para categorías
app.get('/api/categories', (req, res) => {
  const categories = readJSON('categories.json');
  res.json(categories);
});

app.get('/api/categories/featured', (req, res) => {
  const categories = readJSON('categories.json');
  const featuredCategories = categories.filter(cat => cat.featured === true);
  res.json(featuredCategories);
});

app.get('/api/categories/:id', (req, res) => {
  const categories = readJSON('categories.json');
  const category = categories.find(c => c.id === parseInt(req.params.id));
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(category);
});

// Endpoints para usuarios
app.get('/api/users', (req, res) => {
  const users = readJSON('users.json');
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const users = readJSON('users.json');
  const newUser = { ...req.body, id: Date.now(), registerDate: new Date().toISOString() };
  users.push(newUser);
  writeJSON('users.json', users);
  res.status(201).json(newUser);
});

app.get('/api/users/search', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  const users = readJSON('users.json');
  const user = users.find(
    u => u.email.toLowerCase() === String(email).toLowerCase()
  );

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  users[idx] = { ...users[idx], ...req.body };
  writeJSON('users.json', users);
  res.json(users[idx]);
});

app.delete('/api/users/:id', (req, res) => {
  let users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  const deleted = users.splice(idx, 1);
  writeJSON('users.json', users);
  res.json(deleted[0]);
});

// Endpoints para recuperación de contraseña
app.post('/api/users/recover-password-request', (req, res) => {
  const { email } = req.body;
  let users = readJSON('users.json');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const recoveryCode = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
  const recoveryExpires = Date.now() + 3600000; // 1 hora de validez

  user.recoveryCode = recoveryCode;
  user.recoveryExpires = recoveryExpires;
  writeJSON('users.json', users);

  // En una aplicación real, aquí enviarías el código por email.
  // Por ahora, lo enviamos en la respuesta para propósito de demostración/depuración.
  res.json({ message: 'Código de recuperación enviado (simulado)', recoveryCode });
});

app.post('/api/users/verify-recovery-code', (req, res) => {
  const { email, code } = req.body;
  let users = readJSON('users.json');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.recoveryCode !== parseInt(code) || Date.now() > user.recoveryExpires) {
    return res.status(400).json({ error: 'Código inválido o expirado' });
  }

  res.json({ message: 'Código verificado correctamente' });
});

app.post('/api/users/reset-password', (req, res) => {
  const { email, newPassword, code } = req.body; // Incluir el código para una verificación final
  let users = readJSON('users.json');
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const user = users[userIdx];
  if (user.recoveryCode !== parseInt(code) || Date.now() > user.recoveryExpires) {
    return res.status(400).json({ error: 'Código de verificación inválido o expirado' });
  }

  user.password = newPassword;
  // Limpiar el código de recuperación después de usarlo
  delete user.recoveryCode;
  delete user.recoveryExpires;
  writeJSON('users.json', users);

  res.json({ message: 'Contraseña actualizada correctamente' });
});

app.post('/api/login', (req, res) => {
  const users = readJSON('users.json');
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json(user);
});

// Endpoints para órdenes
app.get('/api/orders', (req, res) => {
  const orders = readJSON('orders.json');
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readJSON('orders.json');
  const order = orders.find(o => o.orderid === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  res.json(order);
});

app.get('/api/orders/user/:userid', (req, res) => {
  const orders = readJSON('orders.json');
  const userOrders = orders.filter(o => o.userid === parseInt(req.params.userid));
  res.json(userOrders);
});

app.post('/api/orders', (req, res) => {
  const orders = readJSON('orders.json');
  const newOrder = { ...req.body, orderid: Date.now(), date: new Date().toISOString() };
  orders.push(newOrder);
  writeJSON('orders.json', orders);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  const orders = readJSON('orders.json');
  const idx = orders.findIndex(o => o.orderid === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Orden no encontrada' });
  orders[idx] = { ...orders[idx], ...req.body };
  writeJSON('orders.json', orders);
  res.json(orders[idx]);
});

app.delete('/api/orders/:id', (req, res) => {
  let orders = readJSON('orders.json');
  const idx = orders.findIndex(o => o.orderid === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Orden no encontrada' });
  const deleted = orders.splice(idx, 1);
  writeJSON('orders.json', orders);
  res.json(deleted[0]);
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
app.put('/api/categories/:id/featured', (req, res) => {
  const { featured } = req.body;
  const categories = readJSON('categories.json');
  const idx = categories.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Categoría no encontrada' });
  categories[idx].featured = !!featured;
  writeJSON('categories.json', categories);
  res.json(categories[idx]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
