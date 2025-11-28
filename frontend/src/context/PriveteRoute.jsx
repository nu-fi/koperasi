import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Check your path

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  // If the AuthContext is still loading, show nothing (or a spinner)
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If logged in, show the page
  return <Outlet />;
};

export default PrivateRoute;