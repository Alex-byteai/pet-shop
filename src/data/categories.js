import category1 from '../assets/images/categories/category-1.png';
import category2 from '../assets/images/categories/category-2.png';
import category3 from '../assets/images/categories/category-3.png';
import category4 from '../assets/images/categories/category-4.png';

export const categories = [
  {
    id: 1,
    name: 'Alimentos',
    image: category1,
    subcategories: ['Alimento Seco', 'Alimento Húmedo', 'Snacks y Premios', 'Suplementos'],
    description: 'Encuentra la mejor selección de alimentos para tu mascota'
  },
  {
    id: 2,
    name: 'Accesorios',
    image: category2,
    subcategories: ['Collares', 'Correas', 'Camas', 'Juguetes', 'Transportadoras'],
    description: 'Todo lo que necesitas para el confort de tu mascota'
  },
  {
    id: 3,
    name: 'Higiene y Cuidado',
    image: category3,
    subcategories: ['Shampoo', 'Cepillos', 'Arena para Gatos', 'Limpieza'],
    description: 'Productos para mantener a tu mascota limpia y saludable'
  },
  {
    id: 4,
    name: 'Salud',
    image: category4,
    subcategories: ['Antiparasitarios', 'Vitaminas', 'Medicamentos', 'Cuidado Dental'],
    description: 'Productos para el cuidado de la salud de tu mascota'
  },
  {
    id: 5,
    name: 'Ropa y Moda',
    image: category1, // Puedes cambiar esto cuando tengas la imagen específica
    subcategories: ['Abrigos', 'Camisetas', 'Disfraces', 'Accesorios de Moda'],
    description: 'Mantén a tu mascota con estilo'
  }
]; 