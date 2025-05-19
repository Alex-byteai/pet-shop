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
      
      <section className='home-slider'>
        <HomeSlider />
      </section>

      {/* categorias Destacadas */}
      <section className='feactured-categories'>
        <div className="category-grid">
          {featuredCategories.map((cat, i) => (
            <div 
              className='category-card'
              key={i} 
              style={{ backgroundColor: cat.bgColor }}
            >
              <div className="category-text">
                <h2>{cat.title}</h2>
                <button>{cat.button}</button>
              </div>
              <img src={cat.img} alt={cat.title} />
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