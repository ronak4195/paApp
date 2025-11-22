// src/pages/TransactionFormPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createTransaction,
  updateTransaction,
  fetchTransactionById,
} from '../api/transactions';
import { fetchCategories } from '../api/categories';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

const TransactionFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    currency: 'INR',
    categoryId: '',
    subcategoryId: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    const data = await fetchCategories();
    setAllCategories(data);
    setCategories(data.filter((c) => !c.parentId));
  };

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const tx = await fetchTransactionById(id);
      setForm({
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency || 'INR',
        categoryId: tx.categoryId,
        subcategoryId: tx.subcategoryId || '',
        description: tx.description || '',
        date: new Date(tx.date).toISOString().slice(0, 10),
      });
    } catch (err) {
      setError('Failed to load transaction.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    if (id) loadTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!form.categoryId) {
      setSubcategories([]);
      return;
    }
    const subs = allCategories.filter(
      (c) => c.parentId === form.categoryId
    );
    setSubcategories(subs);
  }, [form.categoryId, allCategories]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Amount must be positive.');
      return;
    }
    if (!form.categoryId) {
      setError('Category is required.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      if (isEdit) {
        await updateTransaction(id, payload);
      } else {
        await createTransaction(payload);
      }
      navigate('/transactions');
    } catch (err) {
      setError('Failed to save transaction.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Transaction' : 'New Transaction'}
      </Typography>
      {error && <ErrorAlert message={error} />}

      <Paper sx={{ p: 2, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Type"
                name="type"
                select
                fullWidth
                value={form.type}
                onChange={handleChange}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                fullWidth
                value={form.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency"
                name="currency"
                fullWidth
                value={form.currency}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form.date}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="categoryId"
                select
                fullWidth
                value={form.categoryId}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id || c._id} value={c.id || c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subcategory"
                name="subcategoryId"
                select
                fullWidth
                value={form.subcategoryId}
                onChange={handleChange}
                disabled={!subcategories.length}
              >
                <MenuItem value="">None</MenuItem>
                {subcategories.map((c) => (
                  <MenuItem key={c.id || c._id} value={c.id || c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
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
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button sx={{ mr: 1 }} onClick={() => navigate('/transactions')}>
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

export default TransactionFormPage;
