import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Admin-only routes
  if (adminOnly && !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User-only routes (admins cannot access)
  if (userOnly && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If userOnly and admin tries to access, redirect to admin dashboard
  if (userOnly && admin) {
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  }

  // If adminOnly and user tries to access, redirect to user dashboard
  if (adminOnly && user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { user, admin } = useAuth();
  const location = useLocation();

  // If authenticated, redirect to home page
  if (admin || user) {
    return <Navigate to="/" replace />;
  }

  return children;
};