import { Link } from 'react-router-dom';
import './Header.css'; 
import { FaHeart, FaUser, FaShoppingBag, FaSearch  } from 'react-icons/fa';

const Header = () => {
  return (
    <header>
      {/* Barra superior */}

      <div className="top-bar">

        <div className="top-bar-left">
          {/* Aqui van los contactos */}
        </div>

        <div className="top-bar-right">
          <span><FaHeart />Deseados</span>
          <span><FaUser />Mi cuenta</span>
          <span><FaShoppingBag />Mi carrito</span>
        </div>

      </div>
      {/* Barra principal */}
      <div className="main-header">
        <div className="logo">
          <Link to="/">PetShop</Link>
        </div>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/categorias">Categorias</Link>
        </nav>

        <div className="search-bar">
          <input type="text" placeholder="Buscar productos..." />
          <button type="submit"><FaSearch  /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
