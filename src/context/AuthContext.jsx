// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('pa_token');
  //   const storedUser = localStorage.getItem('pa_user');
  //   if (storedToken && storedUser) {
  //     setToken(storedToken);
  //     setUser(JSON.parse(storedUser));
  //     setAuthToken(storedToken);
  //   }
  //   setInitializing(false);
  // }, []);
useEffect(() => {
  const storedToken = localStorage.getItem('pa_token');
  const storedUser = localStorage.getItem('pa_user');

  if (storedToken && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);

      setToken(storedToken);
      setUser(parsedUser);
      setAuthToken(storedToken);
    } catch (err) {
      console.error('Failed to parse pa_user from localStorage', err);
      // Cleanup corrupt data
      localStorage.removeItem('pa_token');
      localStorage.removeItem('pa_user');
    }
  }

  setInitializing(false);
}, []);

  const handleLogin = async (email, password) => {
    const { token: t, user: u } = await apiLogin({ email, password });
    console.log('token after login:', t);
    
    setToken(t);
    setUser(u);
    setAuthToken(t);
    localStorage.setItem('pa_token', t);
    localStorage.setItem('pa_user', JSON.stringify(u));
  };

  const handleSignup = async (name, email, password) => {
    const { token: t, user: u } = await apiSignup({ name, email, password });
    setToken(t);
    setUser(u);
    setAuthToken(t);
    localStorage.setItem('pa_token', t);
    localStorage.setItem('pa_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('pa_token');
    localStorage.removeItem('pa_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    initializing,
    login: handleLogin,
    signup: handleSignup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
