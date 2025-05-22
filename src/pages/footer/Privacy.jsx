import React from 'react';
import './FooterPages.css';

const Privacy = () => {
  return (
    <div className="footer-page-container">
      <h1>Política de Privacidad</h1>
      <div className="footer-page-content">
        <section className="privacy-section">
          <h2>Recopilación de Información</h2>
          <p>
            Recopilamos información cuando usted:
          </p>
          <ul>
            <li>Crea una cuenta en nuestra plataforma</li>
            <li>Realiza una compra</li>
            <li>Se suscribe a nuestro boletín</li>
            <li>Contacta con nuestro servicio al cliente</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Uso de la Información</h2>
          <p>
            Utilizamos su información para:
          </p>
          <ul>
            <li>Procesar sus pedidos y envíos</li>
            <li>Mejorar nuestro servicio al cliente</li>
            <li>Enviar correos electrónicos promocionales (con su consentimiento)</li>
            <li>Personalizar su experiencia de compra</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>Protección de Datos</h2>
          <p>
            Implementamos diversas medidas de seguridad para mantener la seguridad de su información personal.
            Utilizamos encriptación avanzada para proteger información sensible transmitida en línea.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Cookies</h2>
          <p>
            Utilizamos cookies para mejorar su experiencia de navegación. Puede configurar su navegador
            para rechazar cookies, aunque esto podría limitar algunas funcionalidades de nuestro sitio.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Sus Derechos</h2>
          <p>
            Usted tiene derecho a:
          </p>
          <ul>
            <li>Acceder a sus datos personales</li>
            <li>Rectificar información incorrecta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Privacy; 