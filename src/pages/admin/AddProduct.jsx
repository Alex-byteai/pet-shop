import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import './AddProduct.css';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    series: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        throw new Error('El precio debe ser un número mayor a 0');
      }
      if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0');
      }

      const imageUrls = await Promise.all(
        formData.images.map(file => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }))
      );

      // Obtener productos existentes
      const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
      
      // Crear nuevo producto
      const newProduct = {
        id: Date.now(), 
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        series: formData.series,
        images: imageUrls,
        active: true,
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));

      // Redireccionar a la lista de productos
      navigate('/admin/products');
    } catch (error) {
      setError(error.message);
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
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
} 