import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [pricing, setPricing] = useState({ subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setPricing({ subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/cart');
      setCartItems(res.data.items || []);
      setPricing(res.data.pricing || { subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
    } catch (error) {
      console.error('Fetch cart error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (vehicleId, quantity = 1) => {
    if (!isAuthenticated) {
      showError('Please login to add vehicles to your cart.');
      return false;
    }

    try {
      const res = await API.post('/cart', { vehicleId, quantity });
      setCartItems(res.data.items || []);
      setPricing(res.data.pricing || { subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
      showSuccess('Vehicle added to shopping cart!');
      return true;
    } catch (error) {
      showError(error.message || 'Failed to add vehicle to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await API.put(`/cart/${itemId}`, { quantity });
      setCartItems(res.data.items || []);
      setPricing(res.data.pricing || { subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
    } catch (error) {
      showError(error.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await API.delete(`/cart/${itemId}`);
      setCartItems(res.data.items || []);
      setPricing(res.data.pricing || { subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
      showSuccess('Item removed from cart');
    } catch (error) {
      showError(error.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCartItems([]);
      setPricing({ subtotal: 0, tax: 0, deliveryFee: 0, totalPrice: 0 });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        pricing,
        loading,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
