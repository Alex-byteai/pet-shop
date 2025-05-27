import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

export default function ShoppingCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega algunos productos a tu carrito para verlos aquí!</p>
        <Link to="/" className="continue-shopping">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="shopping-cart-container">
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
      </div>

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <img
            src={item.images[0]}
            alt={item.name}
            className="cart-item-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="cart-item-details">
            <h3>{item.name}</h3>
            <p>${item.price.toFixed(2)}</p>
          </div>
          <div className="cart-item-actions">
            <div className="quantity-controls">
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
              className="remove-button"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Envío:</span>
          <span>Gratis</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${getTotal().toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="checkout-button">
          Proceder al pago
        </Link>
      </div>
    </div>
  );
} 