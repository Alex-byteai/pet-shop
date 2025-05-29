import { Link } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import "./Footer.css"; 

const Footer = () => {
  return (
    <div className="contenedor">
      <main className="relleno">
        <Outlet />
      </main>
    <footer className="footer">
      <div className="footer-container">
        <div className="row">
          <div className="footer-section">
            <h3>Sobre Nosotros</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">Nuestra Historia</Link>
              </li>
              <li>
                <Link to="/terms">Terminos y condiciones</Link>
              </li>
              <li>
                <Link to="/privacy">Politica de privacidad</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Ayuda</h3>
            <ul>
              <li>
                <Link to="/faq">Preguntas Frecuentes</Link>
              </li>
              <li>
                <Link to="/shipping">Envios</Link>
              </li>
              <li>
                <Link to="/returns">Devoluciones</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li>
                <Link to="/contact">Contáctanos</Link>
              </li>
              <li>
                <Link to="/support">Soporte</Link>
              </li>
              <li>
                <Link to="/feedback">Comentarios</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <hr />
      <div className="footer-container">
        <div className="row-footer">
          <div className="footer-section">
            <p>&copy; 2025 PetShop. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;


