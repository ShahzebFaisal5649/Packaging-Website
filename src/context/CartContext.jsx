/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('packagingCart');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('packagingCart', JSON.stringify(items));
  };

  const addToCart = (product) => {
    const existingIndex = cartItems.findIndex(item => item.id === product.id && JSON.stringify(item.configuration) === JSON.stringify(product.configuration));
    
    if (existingIndex > -1) {
      const newItems = [...cartItems];
      newItems[existingIndex].quantity += (product.quantity || 1);
      saveCart(newItems);
    } else {
      saveCart([...cartItems, { ...product, quantity: product.quantity || 1 }]);
    }
  };

  const removeFromCart = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    saveCart(newItems);
  };

  const updateQuantity = (index, qty) => {
    if (qty <= 0) return removeFromCart(index);
    const newItems = [...cartItems];
    newItems[index].quantity = qty;
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open ?? !isDrawerOpen);
  };

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal,
      isDrawerOpen,
      toggleDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
};
