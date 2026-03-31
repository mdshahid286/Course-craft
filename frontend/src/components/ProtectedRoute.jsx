import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute Debug - currentUser:', currentUser);
  console.log('ProtectedRoute Debug - location:', location.pathname);

  if (!currentUser) {
    console.log('ProtectedRoute Debug - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute Debug - User authenticated, rendering children');
  return children;
}
