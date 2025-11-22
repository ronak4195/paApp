// src/api/categories.js
import api from './client';

export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data; // expect array of categories
};

export const createCategory = async (payload) => {
  const res = await api.post('/categories', payload);
  return res.data;
};

export const updateCategory = async (id, payload) => {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
