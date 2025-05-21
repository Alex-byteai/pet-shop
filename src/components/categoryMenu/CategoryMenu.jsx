import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
                {category.subcategories.map((subcategory, index) => (
                  <div 
                    key={index}
                    className="subcategory-item"
                    onClick={() => {
                      navigate(`/search?category=${category.id}&subcategory=${encodeURIComponent(subcategory)}`);
                      setIsOpen(false);
                    }}
                  >
                    {subcategory}
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