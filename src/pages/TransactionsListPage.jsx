// src/pages/TransactionsListPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions, deleteTransaction } from '../api/transactions';
import { fetchCategories } from '../api/categories';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { toISODateString } from '../utils/date';

const TransactionsListPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    type: '',
    from: '',
    to: '',
    categoryId: '',
    subcategoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteState, setDeleteState] = useState({ open: false, id: null });

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data.filter((c) => !c.parentId));
    } catch (err) {
      // ignore
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };
      if (filters.type) params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.subcategoryId) params.subcategoryId = filters.subcategoryId;

      const res = await fetchTransactions(params);
      setTransactions(res.items || res.data || []);
      setTotal(res.total || (res.items ? res.items.length : 0));
    } catch (err) {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
    if (name === 'categoryId') {
      setFilters((f) => ({ ...f, categoryId: value, subcategoryId: '' }));
      // load subcategories locally:
      // for simplicity assume fetchCategories already gave us all (you can store all)
    }
  };

  const handleApplyFilters = () => {
    setPage(0);
    loadTransactions();
  };

  const confirmDelete = (id) => setDeleteState({ open: true, id });
  const closeDelete = () => setDeleteState({ open: false, id: null });

  const handleDelete = async () => {
    try {
      await deleteTransaction(deleteState.id);
      closeDelete();
      loadTransactions();
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (loading && !transactions.length) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/transactions/new')}
        >
          Add Transaction
        </Button>
      </Box>

      {error && <ErrorAlert message={error} />}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Type"
              name="type"
              select
              fullWidth
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="From"
              type="date"
              name="from"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={filters.from}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="To"
              type="date"
              name="to"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={filters.to}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Category"
              name="categoryId"
              select
              fullWidth
              value={filters.categoryId}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id || c._id} value={c.id || c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* subcategory filter can be added if you keep all categories in state */}
        </Grid>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id || tx._id}>
                <TableCell>{toISODateString(tx.date)}</TableCell>
                <TableCell
                  sx={{
                    color:
                      tx.type === 'income' ? 'success.main' : 'error.main',
                    textTransform: 'capitalize',
                  }}
                >
                  {tx.type}
                </TableCell>
                <TableCell>
                  {tx.categoryName}
                  {tx.subcategoryName ? ` / ${tx.subcategoryName}` : ''}
                </TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell align="right">
                  {tx.currency || '₹'} {tx.amount?.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() =>
                      navigate(`/transactions/${tx.id || tx._id}/edit`)
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => confirmDelete(tx.id || tx._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!transactions.length && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ConfirmDialog
        open={deleteState.open}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        onCancel={closeDelete}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default TransactionsListPage;
