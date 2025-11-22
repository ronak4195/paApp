// src/pages/ProfilePage.jsx
import React from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 500 }}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={user.name}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={user.email}
          InputProps={{ readOnly: true }}
        />
        {/* Extend with editable settings once backend supports it */}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
