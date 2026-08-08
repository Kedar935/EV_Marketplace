import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import ExploreVehicles from './pages/ExploreVehicles';
import VehicleDetails from './pages/VehicleDetails';
import Comparison from './pages/Comparison';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';
import EVCalculators from './pages/EVCalculators';
import AIRecommendations from './pages/AIRecommendations';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorAddVehicle from './pages/vendor/VendorAddVehicle';
import VendorVehicles from './pages/vendor/VendorVehicles';
import VendorOrders from './pages/vendor/VendorOrders';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div className="flex flex-col min-h-screen font-sans selection:bg-teal-500 selection:text-white">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/vehicles" element={<ExploreVehicles />} />
                      <Route path="/vehicles/:id" element={<VehicleDetails />} />
                      <Route path="/compare" element={<Comparison />} />
                      <Route path="/tools" element={<EVCalculators />} />
                      <Route path="/recommendations" element={<AIRecommendations />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Customer Protected Routes */}
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <Wishlist />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <UserOrders />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders/:id/track"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <OrderTracking />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}>
                            <UserProfile />
                          </ProtectedRoute>
                        }
                      />

                      {/* Vendor Routes */}
                      <Route
                        path="/vendor/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                            <VendorDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/vendor/add-vehicle"
                        element={
                          <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                            <VendorAddVehicle />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/vendor/vehicles"
                        element={
                          <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                            <VendorVehicles />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/vendor/orders"
                        element={
                          <ProtectedRoute allowedRoles={['VENDOR', 'ADMIN']}>
                            <VendorOrders />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin Routes */}
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/approvals"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminApprovals />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminUsers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/vendors"
                        element={
                          <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminVendors />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
