import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexto para el carrito de compras
const CartContext = createContext();

// Proveedor del carrito que envuelve la app
export function CartProvider({ children }) {
  // Estado del carrito, inicializado desde localStorage si existe
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sincroniza el carrito con localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Devuelve la cantidad total de productos en el carrito
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Devuelve el total a pagar
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Agrega un producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { ...product, quantity }];
    });
  };

  // Actualiza la cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Elimina un producto del carrito
  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  // Vacía el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Verifica si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Devuelve la cantidad de un producto específico
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Valor que se provee a los componentes hijos
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity,
  };

  // Proveedor del contexto del carrito
  return (
    <CartContext.Provider value={value}> 
      {/* Provee el contexto del carrito a los hijos */}
      {children} 
    </CartContext.Provider>
  );
}

// Hook personalizado para acceder al carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('error... se presenta fuera de contexto');
  }
  return context;
} 