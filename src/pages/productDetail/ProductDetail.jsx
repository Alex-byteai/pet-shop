import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import './ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  const product = products.find(p => p.id === parseInt(productId));
  
  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (!product) { 
    return (
      <div className="product-detail">
        <h1 className="product-title">Producto no encontrado</h1>
        <button
          onClick={() => navigate('/')}
          className="add-to-cart-button"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === product.category);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Opcional: Mostrar una notificación de éxito
  };

  return (
    <div className="product-detail">
      <div className="product-grid">
        {/* Galería de imágenes */}
        <div className="product-image-container">
          <div className="main-image">
            <img
              src={mainImage}
              alt={product.name}
              className="product-image"
            />
            {product.isNew && (
              <span className="new-badge">
                Nuevo
              </span>
            )}
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                onClick={() => setMainImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - Vista ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
          <nav className="product-category">
            {category?.name} / {product.subcategory}
          </nav>

          <h1 className="product-title">{product.name}</h1>
          <p className="product-brand">{product.brand}</p>
          
          <div className="product-price-container">
            <span className="product-price">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 && (
              <span className="stock-info">
                Stock disponible: {product.stock}
              </span>
            )}
          </div>

          <div className="quantity-container">
            <div className="quantity-controls">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="quantity-button"
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="quantity-button"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="add-to-cart-button"
            >
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          <div className="product-description">
            <h2 className="section-title">Descripción</h2>
            <p className="description-text">{product.description}</p>
          </div>

          <div className="characteristics">
            <h2 className="section-title">Características</h2>
            <div className="characteristics-grid">
              <div className="characteristic-item">
                <span>Categoría:</span>
                <p>{category?.name}</p>
              </div>
              <div className="characteristic-item">
                <span>Subcategoría:</span>
                <p>{product.subcategory}</p>
              </div>
              <div className="characteristic-item">
                <span>Marca:</span>
                <p>{product.brand}</p>
              </div>
              <div className="characteristic-item">
                <span>Calificación:</span>
                <p>{product.rating} / 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 