// src/components/common/ErrorAlert.jsx
import React from 'react';
import { Alert } from '@mui/material';

const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default ErrorAlert;
