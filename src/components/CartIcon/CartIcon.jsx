import React from 'react';
import { Link } from 'react-router-dom';
import { BsCart3 } from 'react-icons/bs';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

export default function CartIcon() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <Link to="/cart" className="cart-icon">
      <BsCart3 className="cart-icon-svg" />
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
    </Link>
  );
} 