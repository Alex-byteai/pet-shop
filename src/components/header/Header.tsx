// import { Link } from 'react-router-dom';

// import './Header.css'; 

// const Header = () => {
//   return (
//     <header className="header">
//       <div className="header-container">
        
//         <div className="logo-container">
//           <Link to="/" className="logo">
//             PetShop
//           </Link>
//         </div>
        
//         <div className="search-container">
//           <input 
//             type="text" 
//             placeholder="Buscar productos, marcas y más..."
//             className="search-input"
//           />
//           <button className="search-button">
//             Buscar
//           </button>
//         </div>

//         <nav className="nav-menu">
//           <ul className='main-menu'>
//             <Link to="/cart" className="nav-link">Carrito</Link>
//             <Link to="/login" className="nav-link">Mi cuenta</Link>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Link } from 'react-router-dom';
import './Header.css'; // Asegúrate de importar los estilos

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-wrapper">
        <div className="main-logo">
          <Link to="/">PetShop</Link>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar productos, marcas y más..."
            className="search-input"
          />
          <button className="search-button">Buscar</button>
        </div>

        <nav>
          <ul className="main-menu">
            <li><Link to="/cart">Carrito</Link></li>
            <li><Link to="/login">Mi Cuenta</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
