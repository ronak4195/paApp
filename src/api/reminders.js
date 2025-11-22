// src/api/reminders.js
import api from './client';

export const fetchReminders = async (params = {}) => {
  const res = await api.get('/reminders', { params });
  return res.data; // expect { items } or array
};

export const fetchReminderById = async (id) => {
  const res = await api.get(`/reminders/${id}`);
  return res.data;
};

export const createReminder = async (payload) => {
  const res = await api.post('/reminders', payload);
  return res.data;
};

export const updateReminder = async (id, payload) => {
  const res = await api.put(`/reminders/${id}`, payload);
  return res.data;
};

export const deleteReminder = async (id) => {
  const res = await api.delete(`/reminders/${id}`);
  return res.data;
};
