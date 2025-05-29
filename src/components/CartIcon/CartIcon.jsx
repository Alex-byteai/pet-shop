import React from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

export default function CartIcon() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <Link to="/cart" className="cart-icon">
      <FaCartShopping className="cart-icon-svg" />
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
    </Link>
  );
} 