import React from 'react';
import './FooterPages.css';

const Terms = () => {
  return (
    <div className="footer-page-container">
      <h1>Términos y Condiciones</h1>
      <div className="footer-page-content">
        <section className="terms-section">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar nuestro sitio web, usted acepta estos términos y condiciones en su totalidad.
            Si no está de acuerdo con estos términos, por favor no utilice nuestro sitio web.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Uso del Sitio</h2>
          <p>
            Nuestro sitio web está destinado a la venta de productos para mascotas. Usted se compromete a:
          </p>
          <ul>
            <li>Proporcionar información precisa y actualizada</li>
            <li>Usar el sitio de manera legal y ética</li>
            <li>No realizar actividades fraudulentas</li>
            <li>Mantener la confidencialidad de su cuenta</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Productos y Precios</h2>
          <p>
            Nos esforzamos por mantener precios precisos y descripciones actualizadas de nuestros productos.
            Sin embargo, pueden ocurrir errores. Nos reservamos el derecho de rechazar o cancelar cualquier
            pedido con información incorrecta.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Envíos y Devoluciones</h2>
          <p>
            Consulte nuestra política de envíos y devoluciones para obtener información detallada sobre
            plazos de entrega, costos de envío y proceso de devolución.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Privacidad</h2>
          <p>
            Su privacidad es importante para nosotros. Consulte nuestra Política de Privacidad para
            entender cómo recopilamos y protegemos su información.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms; 