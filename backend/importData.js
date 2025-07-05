import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Cambiado para buscar el .env en la carpeta backend

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DIALECT:', process.env.DB_DIALECT);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSequelizeInstance } from './config/database.js';
import { defineCategory } from './models/Category.js';
import { defineSubcategory } from './models/Subcategory.js';
import { defineProducto } from './models/Producto.js';
import { defineUsuario } from './models/Usuario.js';
import { defineAddress } from './models/Address.js';
import { defineOrder } from './models/Order.js';
import { defineItem } from './models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = getSequelizeInstance();
const Category = defineCategory(sequelize);
const Subcategory = defineSubcategory(sequelize);
const Producto = defineProducto(sequelize);
const Usuario = defineUsuario(sequelize);
const Address = defineAddress(sequelize);
const Order = defineOrder(sequelize);
const Item = defineItem(sequelize);

async function clearAllTables() {
  // El orden importa por las relaciones (hijos antes que padres)
  await Item.destroy({ where: {} });
  await Order.destroy({ where: {} });
  await Producto.destroy({ where: {} });
  await Subcategory.destroy({ where: {} }); // Limpiar subcategorías antes
  await Category.destroy({ where: {} });
  await Address.destroy({ where: {} });
  await Usuario.destroy({ where: {} });
}

async function importCategories() {
  const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json')));
  const categoryNameToId = {};
  const subcategoryNameToId = {};
  for (const cat of categoriesData) {
    const { subcategories, ...catData } = cat;
    // Crear la categoría primero
    const category = await Category.create(catData);
    categoryNameToId[category.name] = category.id;
    // Crear subcategorías asociadas
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      for (const sub of subcategories) {
        const subcat = await Subcategory.create({ name: sub, categoryId: category.id });
        subcategoryNameToId[`${sub}|${category.name}`] = subcat.id;
      }
    }
  }
  return { categoryNameToId, subcategoryNameToId };
}

async function importUsers() {
  const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/user.json')));
  const addressesData = fs.existsSync(path.join(__dirname, 'data/address.json'))
    ? JSON.parse(fs.readFileSync(path.join(__dirname, 'data/address.json')))
    : [];
  const oldUserIdToNewId = {};

  // Cargar todas las direcciones existentes en la tabla (sin usuario asignado)
  const existingAddresses = await Address.findAll({ where: { usuarioId: null } });

  for (const [i, user] of usersData.entries()) {
    const { address, id: oldId, ...userData } = user;
    const newUser = await Usuario.create(userData);

    // 1. Si el usuario tiene address anidado, crearla y asociarla
    if (address) {
      await Address.create({ ...address, usuarioId: newUser.id });
    } else {
      // 2. Si no, buscar una dirección sin usuario y asociarla (por orden)
      if (existingAddresses.length > 0) {
        const addr = existingAddresses.shift();
        await addr.update({ usuarioId: newUser.id });
      } else if (addressesData[i]) {
        // 3. Si tienes un address.json, puedes asociar por orden
        await Address.create({ ...addressesData[i], usuarioId: newUser.id });
      }
      // Si no hay dirección, el usuario queda sin address (está bien)
    }

    if (oldId !== undefined) {
      oldUserIdToNewId[oldId] = newUser.id;
    }
  }
  return oldUserIdToNewId;
}

async function importProducts(categoryNameToId, subcategoryNameToId) {
  const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json')));
  const oldProductIdToNewId = {};
  for (let i = 0; i < productsData.length; i++) {
    const prod = productsData[i];
    let categoryId = null;
    let subcategoryId = null;
    if (typeof prod.category === 'number') {
      const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json')));
      const catName = categoriesData[prod.category - 1]?.name;
      if (catName) categoryId = categoryNameToId[catName];
      if (prod.subcategory) {
        subcategoryId = subcategoryNameToId[`${prod.subcategory}|${catName}`] || null;
      }
    } else if (typeof prod.category === 'string') {
      categoryId = categoryNameToId[prod.category];
      if (prod.subcategory) {
        subcategoryId = subcategoryNameToId[`${prod.subcategory}|${prod.category}`] || null;
      }
    }
    const newProduct = await Producto.create({
      ...prod,
      categoryId,
      subcategoryId
    });
    oldProductIdToNewId[i + 1] = newProduct.id; // i+1 porque los productos.json usan 1-based index
  }
  return oldProductIdToNewId;
}

async function importOrders(oldUserIdToNewId, oldProductIdToNewId) {
  const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/orders.json')));
  for (const order of ordersData) {
    const { items, userid, ...orderData } = order;
    const newUserId = oldUserIdToNewId[userid] || null;
    const newOrder = await Order.create({
      ...orderData,
      usuarioId: newUserId
    });
    if (items && items.length > 0) {
      for (const item of items) {
        const newProductId = oldProductIdToNewId[item.productId] || null;
        await Item.create({
          orderId: newOrder.orderid,
          productId: newProductId,
          quantity: item.quantity
        });
      }
    }
  }
}

async function main() {
  try {
    await sequelize.sync({ force: false }); // Asegúrate de que las tablas existen
    await clearAllTables(); // Borra los datos antes de importar
    const { categoryNameToId, subcategoryNameToId } = await importCategories();
    const oldUserIdToNewId = await importUsers();
    const oldProductIdToNewId = await importProducts(categoryNameToId, subcategoryNameToId);
    await importOrders(oldUserIdToNewId, oldProductIdToNewId);
    console.log('Datos importados correctamente');
    process.exit(0);
  } catch (err) {
    console.error('Error importando datos:', err);
    process.exit(1);
  }
}

main(); 