import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTimesCircle } from 'react-icons/fa';
import { getProductById, updateProduct, uploadProductImage } from '../../services/api';
import { getCategories } from '../../services/api';
import './EditProduct.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    rating: '',
    categoryId: '',
    subcategoryId: '',
    images: [],
    isNew: false,
    isBestSeller: false,
    active: true
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
      // Una vez cargadas las categorías, carga el producto
      await loadProduct(cats);
    } catch (err) {
      setError('Error al cargar categorías');
    }
  };

  // Actualizar subcategorías cuando cambie la categoría seleccionada o al cargar producto y categorías
  useEffect(() => {
    if (formData.categoryId && categories.length > 0) {
      const selectedCat = categories.find(cat => cat.id === parseInt(formData.categoryId));
      setSubcategories(Array.isArray(selectedCat?.subcategories) ? selectedCat.subcategories : []);
    } else {
      setSubcategories([]);
    }
  }, [formData.categoryId, categories]);

  const loadProduct = async (cats) => {
    setLoading(true);
    setError(null);
    try {
      const product = await getProductById(productId);

      if (!product) {
        setError('Producto no encontrado');
        setLoading(false);
        return;
      }

      // Usar las categorías ya cargadas para setear subcategorías correctas
      const categoryId = product.category?.id ? product.category.id.toString() : '';
      const subcategoryId = product.productSubcategory?.id ? product.productSubcategory.id.toString() : '';
      let subs = [];
      if (categoryId && cats && cats.length > 0) {
        const selectedCat = cats.find(cat => cat.id === parseInt(categoryId));
        subs = Array.isArray(selectedCat?.subcategories) ? selectedCat.subcategories : [];
        setSubcategories(subs);
      }
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        brand: product.brand || '',
        rating: product.rating?.toString() || '',
        categoryId,
        subcategoryId: subs.some(sub => String(sub.id) === String(subcategoryId)) ? subcategoryId : '',
        images: [],
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        active: product.active !== false
      });

      setImagePreview(product.images ? product.images.map(img => img.startsWith('http') ? img : API_BASE_URL + img) : []);

    } catch (error) {
      console.error('Error al cargar el producto:', error);
      setError('Error al cargar los datos del producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Limpiar subcategoría solo si el usuario cambia la categoría manualmente
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
    const newPreviews = [];
    const imageFiles = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
      imageFiles.push(file);
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }));
  };

  const removeImage = (indexToRemove) => {
    setImagePreview(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        throw new Error('El precio debe ser un número mayor a 0');
      }
      if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0');
      }
      if (!formData.brand.trim()) throw new Error('La marca es obligatoria');
      if (!formData.rating || isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5) {
        throw new Error('La calificación debe ser un número entre 0 y 5');
      }
      if (!formData.categoryId) throw new Error('La categoría es obligatoria');
      if (!formData.subcategoryId) throw new Error('La subcategoría es obligatoria');

      let newImageUrls = [];
      const filesToUpload = formData.images.filter(img => img instanceof File);

      if (filesToUpload.length > 0) {
        newImageUrls = await Promise.all(
          filesToUpload.map(file => uploadProductImage(file))
        );
      }

      const existingImageUrls = imagePreview
        .filter(src => typeof src === 'string')
        .map(src => {
          // Si es absoluta, conviértela a relativa
          if (src.startsWith(API_BASE_URL)) {
            return src.replace(API_BASE_URL, '');
          }
          return src;
        });
      const allImages = [...existingImageUrls, ...newImageUrls];

      const updatedProductData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        brand: formData.brand,
        rating: parseFloat(formData.rating),
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        images: allImages,
        active: formData.active,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        updatedAt: new Date().toISOString()
      };

      await updateProduct(productId, updatedProductData);

      alert('Producto actualizado correctamente!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError(error.message || 'Ocurrió un error al actualizar el producto.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (error && !formData.name) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/admin/products')} className="back-button">
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/products')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
        <h1>Editar Producto</h1>
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
          <label htmlFor="brand">Nombre de la marca *</label>
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
          <label htmlFor="rating">Calificación *</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            placeholder="Ingrese la calificación del producto (0 a 5)"
            min="0"
            max="5"
            step="0.1"
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

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleInputChange}
          />
          <label htmlFor="active">Producto Activo (visible en la tienda)</label>
        </div>

        <div className="form-group">
          <label>Imágenes del Producto</label>
          <div className="image-preview-container">
            {imagePreview.map((src, index) => (
              <div key={index} className="image-preview-item">
                <img src={src} alt="Vista previa" className="image-preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-image-button"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
          <div className="image-upload-container">
            <label htmlFor="images" className="image-upload-button">
              <FaUpload />
              <span>Seleccionar más imágenes</span>
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
        </div>

        <button type="submit" className="submit-button" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
} 