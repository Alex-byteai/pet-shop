// import { Link } from 'react-router-dom';
import HomeSlider from '../../components/homeSlider/HomeSlider';
import { featuredCategories } from '../../data/feacturedCategories';
import { topProducts } from '../../data/topProducts';
import CardSlider from '../../components/cardSlider/CardSlider';
import Card from '../../components/card/Card';

import './HomePage.css';

const HomePage = () => {
  return (
    <div className='home-page'>
      <HomeSlider />

      {/* categorias Destacadas */}
      <section className='feactured-categories'>
        <h2>Categorias Destacadas</h2>
        <div className='categories-grid'>
          {featuredCategories.map((category) => (
            <div key={category.id}>
              <div className='category-card'>
                <img src={category.image} alt={category.name} />
                <button className='btn'>Ver Productos</button>
              </div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Mas Vendidos */}
      <section className='top-products'>
          <h2>Lo Mas Vendidos</h2>
          <div className='products-grid'>
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

    </div>
  );
};


export default HomePage;