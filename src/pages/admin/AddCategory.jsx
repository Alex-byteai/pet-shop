import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { createCategory, uploadCategoryImage } from '../../services/api';
import './AddCategory.css';

export default function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null, // This will hold the File object for new uploads
    subcategories: '', // For easier input, will convert to array on submit
    featured: false // New field
  });
  const [imagePreview, setImagePreview] = useState(null); // This will hold the URL for display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');

      let finalImageUrl = null;
      if (formData.image instanceof File) {
        finalImageUrl = await uploadCategoryImage(formData.image);
      }

      const subcategoriesArray = formData.subcategories
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newCategoryData = {
        name: formData.name,
        description: formData.description,
        image: finalImageUrl,
        subcategories: subcategoriesArray,
        featured: formData.featured,
        createdAt: new Date().toISOString()
      };

      await createCategory(newCategoryData);

      alert('Categoría agregada correctamente!');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      setError(error.message || 'Ocurrió un error al agregar la categoría.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/categories')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
        <h1>Agregar Nueva Categoría</h1>
      </div>

      <form onSubmit={handleSubmit} className="category-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre de la Categoría *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ingrese el nombre de la categoría"
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
            placeholder="Ingrese la descripción de la categoría"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subcategories">Subcategorías (separadas por coma)</label>
          <input
            type="text"
            id="subcategories"
            name="subcategories"
            value={formData.subcategories}
            onChange={handleInputChange}
            placeholder="Ej: Alimento Seco, Alimento Húmedo"
          />
        </div>

        <div className="form-group">
          <label>Imagen de la Categoría</label>
          <div className="image-upload-container">
            <label htmlFor="image" className="image-upload-button">
              <FaUpload />
              <span>Seleccionar imagen</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden-input"
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Vista previa" />
            </div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
          />
          <label htmlFor="featured">Marcar como Categoría Destacada</label>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </form>
    </div>
  );
} 