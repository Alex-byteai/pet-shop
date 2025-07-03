import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaTimesCircle } from 'react-icons/fa';
import { getProductById, updateProduct, uploadProductImage } from '../../services/api';
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
    series: '',
    images: [],
    isNew: false,
    isBestSeller: false,
    active: true
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const product = await getProductById(productId);

      if (!product) {
        setError('Producto no encontrado');
        setLoading(false);
        return;
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        series: product.series || '',
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

      let newImageUrls = [];
      const filesToUpload = formData.images.filter(img => img instanceof File);

      if (filesToUpload.length > 0) {
        newImageUrls = await Promise.all(
          filesToUpload.map(file => uploadProductImage(file))
        );
      }

      const existingImageUrls = imagePreview.filter(src => src.startsWith('http'));
      const allImages = [...existingImageUrls, ...newImageUrls];

      const updatedProductData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        series: formData.series,
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
            <label htmlFor="price">Precio (€) *</label>
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
          <label htmlFor="series">Serie o Categoría</label>
          <input
            type="text"
            id="series"
            name="series"
            value={formData.series}
            onChange={handleInputChange}
            placeholder="Ingrese la serie o categoría del producto (opcional)"
          />
        </div>

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