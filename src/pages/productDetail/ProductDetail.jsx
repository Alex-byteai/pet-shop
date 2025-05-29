import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import { categories } from '../../data/categories';
import { FaCartPlus } from "react-icons/fa6";
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
      <div className="pd-container">
        <h1 className="pd-title">Producto no encontrado</h1>
        <button
          onClick={() => navigate('/')}
          className="pd-button"
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
    <div className="pd-container">
      <div className="pd-grid">
        {/* Galería de imágenes */}
        <div className="pd-image-container">
          <div className="pd-main-image">
            <img
              src={mainImage}
              alt={product.name}
              className="pd-image"
            />
            {product.isNew && (
              <span className="pd-new-badge">
                Nuevo
              </span>
            )}
          </div>
          <div className="pd-thumbnail-images">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`pd-thumbnail ${mainImage === image ? 'pd-active' : ''}`}
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
        <div className="pd-info">
          <nav className="pd-category">
            {category?.name} / {product.subcategory}
          </nav>
          <div className="pd-title-container">
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-brand">{product.brand}</p>
          </div>
          
          <div className="pd-price-container">
            <span className="pd-price">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 && (
              <span className="pd-stock-info">
                Stock disponible: {product.stock}
              </span>
            )}
          </div>

          <div className="pd-quantity-container">
            <div className="pd-quantity-controls">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="pd-quantity-button"
              >
                -
              </button>
              <span className="pd-quantity-value">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="pd-quantity-button"
              >
                +
              </button>
            </div>
            <div 
              onClick={product.stock === 0 ? undefined : handleAddToCart}
              className={`pd-cart-icon-wrapper ${product.stock === 0 ? 'pd-disabled' : ''}`}
              title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            >
              <FaCartPlus className="pd-cart-icon" />
            </div>
          </div>

          <div className="pd-description">
            <h2 className="pd-section-title">Descripción</h2>
            <p className="pd-description-text">{product.description}</p>
          </div>

          <div className="pd-characteristics">
            <h2 className="pd-section-title">Características</h2>
            <div className="pd-characteristics-grid">
              <div className="pd-characteristic-item">
                <span className="pd-characteristic-label">Categoría:</span>
                <p className="pd-characteristic-value">{category?.name}</p>
              </div>
              <div className="pd-characteristic-item">
                <span className="pd-characteristic-label">Subcategoría:</span>
                <p className="pd-characteristic-value">{product.subcategory}</p>
              </div>
              <div className="pd-characteristic-item">
                <span className="pd-characteristic-label">Marca:</span>
                <p className="pd-characteristic-value">{product.brand}</p>
              </div>
              <div className="pd-characteristic-item">
                <span className="pd-characteristic-label">Calificación:</span>
                <p className="pd-characteristic-value">{product.rating} / 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 