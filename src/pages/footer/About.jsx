import React from 'react';
import './FooterPages.css';

const About = () => {
  return (
    <div className="footer-page-container">
      <h1>Nuestra Historia</h1>
      <div className="footer-page-content">
        <section className="about-section">
          <h2>¿Quiénes Somos?</h2>
          <p>
            Fundada en 2025, PetShop nació de la pasión por el bienestar animal y el deseo de proporcionar
            productos de alta calidad para mascotas. Comenzamos como una pequeña tienda local y hemos crecido
            hasta convertirnos en uno de los destinos preferidos para dueños de mascotas.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Nos dedicamos a mejorar la vida de las mascotas y sus dueños, ofreciendo productos premium,
            asesoramiento experto y un servicio excepcional. Creemos que cada mascota merece lo mejor,
            y trabajamos incansablemente para hacer que eso sea posible.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestros Valores</h2>
          <ul>
            <li>Calidad garantizada en todos nuestros productos</li>
            <li>Compromiso con el bienestar animal</li>
            <li>Atención personalizada a cada cliente</li>
            <li>Sostenibilidad y responsabilidad ambiental</li>
            <li>Innovación continua en productos y servicios</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About; 