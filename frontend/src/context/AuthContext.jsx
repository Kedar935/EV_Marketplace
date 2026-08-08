import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ev_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await API.get('/auth/me');
      setUser(res.data.user);
      setVendor(res.data.vendor);
    } catch (error) {
      console.error('Auth verification failed:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('ev_token', authToken);
    setToken(authToken);
    setUser(userData);
    return res;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('ev_token', authToken);
    setToken(authToken);
    setUser(userData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('ev_token');
    setToken(null);
    setUser(null);
    setVendor(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        token,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'CUSTOMER',
        isVendor: user?.role === 'VENDOR',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
