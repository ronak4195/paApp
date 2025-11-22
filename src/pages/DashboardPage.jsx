// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getSummary } from '../api/reports';
import { fetchTransactions } from '../api/transactions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const DashboardPage = () => {
  const [period, setPeriod] = useState('monthly');
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async (selectedPeriod) => {
    try {
      setLoading(true);
      setError('');
      const [summaryRes, txRes] = await Promise.all([
        getSummary({ period: selectedPeriod }),
        fetchTransactions({ limit: 10, sort: 'date_desc' }),
      ]);
      setSummary(summaryRes);
      // adjust if backend returns { items: [...] }
      setTransactions(txRes.items || txRes);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePeriodChange = (p) => {
    setPeriod(p);
    loadData(p);
  };

  if (loading && !summary) {
    return <LoadingSpinner />;
  }

  console.log('Dashboard summary:', transactions);

  return (
    // <div>
    //   <h1>Dashboard</h1>
    // </div>
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && <ErrorAlert message={error} />}

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Total Income</Typography>
            <Typography variant="h5">
              ₹{summary?.data?.totals?.income?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Total Expenses</Typography>
            <Typography variant="h5" color="error.main">
              ₹{summary?.data?.totals?.expenses?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Savings</Typography>
            <Typography
              variant="h5"
              color={summary?.savings >= 0 ? 'success.main' : 'error.main'}
            >
              ₹{summary?.data?.totals?.savings?.toLocaleString() || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Period filters */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant={period === 'weekly' ? 'contained' : 'outlined'}
          sx={{ mr: 1 }}
          onClick={() => handlePeriodChange('weekly')}
        >
          This Week
        </Button>
        <Button
          variant={period === 'monthly' ? 'contained' : 'outlined'}
          sx={{ mr: 1 }}
          onClick={() => handlePeriodChange('monthly')}
        >
          This Month
        </Button>
        <Button
          variant={period === 'yearly' ? 'contained' : 'outlined'}
          onClick={() => handlePeriodChange('yearly')}
        >
          This Year
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 320 }}>
            <Typography variant="subtitle1" gutterBottom>
              Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summary?.byCategory || []}
                margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Transactions
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id || tx._id}>
                    <TableCell>
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          tx.type === 'income'
                            ? 'success.main'
                            : 'error.main',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tx.type}
                    </TableCell>
                    <TableCell>
                      {tx.categoryName}
                      {tx.subcategoryName ? ` / ${tx.subcategoryName}` : ''}
                    </TableCell>
                    <TableCell align="right">
                      ₹{tx.amount?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {!transactions.length && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody> */}
              <TableBody>
                {Array.isArray(transactions.data) && transactions.data.length > 0 ? (
                  transactions.data.map((tx) => (
                    <TableRow key={tx.id || tx._id}>
                      <TableCell>
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>

                      <TableCell
                        sx={{
                          color:
                            tx.type === 'income'
                              ? 'success.main'
                              : 'error.main',
                          textTransform: 'capitalize',
                        }}
                      >
                        {tx.type}
                      </TableCell>

                      <TableCell>
                        {tx.categoryName}
                        {tx.subcategoryName ? ` / ${tx.subcategoryName}` : ''}
                      </TableCell>

                      <TableCell align="right">
                        ₹{tx.amount?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No recent transactions
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
