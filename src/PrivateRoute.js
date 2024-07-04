import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx'; // Adjust this import path as needed

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a more sophisticated loading component
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    // The 'state' prop allows us to send the attempted URL to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the child components
  return children;
};

export default PrivateRoute;