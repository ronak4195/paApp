// src/api/transactions.js
import api from './client';

export const fetchTransactions = async (params = {}) => {
  const res = await api.get('/transactions', { params });
  return res.data; // expect { items, total } or adjust
};

export const fetchTransactionById = async (id) => {
  const res = await api.get(`/transactions/${id}`);
  return res.data;
};

export const createTransaction = async (payload) => {
  const res = await api.post('/transactions', payload);
  return res.data;
};

export const updateTransaction = async (id, payload) => {
  const res = await api.put(`/transactions/${id}`, payload);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};
