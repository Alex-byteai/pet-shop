import React from 'react';
import './FooterPages.css';

const Returns = () => {
  return (
    <div className="footer-page-container">
      <h1>Política de Devoluciones</h1>
      <div className="footer-page-content">
        <section className="returns-section">
          <h2>Plazo de Devolución</h2>
          <p>
            Aceptamos devoluciones dentro de los 30 días posteriores a la fecha de compra.
            El producto debe estar:
          </p>
          <ul>
            <li>Sin usar</li>
            <li>En su empaque original</li>
            <li>Con todas las etiquetas intactas</li>
            <li>Acompañado del comprobante de compra</li>
          </ul>
        </section>

        <section className="returns-section">
          <h2>Proceso de Devolución</h2>
          <ol>
            <li>Inicie sesión en su cuenta</li>
            <li>Seleccione el pedido que desea devolver</li>
            <li>Complete el formulario de devolución</li>
            <li>Imprima la etiqueta de devolución</li>
            <li>Empaque el producto de forma segura</li>
            <li>Envíe el paquete a través de nuestro courier asociado</li>
          </ol>
        </section>

        <section className="returns-section">
          <h2>Reembolsos</h2>
          <p>
            Una vez recibido y verificado el producto devuelto, procesaremos su reembolso:
          </p>
          <ul>
            <li>Tarjeta de crédito: 3-5 días hábiles</li>
            <li>Transferencia bancaria: 2-3 días hábiles</li>
            <li>Crédito en la tienda: inmediato</li>
          </ul>
        </section>

        <section className="returns-section">
          <h2>Excepciones</h2>
          <p>
            Los siguientes productos no son elegibles para devolución:
          </p>
          <ul>
            <li>Alimentos abiertos o usados</li>
            <li>Productos de higiene personal usados</li>
            <li>Medicamentos y suplementos abiertos</li>
            <li>Artículos personalizados</li>
          </ul>
        </section>

        <section className="returns-section">
          <h2>Productos Dañados o Incorrectos</h2>
          <p>
            Si recibe un producto dañado o incorrecto:
          </p>
          <ul>
            <li>Contáctenos dentro de las 48 horas de recibido</li>
            <li>Envíe fotos del producto y el empaque</li>
            <li>Cubriremos los gastos de envío de la devolución</li>
            <li>Recibirá un reembolso completo o un reemplazo</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Returns; 