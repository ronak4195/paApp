// src/api/auth.js
import api from './client';

export const signup = async (payload) => {
  const res = await api.post('/auth/signup', payload);
  return res.data; // expect { token, user }
};

export const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data.data; // expect { token, user }
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data; // expect user object
};
