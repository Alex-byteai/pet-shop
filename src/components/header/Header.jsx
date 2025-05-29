import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 
import { FaHeart, FaUser, FaSearch, FaCaretDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../search/SearchBar';
import CategoryMenu from '../categoryMenu/CategoryMenu';
import ProductMenu from '../productMenu/ProductMenu';
import CartIcon from '../CartIcon/CartIcon';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

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
          <div className="top-bar-item user-menu-container">
            <div 
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser className='top-bar-icon' />
              <span className="top-bar-link">
                {user ? `${user.firstName}` : 'Mi cuenta'}
              </span>
              <FaCaretDown className='top-bar-icon' />
            </div>

            {showUserMenu && (
              <div className="user-menu">
                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <Link 
                        to="/admin" 
                        className="user-menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Panel Admin
                      </Link>
                    ) : (
                      <Link 
                        to="/user/dashboard" 
                        className="user-menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mi Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/user/profile" 
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/user/orders" 
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="user-menu-item logout-button"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth/login" 
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/auth/register" 
                      className="user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
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
