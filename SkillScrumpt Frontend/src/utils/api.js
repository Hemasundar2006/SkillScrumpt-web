import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle maintenance mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 503 && error.response.data.maintenanceMode) {
      if (window.location.pathname !== '/maintenance' && window.location.pathname !== '/login') {
        window.location.href = '/maintenance';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
