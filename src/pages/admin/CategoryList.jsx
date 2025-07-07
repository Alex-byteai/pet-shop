import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaBox } from 'react-icons/fa';
import { getCategories, getProducts } from '../../services/api';
import './CategoryList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productCountByCategory, setProductCountByCategory] = useState({});
  
  const categoriesPerPage = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Calcular el conteo de productos por categoría
    const calculateProductCounts = async () => {
      try {
        const fetchedProducts = await getProducts();
        const countByCategory = fetchedProducts.reduce((acc, product) => {
          const catId = product.category?.id;
          if (catId) {
            acc[catId] = (acc[catId] || 0) + 1;
          }
          return acc;
        }, {});
        setProductCountByCategory(countByCategory);
      } catch (error) {
        console.error('Error al calcular el conteo de productos por categoría:', error);
      }
    };
    calculateProductCounts();
  }, [categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías
  const filteredCategories = categories.filter(category => {
    const searchTermLower = searchTerm.toLowerCase();
    return category.id.toString().includes(searchTermLower) ||
           category.name.toLowerCase().includes(searchTermLower) ||
           category.description.toLowerCase().includes(searchTermLower);
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  return (
    <div className="cl-category-list-page">
      <div className="cl-page-header">
        <div className="cl-header-main">
          <h1>Categorías</h1>
          <Link to="/admin/categories/new" className="cl-add-category-button">
            <FaPlus /> Agregar Categoría
          </Link>
        </div>
        <div className="cl-search-box">
          <FaSearch className="cl-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="cl-loading">Cargando categorías...</div>
      ) : currentCategories.length === 0 ? (
        <div className="cl-no-results">
          <p>No se encontraron categorías{searchTerm && ' que coincidan con la búsqueda'}.</p>
          <Link to="/admin/categories/new" className="cl-add-category-link">
            Agregar nueva categoría
          </Link>
        </div>
      ) : (
        <>
          <div className="cl-categories-grid">
            {currentCategories.map(category => (
              <div key={category.id} className="cl-category-card">
                <div className="cl-category-image">
                  <img 
                    src={category.image ? (category.image.startsWith('http') ? category.image : API_BASE_URL + category.image) : '/src/assets/placeholder.png'}
                    alt={category.name} 
                  />
                </div>
                <div className="cl-category-info">
                  <h3>{category.name}</h3>
                  <p className="cl-category-description">{category.description}</p>
                  <p className="cl-product-count">
                    <FaBox /> {productCountByCategory[category.id] || 0} productos
                  </p>
                </div>
                <div className="cl-category-actions">
                  <Link to={`/admin/categories/${category.id}`} className="cl-view-button">
                    <FaEye /> Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="cl-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cl-page-button"
              >
                Anterior
              </button>
              <span className="cl-page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="cl-page-button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 