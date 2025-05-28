import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderComplete.css';

const OrderComplete = () => {
  const navigate = useNavigate();
  const orderId = localStorage.getItem('lastOrderId') || Date.now().toString();

  return (
    <div className="order-complete-container">
      <div className="order-complete-content">
        <div className="success-icon">✓</div>
        <h1>¡Gracias por tu compra!</h1>
        <p className="order-number">Número de orden: #{orderId}</p>
        
        <div className="order-details">
          <h2>Detalles del pedido</h2>
          <div className="order-summary">
            <div className="summary-section">
              <h3>Información importante</h3>
              <p>Te enviaremos un correo electrónico con los detalles de tu pedido y la información de seguimiento.</p>
            </div>
            
            <div className="summary-section">
              <h3>Próximos pasos</h3>
              <ul>
                <li>Recibirás un correo de confirmación</li>
                <li>Te mantendremos informado sobre el estado de tu envío</li>
                <li>La entrega se realizará según el método seleccionado</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="next">
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continuar comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete; 