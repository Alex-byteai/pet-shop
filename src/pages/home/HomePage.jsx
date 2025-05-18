// import { Link } from 'react-router-dom';
import HomeSlider from '../../components/homeSlider/HomeSlider';
import { featuredCategories } from '../../data/feacturedCategories';
import { topProducts } from '../../data/topProducts';

const HomePage = () => {
  return (
    <div className='home-page'>
      <HomeSlider />

      {/* categorias Destacadas */}
      <section className='feactured-categories'>
        <h2>Categorias Destacadas</h2>
        <div className='categories-grid'>
          {featuredCategories.map((category) => (
            <div key={category.id} className='category-card'>
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
              <button className='btn'>Ver Productos</button>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Mas Vendidos */}
      <section className='top-products'>
          <h2>Lo Mas Vendidos</h2>
          <div className='products-grid'>
            {topProducts.map((product) => (
              <div key={product.id} className='product-card'>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span>${product.price}</span>
                <button className='btn'>Agregar al Carrito</button>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
};


export default HomePage;