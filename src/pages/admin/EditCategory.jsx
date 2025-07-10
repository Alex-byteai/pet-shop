import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { getCategoryById, updateCategory, setCategoryFeatured, uploadCategoryImage } from '../../services/api';
import './EditCategory.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function EditCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const subcatInputRef = useRef(null);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const category = await getCategoryById(categoryId);

      if (!category) {
        setError('Categoría no encontrada');
        setLoading(false);
        return;
      }

      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: null,
      });
      setSubcategories(Array.isArray(category.subcategories)
        ? category.subcategories.map(s => typeof s === 'string' ? s : s.name)
        : []);

      setImagePreview(category.image ? (category.image.startsWith('http') ? category.image : API_BASE_URL + category.image) : null);
      setIsFeatured(!!category.featured);
    } catch (error) {
      console.error('Error al cargar la categoría:', error);
      setError('Error al cargar los datos de la categoría.');
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
    } else {
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: null }));
    }
  };

  const handleAddSubcategory = (e) => {
    const value = subcatInputRef.current.value.trim();
    if (value && !subcategories.includes(value)) {
      setSubcategories(prev => [...prev, value]);
      subcatInputRef.current.value = '';
    }
  };

  const handleSubcatInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubcategory();
    }
  };

  const handleRemoveSubcategory = (name) => {
    setSubcategories(prev => prev.filter(s => s !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.description.trim()) throw new Error('La descripción es obligatoria');

      let finalImageUrl = imagePreview;

      if (formData.image instanceof File) {
        finalImageUrl = await uploadCategoryImage(formData.image);
      } else if (imagePreview && !imagePreview.startsWith('http')) {
        finalImageUrl = null;
      }

      // Si la imagen es una URL absoluta, conviértela a relativa
      if (typeof finalImageUrl === 'string' && finalImageUrl.startsWith(API_BASE_URL)) {
        finalImageUrl = finalImageUrl.replace(API_BASE_URL, '');
      }

      const subcategoriesArray = subcategories;

      const updatedCategoryData = {
        name: formData.name,
        description: formData.description,
        image: finalImageUrl,
        subcategories: subcategoriesArray,
        featured: isFeatured,
        updatedAt: new Date().toISOString()
      };

      await updateCategory(categoryId, updatedCategoryData);

      alert('Categoría actualizada correctamente!');
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      setError(error.message || 'Ocurrió un error al actualizar la categoría.');
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
      <button onClick={() => navigate('/admin/categories')} className="back-button">
          <FaArrowLeft /> Volver al listado
        </button>
      <div className="page-header">
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
          <label htmlFor="subcategories">Subcategorías</label>
         <div className="subcategory-chips-container">
           {subcategories.map((sub, idx) => (
             <span key={sub} className="subcategory-chip">
               {sub}
               <button type="button" className="remove-chip-btn" onClick={() => handleRemoveSubcategory(sub)}>&times;</button>
             </span>
           ))}
           <div className="add-subcategory-form">
             <input
               type="text"
               ref={subcatInputRef}
               placeholder="Agregar subcategoría y Enter"
               className="add-subcategory-input"
               maxLength={40}
               onKeyDown={handleSubcatInputKeyDown}
             />
             <button type="button" className="add-chip-btn" onClick={handleAddSubcategory}>Agregar</button>
           </div>
         </div>
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

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label htmlFor="isFeatured">Marcar como Categoría Destacada</label>
        </div>

        <button type="submit" className="submit-button" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
} 