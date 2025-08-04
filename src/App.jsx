import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import theme from './theme';
import Navbar from './components/Navbar';
import { useForm } from './hooks/useForm';
const API_URL = 'http://localhost:5000/api';
function App() {
  const [resumeData, setResumeData] = useForm();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchSavedResume = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping resume fetch');
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await fetch(`${API_URL}/resumes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          throw new Error('Your session has expired. Please log in again.');
        } else {
          throw new Error(errorData.message || `Failed to fetch saved resume: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Fetched resume data:', data);
      
      if (data && data.length > 0) {
        // Ensure skills object exists with default values
        const resumeData = {
          ...data[0],
          skills: {
            technical: data[0].skills?.technical || '',
            soft: data[0].skills?.soft || ''
          }
        };
        
        setResumeData(resumeData);
        setSnackbar({
          open: true,
          message: 'Resume data loaded successfully',
          severity: 'success'
        });
      } else {
        console.log('No saved resume found');
        setSnackbar({
          open: true,
          message: 'No saved resume found. Start creating your resume!',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching saved resume:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setSnackbar({
          open: true,
          message: 'Network error. Please check your connection and make sure the server is running.',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to load saved resume. Please make sure the server is running.',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch resume data when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchSavedResume();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array since we only want to fetch on mount

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to save your resume');
      }

      setLoading(true);

      // Ensure skills object exists with current values
      const dataToSave = {
        ...resumeData,
        skills: {
          technical: resumeData.skills?.technical || '',
          soft: resumeData.skills?.soft || ''
        }
      };

      const response = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave),
        credentials: 'include'
      });

      console.log('Save response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          throw new Error('Your session has expired. Please log in again.');
        } else {
          throw new Error(errorData.message || 'Failed to save resume');
        }
      }

      const savedData = await response.json();
      // Ensure skills are preserved in the saved data
      const updatedData = {
        ...savedData,
        skills: {
          technical: savedData.skills?.technical || resumeData.skills?.technical || '',
          soft: savedData.skills?.soft || resumeData.skills?.soft || ''
        }
      };
      
      setResumeData(updatedData);
      setSnackbar({
        open: true,
        message: 'Resume saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Save error:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setSnackbar({
          open: true,
          message: 'Network error. Please check your connection and make sure the server is running.',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to save resume',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (newData) => {
 
    setResumeData(newData);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ResumeBuilder = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

  
  return (
    <>
        <Navbar />
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mt: 4 }}>
            <Box sx={{ flex: 1 }}>
              <ResumeForm
             
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ResumePreview 
                
                onSave={handleSave}
              />
            </Box>
          </Box>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route 
              path="/login" 
              element={
                <Box sx={{ p: 2 }}>
                  <LoginPage />
                </Box>
              } 
            />
            <Route 
              path="/register" 
              element={
                <Box sx={{ p: 2 }}>
                  <RegisterPage />
                </Box>
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
