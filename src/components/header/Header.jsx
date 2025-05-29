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
          {/* Aquí van los contactos */}
        </div>

        <div className="top-bar-right">
          <div className="top-bar-item">
            <FaHeart className='top-bar-icon' />
            <Link to="/deseados" className="top-bar-link">Deseados</Link>
          </div>
          <div className="top-bar-item">
            <FaUser className='top-bar-icon' />
            <Link to="/auth/login" className="top-bar-link">Mi cuenta</Link>
          </div>
          <div className="top-bar-item">
            <CartIcon />
          </div>
        </div>
      </div>

      <div className="main-header">
        <div className="logo">
          <Link to="/" className="logo-link">PetShop</Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <CategoryMenu />
          <ProductMenu />
        </nav>

        <div className="search-bar">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
