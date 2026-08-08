import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.trim();
  }
  // Automatic Production fallback for Vercel if environment variable is missing
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ev-marketplace-backend.onrender.com/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ev_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error formatting
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    const errorCode = error.response?.data?.errorCode || 'API_ERROR';
    return Promise.reject({ message, errorCode, status: error.response?.status });
  }
);

export default API;
