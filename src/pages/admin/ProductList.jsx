import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const productsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
      setProducts(savedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProductStatus = (productId) => {
    try {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return { ...product, active: !product.active };
        }
        return product;
      });
      
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setShowConfirmModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error al actualizar estado del producto:', error);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const searchTermLower = searchTerm.toLowerCase();
    return product.id.toString().includes(searchTermLower) ||
           product.name.toLowerCase().includes(searchTermLower) ||
           (product.series && product.series.toLowerCase().includes(searchTermLower));
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const ConfirmationModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{selectedProduct?.active ? 'Desactivar' : 'Activar'} Producto</h3>
        <p>¿Estás seguro de que deseas {selectedProduct?.active ? 'desactivar' : 'activar'} el producto "{selectedProduct?.name}"?</p>
        {selectedProduct?.active && (
          <p className="warning">El producto no se mostrará en la tienda después de ser desactivado.</p>
        )}
        <div className="modal-actions">
          <button 
            onClick={() => handleToggleProductStatus(selectedProduct.id)}
            className="confirm-button"
          >
            Sí, {selectedProduct?.active ? 'desactivar' : 'activar'} producto
          </button>
          <button 
            onClick={() => {
              setShowConfirmModal(false);
              setSelectedProduct(null);
            }}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="product-list-page">
      <div className="page-header">
        <div className="header-main">
          <h1>Productos</h1>
          <Link to="/admin/products/new" className="add-product-button">
            <FaPlus /> Agregar Producto
          </Link>
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, serie o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : currentProducts.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron productos{searchTerm && ' que coincidan con la búsqueda'}.</p>
          <Link to="/admin/products/new" className="add-product-link">
            Agregar nuevo producto
          </Link>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className={`product-card ${!product.active ? 'inactive' : ''}`}>
                <div className="product-image">
                  <img 
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/200'} 
                    alt={product.name} 
                  />
                  {!product.active && (
                    <div className="inactive-overlay">
                      <span>Inactivo</span>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-series">{product.series || 'Sin serie'}</p>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                </div>
                <div className="product-actions">
                  <Link to={`/admin/products/${product.id}`} className="view-button">
                    <FaEye /> Ver detalle
                  </Link>
                  <button
                    className={`toggle-status-button ${product.active ? 'deactivate' : 'activate'}`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowConfirmModal(true);
                    }}
                  >
                    {product.active ? (
                      <>
                        <FaToggleOff />
                        <span>Desactivar</span>
                      </>
                    ) : (
                      <>
                        <FaToggleOn />
                        <span>Activar</span>
                      </>
                    )}
                  </button>
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

      {showConfirmModal && <ConfirmationModal />}
    </div>
  );
} 