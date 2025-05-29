import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import './AddCategory.css';

export default function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');

      // Convertir imagen a URL (en un entorno real, aquí se subiría a un servidor)
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(formData.image);
        });
      }

      // Obtener categorías existentes
      const existingCategories = JSON.parse(localStorage.getItem('categories')) || [];
      
      // Crear nueva categoría
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        products: [],
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem('categories', JSON.stringify([...existingCategories, newCategory]));

      // Redireccionar a la lista de categorías
      navigate('/admin/categories');
    } catch (error) {
      setError(error.message);
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

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
} 