# 🐾 Pet Shop - Proyecto Fullstack

Este es un sistema completo para la gestión de una tienda de mascotas, con backend (Node.js + Express + Sequelize), frontend (React + Vite) y base de datos relacional.

---

## 🚀 Requisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL (o el motor que configures en tu .env)
- (Opcional) Git

---

## ⚙️ Instalación

### 1. Clona el repositorio

```bash
git clone <URL_DEL_REPO>
cd pet-shop
```

### 2. Configura las variables de entorno

- Copia los archivos de ejemplo y edítalos con tus datos reales:

```bash
cp backend/.env.example backend/.env
cp .env.example .env
```

- Edita los archivos `.env` y pon tus credenciales de base de datos y URL del backend.

### 3. Instala las dependencias

```bash
npm install
```

### 4. Prepara la base de datos

- Crea la base de datos en tu motor (ejemplo: PostgreSQL).
- Si tienes un script SQL de estructura y datos, ejecútalo.
- El backend creará las tablas automáticamente al iniciar si la conexión es correcta.

### 5. Inicia el backend

```bash
npm run start-backend
```

### 6. Inicia el frontend

En otra terminal:

```bash
npm run dev
```

---

## 📂 Estructura del proyecto

```
pet-shop/
├── backend/
│   ├── models/
│   ├── public/images/
│   ├── config/
│   ├── server.js
│   └── ...
├── src/
│   ├── pages/
│   ├── components/
│   └── ...
├── package.json
├── vite.config.js
└── ...
```

---

## 📝 Notas

- Las imágenes de productos y categorías deben estar en `backend/public/images/products` y `backend/public/images/categories`.
- Si usas otro motor de base de datos, cambia `DB_DIALECT` en el `.env`.
- Si tienes problemas, revisa los logs de la terminal para ver detalles de errores de conexión o dependencias.

---



