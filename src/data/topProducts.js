import { products } from './products';

// Obtener los productos más vendidos
export const topProducts = products.filter(product => product.isBestSeller);

