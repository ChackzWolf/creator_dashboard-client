import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the admin auth token
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 - Unauthorized (token expired)
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ message: 'Network error occurred' });
  }
);

export default adminApi;