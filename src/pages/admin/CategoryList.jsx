import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye } from 'react-icons/fa';
import './CategoryList.css';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const categoriesPerPage = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
      setCategories(savedCategories);
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
    <div className="category-list-page">
      <div className="page-header">
        <div className="header-main">
          <h1>Categorías</h1>
          <Link to="/admin/categories/new" className="add-category-button">
            <FaPlus /> Agregar Categoría
          </Link>
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando categorías...</div>
      ) : currentCategories.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron categorías{searchTerm && ' que coincidan con la búsqueda'}.</p>
          <Link to="/admin/categories/new" className="add-category-link">
            Agregar nueva categoría
          </Link>
        </div>
      ) : (
        <>
          <div className="categories-grid">
            {currentCategories.map(category => (
              <div key={category.id} className="category-card">
                <div className="category-image">
                  <img 
                    src={category.image || 'https://via.placeholder.com/200?text=Categoría'} 
                    alt={category.name} 
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <p className="product-count">
                    {category.products?.length || 0} productos
                  </p>
                </div>
                <div className="category-actions">
                  <Link to={`/admin/categories/${category.id}`} className="view-button">
                    <FaEye /> Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-button"
              >
                Anterior
              </button>
              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-button"
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