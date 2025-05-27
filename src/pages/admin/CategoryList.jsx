import { useEffect, useState } from 'react';


const CategoryList = () => {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = () => {
    // Aquí deberías hacer la llamada real a tu backend
    // Simulación:
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setCategories(storedCategories);
  };


  return (
    <div>
      <h2>Lista de Categorías</h2>
      <ul>
        {categories.map((cat, index) => (
         
          <li key={index}>{cat}</li>
        ))}
      </ul>
    </div>
  );
};


export default CategoryList;
