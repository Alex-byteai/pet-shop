# 🐾 Pet Shop - Proyecto Fullstack

Este es un sistema completo para la gestión de una tienda de mascotas, con backend (Node.js + Express + Sequelize) desplegado en Railway, frontend (React + Vite) y base de datos PostgreSQL.

---

## 🚀 Características

- **Frontend:** React + Vite con interfaz moderna y responsiva
- **Backend:** Node.js + Express + Sequelize
- **Base de datos:** PostgreSQL desplegada en Railway
- **Autenticación:** Sistema de login/registro con recuperación de contraseña
- **Gestión de productos:** CRUD completo con imágenes
- **Carrito de compras:** Funcionalidad completa
- **Panel de administración:** Gestión de usuarios, productos y órdenes
- **Despliegue:** Backend en Railway, Frontend en Vercel

---

## 📂 Estructura del proyecto

```
pet-shop/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── context/           # Contextos de React
│   ├── services/          # Servicios de API
│   └── ...
├── backend/               # Backend separado (repositorio independiente)
│   ├── models/           # Modelos de Sequelize
│   ├── config/           # Configuración de base de datos
│   ├── public/images/    # Imágenes estáticas
│   └── server.js         # Servidor Express
├── package.json
├── vite.config.js
└── ...
```

---

## ⚙️ Instalación y Configuración

### 1. Clona el repositorio del frontend

```bash
git clone <URL_DEL_REPO_FRONTEND>
cd pet-shop
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://tu-backend-production.up.railway.app
```

**Nota:** Reemplaza `tu-backend-production.up.railway.app` con la URL real de tu backend desplegado en Railway.

### 4. Inicia el frontend en desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 🗄️ Configuración del Backend

### Backend separado

El backend está en un repositorio independiente y debe configurarse por separado:

1. **Clona el repositorio del backend**
2. **Configura las variables de entorno** (base de datos Railway)
3. **Despliega en Railway** (ver sección de despliegue)

### Variables de entorno del backend

```env
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=tu_host
DB_DIALECT=postgres
DB_PORT=tu_puerto
```

---

## 🚀 Despliegue

### Desplegar el Backend en Railway

1. **Crea una cuenta en Railway:** [https://railway.app/](https://railway.app/)
2. **Crea un nuevo proyecto** y selecciona "Deploy from GitHub repo"
3. **Conecta tu repositorio del backend**
4. **Configura las variables de entorno** en Railway
5. **Despliega la base de datos PostgreSQL** en el mismo proyecto
6. **Obtén la URL de despliegue** (ej: `https://tu-backend-production.up.railway.app`)

### Desplegar el Frontend en Vercel

1. **Crea una cuenta en Vercel:** [https://vercel.com/](https://vercel.com/)
2. **Importa tu repositorio del frontend**
3. **Configura la variable de entorno:**
   - **Nombre:** `VITE_API_BASE_URL`
   - **Valor:** `https://tu-backend-production.up.railway.app`
4. **Haz clic en Deploy**

Vercel detectará automáticamente que es un proyecto Vite/React.

### Alternativa: Desplegar en Netlify

1. **Crea una cuenta en Netlify:** [https://app.netlify.com/](https://app.netlify.com/)
2. **Conecta tu repositorio de GitHub**
3. **Configura las variables de entorno** en la configuración del sitio
4. **Deploy automático** en cada push a main

---

## 🛠️ Scripts disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
npm run lint         # Ejecuta el linter
```

---

## 📱 Funcionalidades

### Usuario final
- ✅ Navegación por categorías y productos
- ✅ Búsqueda y filtrado de productos
- ✅ Carrito de compras
- ✅ Registro e inicio de sesión
- ✅ Gestión de perfil de usuario
- ✅ Historial de órdenes
- ✅ Recuperación de contraseña

### Administrador
- ✅ Panel de administración
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de categorías y subcategorías
- ✅ Gestión de usuarios
- ✅ Gestión de órdenes
- ✅ Subida de imágenes
- ✅ Estadísticas básicas

---

## 🔧 Tecnologías utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **Swiper** - Carousel/slider

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **Multer** - Manejo de archivos
- **CORS** - Cross-origin resource sharing

### Base de datos
- **PostgreSQL** - Base de datos relacional
- **Railway** - Plataforma de despliegue

---

## 🌐 URLs de ejemplo

### Backend (Railway)
- **API Base:** `https://tu-backend-production.up.railway.app/api`
- **Imágenes:** `https://tu-backend-production.up.railway.app/images`

### Frontend (Vercel)
- **Aplicación:** `https://tu-app.vercel.app`

---

## 🐛 Solución de problemas

### Error de conexión al backend
- Verifica que la URL en `VITE_API_BASE_URL` sea correcta
- Asegúrate de que el backend esté funcionando en Railway
- Revisa los logs de Railway para errores

### Imágenes no se cargan
- Verifica que las rutas de imágenes sean correctas
- Asegúrate de que las imágenes estén en `backend/public/images/`
- Confirma que el backend sirva archivos estáticos correctamente

### Error de CORS
- El backend ya tiene CORS configurado
- Si persiste, verifica la configuración en Railway

---

## 📝 Notas importantes

- **Backend y frontend son repositorios separados** para mejor escalabilidad
- **Las imágenes se sirven desde el backend** a través de `/images`
- **La base de datos se sincroniza automáticamente** al iniciar el backend
- **Variables de entorno** deben configurarse tanto en desarrollo como en producción

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.



