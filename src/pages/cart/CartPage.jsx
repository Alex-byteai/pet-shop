import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega algunos productos a tu carrito para verlos aquí!</p>
        <Link to="/" className="cart-page-continue-shopping">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h2>Carrito de Compras</h2>
      </div>

      <div className="cart-page-items-container">
        {cart.map(item => (
          <div key={item.id} className="cart-page-item">
            <img 
              src={item.images[0]} 
              alt={item.name} 
              className="cart-page-item-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="cart-page-item-details">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-page-item-actions">
              <div className="cart-page-quantity-controls">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)} 
                className="cart-page-remove-button"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-page-summary">
        <div className="cart-page-summary-row">
          <span>Subtotal:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        <div className="cart-page-summary-row">
          <span>Envío:</span>
          <span>Gratis</span>
        </div>
        <div className="cart-page-summary-row cart-page-total">
          <span>Total:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="cart-page-checkout-button">
          Proceder al pago
        </Link>
      </div>
    </div>
  );
} 