import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import './EditCategory.css';

export default function EditCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = () => {
    try {
      const categories = JSON.parse(localStorage.getItem('categories')) || [];
      const category = categories.find(c => c.id === parseInt(categoryId));

      if (!category) {
        setError('Categoría no encontrada');
        return;
      }

      setFormData({
        name: category.name,
        description: category.description,
        image: null
      });

      setImagePreview(category.image);
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      setError('Error al cargar los datos de la categoría');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');

      // Convertir nueva imagen a URL si se ha seleccionado una
      let imageUrl = imagePreview;
      if (formData.image) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(formData.image);
        });
      }

      // Obtener categorías existentes
      const categories = JSON.parse(localStorage.getItem('categories')) || [];
      const categoryIndex = categories.findIndex(c => c.id === parseInt(categoryId));

      if (categoryIndex === -1) {
        throw new Error('Categoría no encontrada');
      }

      // Actualizar categoría
      const updatedCategory = {
        ...categories[categoryIndex],
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        updatedAt: new Date().toISOString()
      };

      categories[categoryIndex] = updatedCategory;
      localStorage.setItem('categories', JSON.stringify(categories));

      // Redireccionar a la lista de categorías
      navigate('/admin/categories');
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando categoría...</div>;
  }

  if (error && !formData.name) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/admin/categories')} className="back-button">
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="edit-category-page">
      <div className="page-header">
        <button onClick={() => navigate('/admin/categories')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
        <h1>Editar Categoría</h1>
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
              <span>Cambiar imagen</span>
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
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
} 