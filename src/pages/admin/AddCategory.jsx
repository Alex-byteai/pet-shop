import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();


    // Simular guardado usando localStorage
    const existing = JSON.parse(localStorage.getItem('categories')) || [];
    const updated = [...existing, categoryName];
    localStorage.setItem('categories', JSON.stringify(updated));


    // Redirigir
    navigate('/admin/categories');
  };


  return (
    <div>
      <h2>Agregar Nueva Categoría</h2>
      <form onSubmit={handleSubmit}>
        <br />
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};


export default AddCategory;


