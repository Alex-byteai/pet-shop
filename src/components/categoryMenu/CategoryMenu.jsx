import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/api';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?category=${categoryId}`);
    setIsOpen(false);
  };

  return (
    <div className="category-menu" onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="category-menu-button"
        onMouseEnter={() => setIsOpen(true)}
      >
        Categorías
      </button>
      
      {isOpen && (
        <div className="category-dropdown">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div 
                className="category-header"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </div>
              <div className="subcategories">
                {(Array.isArray(category.subcategories) ? category.subcategories : []).map((subcategory, index) => (
                  <div 
                    key={subcategory.id || index}
                    className="subcategory-item"
                    onClick={() => {
                      navigate(`/search?category=${category.id}&subcategory=${encodeURIComponent(subcategory.name)}`);
                      setIsOpen(false);
                    }}
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu; 