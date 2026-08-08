import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/wishlist');
      setWishlist(res.data.wishlist || []);
    } catch (error) {
      console.error('Fetch wishlist error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (vehicleId) => {
    if (!isAuthenticated) {
      showError('Please login to save vehicles to your wishlist.');
      return false;
    }

    const isInWishlist = wishlist.some((item) => (item._id || item) === vehicleId);

    try {
      if (isInWishlist) {
        const res = await API.delete(`/wishlist/${vehicleId}`);
        setWishlist(res.data.wishlist || []);
        showSuccess('Removed from Wishlist');
      } else {
        const res = await API.post('/wishlist', { vehicleId });
        setWishlist(res.data.wishlist || []);
        showSuccess('Saved to Wishlist!');
      }
      return true;
    } catch (error) {
      showError(error.message || 'Wishlist operation failed');
      return false;
    }
  };

  const isInWishlist = (vehicleId) => {
    return wishlist.some((item) => (item._id || item) === vehicleId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
