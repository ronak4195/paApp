// src/pages/RemindersListPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import ToggleOnIcon from '@mui/icons-material/ToggleOn';
  import ToggleOffIcon from '@mui/icons-material/ToggleOff';
  import { useNavigate } from 'react-router-dom';
  import {
    fetchReminders,
    deleteReminder,
    updateReminder,
  } from '../api/reminders';
  import LoadingSpinner from '../components/common/LoadingSpinner';
  import ErrorAlert from '../components/common/ErrorAlert';
  import ConfirmDialog from '../components/common/ConfirmDialog';
  import { toISODateString } from '../utils/date';

const RemindersListPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [filters, setFilters] = useState({
    isActive: '',
    from: '',
    to: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteState, setDeleteState] = useState({ open: false, id: null });

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.isActive !== '') params.isActive = filters.isActive === 'true';
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const res = await fetchReminders(params);
      setReminders(res.items || res);
    } catch (err) {
      setError('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const applyFilters = () => loadReminders();

  const confirmDelete = (id) => setDeleteState({ open: true, id });
  const closeDelete = () => setDeleteState({ open: false, id: null });

  const handleDelete = async () => {
    try {
      await deleteReminder(deleteState.id);
      closeDelete();
      loadReminders();
    } catch (err) {
      setError('Failed to delete reminder.');
    }
  };

  const toggleActive = async (rem) => {
    try {
      await updateReminder(rem.id || rem._id, {
        ...rem,
        isActive: !rem.isActive,
      });
      loadReminders();
    } catch (err) {
      setError('Failed to update reminder status.');
    }
  };

  // if (loading && !reminders.length) {
  //   return <LoadingSpinner />;
  // }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Reminders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reminders/new')}
        >
          New Reminder
        </Button>
      </Box>

      {error && <ErrorAlert message={error} />}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Status"
              name="isActive"
              select
              fullWidth
              value={filters.isActive}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="From"
              name="from"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={filters.from}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="To"
              name="to"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={filters.to}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Repeat</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {reminders.map((rem) => (
              <TableRow key={rem.id || rem._id}>
                <TableCell>{rem.title}</TableCell>
                <TableCell>{rem.description}</TableCell>
                <TableCell>
                  {rem.dueAt
                    ? new Date(rem.dueAt).toLocaleString()
                    : toISODateString(rem.dueAt)}
                </TableCell>
                <TableCell>{rem.repeatInterval || 'none'}</TableCell>
                <TableCell>
                  <Chip
                    label={rem.isActive ? 'Active' : 'Inactive'}
                    color={rem.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => toggleActive(rem)}>
                    {rem.isActive ? (
                      <ToggleOffIcon color="action" />
                    ) : (
                      <ToggleOnIcon color="success" />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      navigate(`/reminders/${rem.id || rem._id}/edit`)
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDelete(rem.id || rem._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!reminders.length && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No reminders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
        </Table>
      </Paper>

      <ConfirmDialog
        open={deleteState.open}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder?"
        onCancel={closeDelete}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default RemindersListPage;
