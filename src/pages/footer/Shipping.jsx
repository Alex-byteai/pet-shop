import React from 'react';
import './FooterPages.css';

const Shipping = () => {
  return (
    <div className="footer-page-container">
      <h1>Información de Envíos</h1>
      <div className="footer-page-content">
        <section className="shipping-section">
          <h2>Métodos de Envío</h2>
          <div className="shipping-options">
            <div className="shipping-option">
              <h3>Envío Estándar</h3>
              <p>2-3 días hábiles</p>
              <p>$500</p>
              <ul>
                <li>Seguimiento del pedido</li>
                <li>Entrega a domicilio</li>
              </ul>
            </div>

            <div className="shipping-option">
              <h3>Envío Express</h3>
              <p>24 horas</p>
              <p>$900</p>
              <ul>
                <li>Seguimiento en tiempo real</li>
                <li>Entrega garantizada</li>
                <li>Prioridad en el despacho</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="shipping-section">
          <h2>Zonas de Cobertura</h2>
          <p>
            Realizamos envíos a todo el país. Los tiempos de entrega pueden variar según la ubicación:
          </p>
          <ul>
            <li>Áreas Metropolitanas: 1-2 días hábiles</li>
            <li>Capitales de Provincia: 2-3 días hábiles</li>
            <li>Interior del País: 3-5 días hábiles</li>
          </ul>
        </section>

        <section className="shipping-section">
          <h2>Seguimiento de Pedidos</h2>
          <p>
            Una vez que su pedido sea despachado, recibirá un correo electrónico con:
          </p>
          <ul>
            <li>Número de seguimiento</li>
            <li>Enlace para rastreo en tiempo real</li>
            <li>Información del courier</li>
            <li>Tiempo estimado de entrega</li>
          </ul>
        </section>

        <section className="shipping-section">
          <h2>Políticas de Envío</h2>
          <ul>
            <li>Envío gratis en compras superiores a $10,000</li>
            <li>Los pedidos se procesan en menos de 24 horas</li>
            <li>Embalaje seguro para proteger sus productos</li>
            <li>Seguro de envío incluido en todos los pedidos</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Shipping; 