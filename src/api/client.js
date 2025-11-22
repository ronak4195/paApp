// src/api/client.js
// src/api/client.js
import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL,
});

// // ...rest stays the same

// import axios from 'axios';

// const baseURL =
//   process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

// const api = axios.create({
//   baseURL,
// });

// Attach JWT
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('pa_token');
      localStorage.removeItem('pa_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
