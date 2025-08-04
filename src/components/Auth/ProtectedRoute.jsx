import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Show loading state while checking authentication
  if (token === undefined) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, redirect to home
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and role is allowed, render children
  return children;
};

export default ProtectedRoute; 