// src/api/reports.js
import api from './client';

export const getSummary = async (params = {}) => {
  const res = await api.get('/reports/summary', { params });
  return res.data; // expect { totalIncome, totalExpenses, savings, ... }
};

export const getTrend = async (params = {}) => {
  const res = await api.get('/reports/trend', { params });
  return res.data; // shape depends on backend
};
