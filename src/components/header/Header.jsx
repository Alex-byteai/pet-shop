import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHeart, FaUser, FaShoppingBag, FaSearch } from 'react-icons/fa';
import SearchBar from '../search/SearchBar';
import CategoryMenu from '../categoryMenu/CategoryMenu';
import ProductMenu from '../productMenu/ProductMenu';
import CartIcon from '../CartIcon/CartIcon';


const Header = () => {
  const navigate = useNavigate();


  return (
    <header>
      {/* Barra superior */}
      <div className="top-bar">
        <div className="top-bar-left">
          {/* Aqui van los contactos */}
        </div>


        <div className="top-bar-right">
          <span className="custom-link" onClick={() => navigate('/deseados')}>
            <FaHeart /> Deseados
          </span>
          <span className="custom-link" onClick={() => navigate('/login/LoginPage')}>
            <FaUser /> Mi cuenta
          </span>
          <CartIcon />
         
        </div>
      </div>


      {/* Barra principal */}
        <div className="main-header">
        <div className="logo">
          PetShop
        </div>


        <nav className="nav-links">
          <span className='a' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Inicio</span>
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