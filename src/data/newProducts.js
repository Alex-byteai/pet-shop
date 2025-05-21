import { products } from './products';

// Obtener los productos nuevos
export const newProducts = products.filter(product => product.isNew); 