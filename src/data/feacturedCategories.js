import { categories } from './categories';

import category1 from '../assets/images/categories/category-1.png'
import category2 from '../assets/images/categories/category-2.png'
import category3 from '../assets/images/categories/category-3.png'
import category4 from '../assets/images/categories/category-4.png'


// Seleccionar las 4 categorías más importantes
export const featuredCategories = [
  {
    id: categories[0].id,
    name: categories[0].name,
    description: 'Encuentra el mejor alimento para tu mascota con nuestras marcas premium.',
    image: category1,
    bgColor: '#a26e3c',
  },
  {
    id: categories[1].id,
    name: categories[1].name,
    description: 'Todo lo que necesitas para el confort y entretenimiento de tu mascota.',
    image: category2,
    bgColor: '#1c1c1c',
  },
  {
    id: categories[2].id,
    name: categories[2].name,
    description: 'Productos de calidad para mantener a tu mascota limpia y saludable.',
    image: category3,
    bgColor: '#1c1c1c',
  },
  {
    id: categories[3].id,
    name: categories[3].name,
    description: 'Productos de calidad para mantener a tu mascota limpia y saludable.',
    image: category4,
    bgColor: '#a26e3c',
  } 
];