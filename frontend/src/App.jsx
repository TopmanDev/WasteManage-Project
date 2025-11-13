// Import React and routing
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layout component
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Import Route Protection
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Import Auth Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Import Main Pages
import SmartHome from './pages/SmartHome.jsx';
import PickupRequests from './pages/PickupRequests.jsx';
import NewRequest from './pages/NewRequest.jsx';
import MyRequests from './pages/MyRequests.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Routing from './pages/Routing.jsx';
import AboutUs from './pages/AboutUs.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import ContactUs from './pages/ContactUs.jsx';

/**
 * Main App Component
 * Defines application routes and wraps pages with Layout
 */
function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SmartHome />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicOnlyRoute>
              <AdminLogin />
            </PublicOnlyRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Protected User Routes */}
        <Route
          path="/new-request"
          element={
            <ProtectedRoute userOnly={true}>
              <NewRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute userOnly={true}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute userOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute adminOnly={true}>
              <PickupRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routing"
          element={
            <ProtectedRoute adminOnly={true}>
              <Routing />
            </ProtectedRoute>
          }
        />
        
        {/* 404 Not Found page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
