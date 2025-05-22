import React from 'react';
import { Link } from 'react-router-dom';
import './FooterPages.css';

const Support = () => {
  return (
    <div className="footer-page-container">
      <h1>Centro de Soporte</h1>
      <div className="footer-page-content">
        <section className="support-section">
          <h2>¿Cómo Podemos Ayudarte?</h2>
          <div className="support-grid">
            <div className="support-card">
              <i className="fas fa-shopping-cart"></i>
              <h3>Pedidos</h3>
              <ul>
                <li><Link to="/faq">Estado de mi pedido</Link></li>
                <li><Link to="/shipping">Información de envío</Link></li>
                <li><Link to="/returns">Devoluciones</Link></li>
              </ul>
            </div>

            <div className="support-card">
              <i className="fas fa-user"></i>
              <h3>Mi Cuenta</h3>
              <ul>
                <li>Gestionar mi cuenta</li>
                <li>Cambiar contraseña</li>
                <li>Historial de pedidos</li>
              </ul>
            </div>

            <div className="support-card">
              <i className="fas fa-credit-card"></i>
              <h3>Pagos</h3>
              <ul>
                <li>Métodos de pago</li>
                <li>Problemas con el pago</li>
                <li>Facturación</li>
              </ul>
            </div>

            <div className="support-card">
              <i className="fas fa-gift"></i>
              <h3>Productos</h3>
              <ul>
                <li>Información de productos</li>
                <li>Disponibilidad</li>
                <li>Garantías</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="support-section">
          <h2>Canales de Atención</h2>
          <div className="support-channels">
            <div className="channel-card">
              <i className="fas fa-phone-alt"></i>
              <h3>Teléfono</h3>
              <p>0800-123-4567</p>
              <p>Lunes a Viernes</p>
              <p>9:00 - 18:00</p>
            </div>

            <div className="channel-card">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <p>soporte@petshop.com</p>
              <p>Respuesta en 24-48hs</p>
            </div>
          </div>
        </section>

        <section className="support-section">
          <h2>Preguntas Frecuentes</h2>
          <div className="quick-links">
            <Link to="/faq" className="quick-link">
              Ver todas las preguntas frecuentes
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support; 