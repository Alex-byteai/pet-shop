import { Link } from 'react-router-dom';
import './Header.css'; 
import { FaHeart, FaUser, FaSearch } from 'react-icons/fa';
import SearchBar from '../search/SearchBar';
import CategoryMenu from '../categoryMenu/CategoryMenu';
import ProductMenu from '../productMenu/ProductMenu';
import CartIcon from '../CartIcon/CartIcon';

const Header = () => {
  return (
    <header>
      <div className="top-bar">
        <div className="top-bar-left">
          {/* Aqui van los contactos */}
        </div>

        <div className="top-bar-right">
          <span><FaHeart />Deseados</span>
          <span><FaUser />Mi cuenta</span>
          <CartIcon />
        </div>
      </div>

      <div className="main-header">
        <div className="logo">
          <Link to="/">PetShop</Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <CategoryMenu />
          <ProductMenu />
        </nav>

        {/* <div className="search-bar">
          <input type="text" placeholder="Buscar productos..." />
          <button type="submit"><FaSearch  /></button>
        </div> */}

        <div className="search-bar">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
