/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItemIndices, setSelectedItemIndices] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('packagingCart');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('packagingCart', JSON.stringify(items));
    // Remove selected indices that are no longer valid
    setSelectedItemIndices(prev => prev.filter(idx => idx < items.length));
  };

  const addToCart = (product, select = false) => {
    const existingIndex = cartItems.findIndex(item => 
      item.id === product.id && 
      JSON.stringify(item.configuration) === JSON.stringify(product.configuration)
    );
    
    let newItems = [...cartItems];
    let targetIndex = existingIndex;

    if (existingIndex > -1) {
      newItems[existingIndex].quantity += (product.quantity || 1);
    } else {
      newItems.push({ ...product, quantity: product.quantity || 1 });
      targetIndex = newItems.length - 1;
    }

    saveCart(newItems);
    
    if (select && targetIndex > -1) {
      setSelectedItemIndices(prev => 
        prev.includes(targetIndex) ? prev : [...prev, targetIndex]
      );
    }
  };

  const removeFromCart = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    saveCart(newItems);
  };

  const removeMultipleFromCart = (indices) => {
    const newItems = cartItems.filter((_, idx) => !indices.includes(idx));
    setSelectedItemIndices([]); // Clear selections after remove
    saveCart(newItems);
  };

  const toggleSelectedItem = (index) => {
    setSelectedItemIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const selectAllItems = (select) => {
    if (select) {
      setSelectedItemIndices(cartItems.map((_, i) => i));
    } else {
      setSelectedItemIndices([]);
    }
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
  // cartTotal now reflects all items in cart. Checkout page will calculate based on selectedItemIndices.
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const selectedCartTotal = cartItems.reduce((acc, item, idx) => selectedItemIndices.includes(idx) ? acc + (item.price * item.quantity) : acc, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      removeMultipleFromCart,
      updateQuantity, 
      clearCart, 
      cartCount, 
      cartTotal,
      selectedCartTotal,
      selectedItemIndices,
      toggleSelectedItem,
      selectAllItems,
      isDrawerOpen,
      toggleDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
};
