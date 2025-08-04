import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';

const ServerStatus = ({ apiUrl }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'error'
  const [message, setMessage] = useState('Checking server status...');

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        console.log('Checking server status at:', `${apiUrl}/test`);
        const response = await fetch(`${apiUrl}/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setStatus('online');
          setMessage('Server is online and accessible');
        } else {
          setStatus('error');
          setMessage(`Server returned status: ${response.status}`);
        }
      } catch (error) {
        console.error('Server status check failed:', error);
        setStatus('offline');
        setMessage('Server is not accessible. Please make sure it is running.');
      }
    };

    checkServerStatus();
  }, [apiUrl]);

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle color="success" />;
      case 'offline':
        return <Error color="error" />;
      case 'error':
        return <Warning color="warning" />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'error':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Typography variant="body2">Server Status:</Typography>
      <Chip
        icon={getStatusIcon()}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={getStatusColor()}
        size="small"
      />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default ServerStatus; 