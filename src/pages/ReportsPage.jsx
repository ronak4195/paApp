// src/pages/ReportsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { getSummary, getTrend } from '../api/reports';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const ReportsPage = () => {
  const [summaryFilters, setSummaryFilters] = useState({
    period: 'monthly',
    start: '',
    end: '',
    groupBy: '',
  });
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    try {
      setLoadingSummary(true);
      setError('');
      const params = { period: summaryFilters.period };
      if (summaryFilters.period === 'custom') {
        if (summaryFilters.start) params.start = summaryFilters.start;
        if (summaryFilters.end) params.end = summaryFilters.end;
      }
      if (summaryFilters.groupBy) params.groupBy = summaryFilters.groupBy;
      const res = await getSummary(params);
      setSummary(res);
    } catch (err) {
      setError('Failed to load summary reports.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadTrend = async () => {
    try {
      setLoadingTrend(true);
      const res = await getTrend({
        interval: 'monthly',
        // optionally pass date range
      });
      setTrend(res);
    } catch (err) {
      // optional endpoint; ignore error
    } finally {
      setLoadingTrend(false);
    }
  };

  useEffect(() => {
    loadSummary();
    loadTrend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setSummaryFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryFilters.period, summaryFilters.groupBy]);

  useEffect(() => {
    if (summaryFilters.period === 'custom') {
      loadSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryFilters.start, summaryFilters.end]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      {error && <ErrorAlert message={error} />}

      {/* Summary filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Period"
              name="period"
              select
              fullWidth
              value={summaryFilters.period}
              onChange={handleFilterChange}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </TextField>
          </Grid>
          {summaryFilters.period === 'custom' && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Start"
                  name="start"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={summaryFilters.start}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="End"
                  name="end"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={summaryFilters.end}
                  onChange={handleFilterChange}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Group By"
              name="groupBy"
              select
              fullWidth
              value={summaryFilters.groupBy}
              onChange={handleFilterChange}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="subcategory">Subcategory</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary cards and group table/chart */}
      {loadingSummary ? (
        <LoadingSpinner />
      ) : (
        summary && (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Total Income</Typography>
                  <Typography variant="h5">
                    ₹{summary.totalIncome?.toLocaleString() || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Total Expenses</Typography>
                  <Typography variant="h5" color="error.main">
                    ₹{summary.totalExpenses?.toLocaleString() || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2">Savings</Typography>
                  <Typography
                    variant="h5"
                    color={
                      summary.savings >= 0 ? 'success.main' : 'error.main'
                    }
                  >
                    ₹{summary.savings?.toLocaleString() || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {summaryFilters.groupBy && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {summaryFilters.groupBy === 'category'
                    ? 'By Category'
                    : 'By Subcategory'}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summary.groups || []}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" />
                    <Bar dataKey="expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            )}
          </>
        )
      )}

      {/* Trend Chart */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Trends (Income vs Expenses vs Savings)
        </Typography>
        {loadingTrend ? (
          <LoadingSpinner />
        ) : trend && Array.isArray(trend.points) ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trend.points}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" />
              <Line type="monotone" dataKey="expenses" />
              <Line type="monotone" dataKey="savings" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2">
            Trend data not available. Implement /reports/trend in backend to
            enable this chart.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ReportsPage;
