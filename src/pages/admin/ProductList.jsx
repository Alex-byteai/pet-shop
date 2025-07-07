import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getAllProducts, updateProduct } from '../../services/api'; // Cambiado getProducts a getAllProducts
import './ProductList.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await getAllProducts(); // Obtener TODOS los productos de la API para el admin
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      const productToUpdate = products.find(p => p.id === productId);
      if (!productToUpdate) return;

      const updatedProduct = { ...productToUpdate, active: !productToUpdate.active };
      await updateProduct(productId, { active: updatedProduct.active }); // Actualizar en el backend
      
      // Actualizar el estado local después de la actualización exitosa en el backend
      setProducts(prevProducts => 
        prevProducts.map(p => (p.id === productId ? updatedProduct : p))
      );
      setShowConfirmModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error al actualizar estado del producto:', error);
      alert('Error al actualizar el estado del producto.');
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
      currency: 'USD'
    }).format(price);
  };

  const ConfirmationModal = () => (
    <div className="pl-modal-overlay">
      <div className="pl-modal-content">
        <h3>{selectedProduct?.active ? 'Desactivar' : 'Activar'} Producto</h3>
        <p>¿Estás seguro de que deseas {selectedProduct?.active ? 'desactivar' : 'activar'} el producto "{selectedProduct?.name}"?</p>
        {selectedProduct?.active && (
          <p className="pl-warning">El producto no se mostrará en la tienda después de ser desactivado.</p>
        )}
        <div className="pl-modal-actions">
          <button 
            onClick={() => handleToggleProductStatus(selectedProduct.id)}
            className="pl-confirm-button"
          >
            Sí, {selectedProduct?.active ? 'desactivar' : 'activar'} producto
          </button>
          <button 
            onClick={() => {
              setShowConfirmModal(false);
              setSelectedProduct(null);
            }}
            className="pl-cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pl-product-list-page">
      <div className="pl-page-header">
        <div className="pl-header-main">
          <h1>Productos</h1>
          <Link to="/admin/products/new" className="pl-add-product-button">
            <FaPlus /> Agregar Producto
          </Link>
        </div>
        <div className="pl-search-box">
          <FaSearch className="pl-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, serie o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="pl-loading">Cargando productos...</div>
      ) : currentProducts.length === 0 ? (
        <div className="pl-no-results">
          <p>No se encontraron productos{searchTerm && ' que coincidan con la búsqueda'}.</p>
          <Link to="/admin/products/new" className="pl-add-product-link">
            Agregar nuevo producto
          </Link>
        </div>
      ) : (
        <>
          <div className="pl-products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className={`pl-product-card ${!product.active ? 'pl-inactive' : ''}`}>
                <div className="pl-product-image">
                  <img 
                    src={product.images && product.images[0] ? (product.images[0].startsWith('http') ? product.images[0] : API_BASE_URL + product.images[0]) : '/src/assets/placeholder.png'}
                    alt={product.name} 
                  />
                  {!product.active && (
                    <div className="pl-inactive-overlay">
                      <span>Inactivo</span>
                    </div>
                  )}
                </div>
                <div className="pl-product-info">
                  <h3>{product.name}</h3>
                  <p className="pl-product-series">{product.series || 'Sin serie'}</p>
                  <p className="pl-product-price">{formatPrice(product.price)}</p>
                  <p className="pl-product-stock">Stock: {product.stock}</p>
                </div>
                <div className="pl-product-actions">
                  <Link to={`/admin/products/${product.id}`} className="pl-view-button">
                    <FaEye /> Ver detalle
                  </Link>
                  <button
                    className={`pl-toggle-status-button ${product.active ? 'pl-deactivate' : 'pl-activate'}`}
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
            <div className="pl-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pl-page-button"
              >
                Anterior
              </button>
              <span className="pl-page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pl-page-button"
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