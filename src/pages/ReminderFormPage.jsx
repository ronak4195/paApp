// src/pages/ReminderFormPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createReminder,
  updateReminder,
  fetchReminderById,
} from '../api/reminders';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

const ReminderFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueAt: '',
    repeatInterval: 'none',
    isActive: true,
  });

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadReminder = async () => {
    try {
      setLoading(true);
      const rem = await fetchReminderById(id);
      setForm({
        title: rem.title,
        description: rem.description || '',
        dueAt: rem.dueAt
          ? new Date(rem.dueAt).toISOString().slice(0, 16)
          : '',
        repeatInterval: rem.repeatInterval || 'none',
        isActive: rem.isActive,
      });
    } catch (err) {
      setError('Failed to load reminder.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadReminder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.dueAt) {
      setError('Due date/time is required.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        // convert dueAt to ISO
        dueAt: new Date(form.dueAt).toISOString(),
      };
      if (isEdit) {
        await updateReminder(id, payload);
      } else {
        await createReminder(payload);
      }
      navigate('/reminders');
    } catch (err) {
      setError('Failed to save reminder.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Reminder' : 'New Reminder'}
      </Typography>
      {error && <ErrorAlert message={error} />}

      <Paper sx={{ p: 2, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={form.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due At"
                name="dueAt"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.dueAt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Repeat Interval"
                name="repeatInterval"
                select
                fullWidth
                value={form.repeatInterval}
                onChange={handleChange}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </TextField>
            </Grid>
            {isEdit && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                    />
                  }
                  label="Active"
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{ mr: 1 }} onClick={() => navigate('/reminders')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReminderFormPage;
