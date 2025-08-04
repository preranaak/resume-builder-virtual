import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
// ... existing imports ...

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log('Checking authentication:', token ? 'Token exists' : 'No token');
    return token !== null;
  };

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found for admin check');
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      const isAdminUser = payload.role === 'admin';
      console.log('Is admin:', isAdminUser);
      return isAdminUser;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            isAuthenticated() && isAdmin() ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* ... other routes ... */}
      </Routes>
    </Router>
  );
};

export default App; 