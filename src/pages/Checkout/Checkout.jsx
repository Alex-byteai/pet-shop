import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import qrImage from '../../assets/images/qr/qr_code.jpg';
import './Checkout.css';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Envío Estándar', price: 5.99, time: '5-7 días hábiles' },
  { id: 'express', name: 'Envío Express', price: 14.99, time: '2-3 días hábiles' },
  { id: 'overnight', name: 'Envío al día siguiente', price: 29.99, time: '1 día hábil' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Solo permitir números y limitar a 16 dígitos
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
      // Validar longitud
      if (numericValue.length > 0 && numericValue.length < 16) {
        setFormErrors(prev => ({ 
          ...prev, 
          cardNumber: 'El número de tarjeta debe tener 16 dígitos' 
        }));
      } else {
        setFormErrors(prev => ({ ...prev, cardNumber: '' }));
      }
    } else if (name === 'cardExpiry') {
      // Solo permitir números y limitar a 4 dígitos
      const numericValue = value.replace(/\D/g, '').slice(0, 4);
      
      // Formatear automáticamente con /
      if (numericValue.length >= 2) {
        const month = numericValue.slice(0, 2);
        const year = numericValue.slice(2);
        setFormData(prev => ({ 
          ...prev, 
          [name]: `${month}/${year}`
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      
      // Validar longitud
      if (numericValue.length > 0 && numericValue.length < 4) {
        setFormErrors(prev => ({ 
          ...prev, 
          cardExpiry: 'La fecha debe tener 4 dígitos (MM/YY)' 
        }));
      } else {
        setFormErrors(prev => ({ ...prev, cardExpiry: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'credit') {
      // Validar número de tarjeta
      if (formData.cardNumber.length !== 16) {
        alert('El número de tarjeta debe tener 16 dígitos');
        return;
      }

      // Validar fecha de vencimiento
      if (!formData.cardExpiry.includes('/') || formData.cardExpiry.length !== 5) {
        alert('La fecha de vencimiento debe estar en formato MM/YY');
        return;
      }

      // Validar CVC
      if (formData.cardCVC.length !== 3) {
        alert('El CVC debe tener 3 dígitos');
        return;
      }
    }

    // Generar número de orden
    const orderId = Date.now();
    localStorage.setItem('lastOrderId', orderId.toString());

    // Limpiar el carrito
    clearCart();

    // Redirigir a la página de orden completada
    navigate('/order-complete');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-grid">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            {/* Información de Envío */}
            <div className="form-section">
              <h2 className="section-title">Información de Envío</h2>
              <div className="form-grid">
                <div className="form-group form-full-width">
                  <label className="form-label" htmlFor="address">Dirección</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="state">Estado/Provincia</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-input"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="zipCode">Código Postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="form-input"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Método de Envío */}
            <div className="form-section">
              <h2 className="section-title">Método de Envío</h2>
              <div className="shipping-methods">
                {SHIPPING_METHODS.map((method) => (
                  <div key={method.id} className="shipping-method">
                    <input
                      type="radio"
                      id={method.id}
                      name="shippingMethod"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    />
                    <label htmlFor={method.id}>
                      <span className="method-name">{method.name}</span>
                      <span className="method-price">${method.price.toFixed(2)}</span>
                      <span className="method-time">{method.time}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="form-section">
              <h2 className="section-title">Método de Pago</h2>
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="credit"
                    name="paymentMethod"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="credit">Tarjeta de Crédito</label>
                </div>
                <div className="payment-method">
                  <input
                    type="radio"
                    id="qr"
                    name="paymentMethod"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="qr">Código QR</label>
                </div>
              </div>

              {paymentMethod === 'credit' && (
                <div className="credit-card-fields">
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardNumber">Número de Tarjeta *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className={`form-input ${formErrors.cardNumber ? 'input-error' : ''}`}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234567890123456"
                      required
                    />
                    {formErrors.cardNumber && (
                      <span className="error-message">{formErrors.cardNumber}</span>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardExpiry">Fecha de Vencimiento *</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        className={`form-input ${formErrors.cardExpiry ? 'input-error' : ''}`}
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.cardExpiry && (
                        <span className="error-message">{formErrors.cardExpiry}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardCVC">CVC *</label>
                      <input
                        type="text"
                        id="cardCVC"
                        name="cardCVC"
                        className="form-input"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="qr-payment-info">
                  <p>Escanea el siguiente código QR para realizar el pago:</p>
                  <div className="qr-image-container">
                    <img src={qrImage} alt="Código QR para pago" className="qr-code-image" />
                  </div>
                  <p className="qr-instructions">Una vez realizado el pago, haz clic en "Completar orden"</p>
                </div>
              )}
            </div>

            {/* Resumen del Pedido */}
            <div className="order-summary">
              <h2 className="section-title">Resumen del Pedido</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>$99.99</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>${SHIPPING_METHODS.find(m => m.id === shippingMethod)?.price.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>$105.98</span>
              </div>
              <button type="submit" className="submit-button">
                Completar orden
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 