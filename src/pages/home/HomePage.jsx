// import { Link } from 'react-router-dom';
import HomeSlider from '../../components/homeSlider/HomeSlider';
import { featuredCategories } from '../../data/feacturedCategories';
import { topProducts } from '../../data/topProducts';
import { newProducts } from '../../data/newProducts';
import CardSlider from '../../components/cardSlider/CardSlider';
import Card from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className='home-page'>
      
      <section className='home-slider'>
        <HomeSlider />
      </section>

      {/* categorias Destacadas */}
      <section className='feactured-categories'>
        <h2>Categorias Destacadas</h2>
        <div className="category-grid">
          {featuredCategories.map((cat) => (
            <div 
              className='category-card'
              key={cat.id} 
              style={{ backgroundColor: cat.bgColor }}
            >
              <div className="category-text">
                <h2>{cat.name}</h2>
                <button onClick={() => navigate(`/search?category=${cat.id}`)}>Ver mas</button>
              </div>
              <img src={cat.image} alt={cat.name} />
            </div>
          ))}
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