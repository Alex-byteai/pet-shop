import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import HomeSlider from '../../components/homeSlider/HomeSlider';
import CardSlider from '../../components/cardSlider/CardSlider';
import Card from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import { getFeaturedCategories, getTopProducts, getNewProducts } from '../../services/api';
import './HomePage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedFeaturedCategories = await getFeaturedCategories();
        setFeaturedCategories(fetchedFeaturedCategories);
        const fetchedTopProducts = await getTopProducts();
        setTopProducts(fetchedTopProducts);
        const fetchedNewProducts = await getNewProducts();
        setNewProducts(fetchedNewProducts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='home-page'>
      
      <section className='home-slider'>
        <HomeSlider />
      </section>

      {/* categorias Destacadas */}
      <section className='feactured-categories'>
        <h2>Categorias Destacadas</h2>
        <div className="category-grid">
          {featuredCategories.map((cat) => {
            let bgColor = '#fff'; // Default color
            if (cat.id === 56 || cat.id === 59) {
              bgColor = 'rgb(162, 110, 60)';
            } else if (cat.id === 57 || cat.id === 58) {
              bgColor = 'rgb(28, 28, 28)';
            }
            return (
              <div 
                className='category-card'
                key={cat.id} 
                style={{ backgroundColor: bgColor }}
              >
                <div className="category-text">
                  <h2>{cat.name}</h2>
                  <p>{cat.description}</p>
                  <button onClick={() => navigate(`/search?category=${cat.id}`)}>Ver mas</button>
                </div>
                {cat.image && <img src={API_BASE_URL + cat.image} alt={cat.name} />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Productos Mas Vendidos */}
      <section className='top-products'>
          <h2>Lo Mas Vendidos</h2>
          <div className='products-slider'>
            <CardSlider>
              {topProducts.map((product) => (
                <Card
                  key={product.id}
                  {...product}
                />
              ))}
            </CardSlider>
          </div>
      </section>

      {/* Productos Nuevos */}
      <section className='new-products'>
        <h2>Productos Nuevos</h2>
        <div className='products-slider'>
          <CardSlider>
            {newProducts.map((product) => (
              <Card
                key={product.id}
                {...product}
              />
            ))}
          </CardSlider>
        </div>
      </section>

    </div>
  );
};


export default HomePage;