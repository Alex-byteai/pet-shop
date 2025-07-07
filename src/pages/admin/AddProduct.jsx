import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { createProduct, uploadProductImage, getCategories } from '../../services/api';
import './AddProduct.css';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    rating: '', // Inicializar como string para el input type="number"
    categoryId: '',
    subcategoryId: '',
    images: [],
    isNew: false,
    isBestSeller: false
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        setError('Error al cargar categorías.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      const selectedCat = categories.find(cat => cat.id === parseInt(formData.categoryId));
      setSubcategories(Array.isArray(selectedCat?.subcategories) ? selectedCat.subcategories : []);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId, categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: '' }));
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, subcategoryId: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const imageFiles = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        setImagePreview([...previews]);
      };
      reader.readAsDataURL(file);
      imageFiles.push(file);
    });

    setFormData(prev => ({
      ...prev,
      images: imageFiles
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio.');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria.');

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('El precio debe ser un número mayor a 0.');
      }

      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0.');
      }

      if (!formData.brand.trim()) {
        throw new Error('La marca es obligatoria.');
      }

      const rating = parseFloat(formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 5) { // Asumiendo escala de 0 a 5
        throw new Error('La calificación debe ser un número entre 0 y 5.');
      }

      if (!formData.categoryId) throw new Error('La categoría es obligatoria.');
      if (!formData.subcategoryId) throw new Error('La subcategoría es obligatoria.');

      // Subir imágenes al backend y obtener URLs
      let imageUrls = [];
      if (formData.images.length > 0) {
        imageUrls = await Promise.all(
          formData.images.map(file => uploadProductImage(file))
        );
      }

      // Crear nuevo producto para enviar al backend
      const newProductData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        brand: formData.brand.trim(),
        rating: rating,
        stock: stock,
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        images: imageUrls,
        active: true,
        createdAt: new Date().toISOString(),
        soldCount: 0,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller
      };

      // Enviar al backend
      await createProduct(newProductData);

      alert('¡Producto agregado correctamente!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setError(error.message || 'Ocurrió un error al agregar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/products')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
        <h1>Agregar Nuevo Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ingrese el nombre del producto"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Nombre de la Marca *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Ingrese el nombre de la marca"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Ingrese la descripción del producto"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Calificación *</label>
          <input
            type="number" // Cambiado a "number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            placeholder="Ej: 4.5" // Placeholder más descriptivo
            step="0.1"
            min="0"
            max="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Categoría *</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {formData.categoryId && (
          <div className="form-group">
            <label htmlFor="subcategoryId">Subcategoría *</label>
            <select
              id="subcategoryId"
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleSubcategoryChange}
              required
            >
              <option value="">Seleccione una subcategoría</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isNew"
            name="isNew"
            checked={formData.isNew}
            onChange={handleInputChange}
          />
          <label htmlFor="isNew">Marcar como Nuevo Producto</label>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isBestSeller"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleInputChange}
          />
          <label htmlFor="isBestSeller">Marcar como Producto Más Vendido</label>
        </div>

        <div className="form-group">
          <label>Imágenes del Producto</label>
          <div className="image-upload-container">
            <label htmlFor="images" className="image-upload-button">
              <FaUpload />
              <span>Seleccionar imágenes</span>
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden-input"
            />
          </div>

          {imagePreview.length > 0 && (
            <div className="image-preview-grid">
              {imagePreview.map((src, index) => (
                <div key={index} className="preview-item">
                  <img src={src} alt={`Vista previa ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="add-product-cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="add-product-submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}