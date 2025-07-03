import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopProducts, getNewProducts } from '../../services/api';
import './ProductMenu.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const ProductMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [topProducts, setTopProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopProducts().then(setTopProducts);
    getNewProducts().then(setNewProducts);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="product-menu" onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="product-menu-button"
        onMouseEnter={() => setIsOpen(true)}
      >
        Productos
      </button>
      
      {isOpen && (
        <div className="product-dropdown">
          <div className="product-sections">
            <div className="product-section">
              <h3>Destacados</h3>
              <div className="product-links">
                <div onClick={() => handleNavigate('/search?sort=price-asc')}>Mejores Precios</div>
                <div onClick={() => handleNavigate('/search?sort=price-desc')}>Premium</div>
                <div onClick={() => handleNavigate('/search')}>Ver Todos</div>
              </div>
            </div>

            <div className="product-section">
              <h3>Más Vendidos</h3>
              <div className="product-highlights">
                {topProducts.slice(0, 3).map(product => (
                  <div 
                    key={product.id} 
                    className="product-highlight"
                    onClick={() => handleNavigate(`/product/${product.id}`)}
                  >
                    <img src={API_BASE_URL + product.images[0]} alt={product.name} />
                    <div className="highlight-info">
                      <span className="highlight-name">{product.name}</span>
                      <span className="highlight-price">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-section">
              <h3>Nuevos Productos</h3>
              <div className="product-highlights">
                {newProducts.slice(0, 3).map(product => (
                  <div 
                    key={product.id} 
                    className="product-highlight"
                    onClick={() => handleNavigate(`/product/${product.id}`)}
                  >
                    <img src={API_BASE_URL + product.images[0]} alt={product.name} />
                    <div className="highlight-info">
                      <span className="highlight-name">{product.name}</span>
                      <span className="highlight-price">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMenu; 