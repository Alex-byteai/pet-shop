import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topProducts } from '../../data/topProducts';
import { newProducts } from '../../data/newProducts';
import './ProductMenu.css';

const ProductMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
                    <img src={product.images[0]} alt={product.name} />
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
                    <img src={product.images[0]} alt={product.name} />
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