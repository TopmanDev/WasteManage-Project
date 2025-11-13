import React from 'react';
import { useAuth } from '../context/AuthContext';
import Home from './Home';
import AdminHome from './AdminHome';

/**
 * Smart Home Component
 * Displays different home pages based on user role
 */
const SmartHome = () => {
  const { admin } = useAuth();

  // Show AdminHome for admins, regular Home for everyone else
  return admin ? <AdminHome /> : <Home />;
};

export default SmartHome;
