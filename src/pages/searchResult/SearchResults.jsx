import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../../services/api';
import Card from '../../components/card/Card';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const subcategoryFromUrl = searchParams.get('subcategory') || '';

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getProducts();
        setAllProducts(fetchedProducts);
        const fetchedCategories = await getCategories();
        setAllCategories(fetchedCategories);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Establecer la categoría y subcategoría inicial desde la URL
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (subcategoryFromUrl) {
      setSelectedSubcategory(subcategoryFromUrl);
    }
  }, [categoryFromUrl, subcategoryFromUrl, allCategories]); // Add allCategories to dependencies

  // Obtener subcategorías de la categoría seleccionada
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    const category = allCategories.find(c => c.id === parseInt(selectedCategory));
    return category ? category.subcategories : [];
  };

  // Filtrar y ordenar productos cada vez que cambian los productos, filtros o orden
  useEffect(() => {
    let results = [...allProducts];

    // Filtrar por búsqueda si existe
    if (query) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtrar por categoría si está seleccionada
    if (selectedCategory) {
      results = results.filter(product => 
        product.category === parseInt(selectedCategory)
      );
    }

    // Filtrar por subcategoría si está seleccionada
    if (selectedSubcategory) {
      results = results.filter(product => 
        product.subcategory === selectedSubcategory
      );
    }

    // Ordenar resultados
    if (sortBy === 'price-asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(results);
  }, [query, selectedCategory, selectedSubcategory, sortBy, allProducts]);

  // Actualizar la URL cuando cambien los filtros
  const handleCategoryChange = (categoryId) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newSearchParams.set('category', categoryId);
      newSearchParams.delete('subcategory'); // Limpiar subcategoría al cambiar categoría
    } else {
      newSearchParams.delete('category');
      newSearchParams.delete('subcategory');
    }
    navigate(`/search?${newSearchParams.toString()}`);
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (subcategory) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (subcategory) {
      newSearchParams.set('subcategory', subcategory);
    } else {
      newSearchParams.delete('subcategory');
    }
    navigate(`/search?${newSearchParams.toString()}`);
    setSelectedSubcategory(subcategory);
  };

  if (loading) return <div className="search-results">Cargando productos...</div>;
  if (error) return <div className="search-results">Error: {error.message}</div>;

  return (
    <div className="search-results">
      <h1 className="search-results-title">
        {query ? `Resultados para: ${query}` : 'Todos los productos'}
        {selectedCategory && ` en ${allCategories.find(c => c.id === parseInt(selectedCategory))?.name}`}
        {selectedSubcategory && ` > ${selectedSubcategory}`}
      </h1>

      <div className="search-results-grid">
        {/* Filtros */}
        <div className="filters-panel">
          <div className="filter-section">
            <h2 className="filter-title">Categorías</h2>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las categorías</option>
              {allCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="filter-section">
              <h2 className="filter-title">Subcategorías</h2>
              <select
                value={selectedSubcategory}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las subcategorías</option>
                {getSubcategories().map((subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-section">
            <h2 className="filter-title">Ordenar por</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card key={product.id} {...product} />
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 


{/* <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                  </div>
                </div> */}