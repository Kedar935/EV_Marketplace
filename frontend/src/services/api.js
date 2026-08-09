import axios from 'axios';

const normalizeURL = (rawUrl) => {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  // Enforce https in production to prevent browser Mixed Content blocks
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http:')) {
    url = url.replace(/^http:/, 'https:');
  }
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // Guarantee /api/v1 prefix is appended regardless of user input format
  if (!url.endsWith('/api/v1')) {
    if (url.endsWith('/api')) {
      url = `${url}/v1`;
    } else {
      url = `${url}/api/v1`;
    }
  }
  return url;
};

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return normalizeURL(envUrl);
  }
  // Production fallback if environment variable is omitted in Vercel settings
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ev-marketplace-backend.onrender.com/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 35000, // 35s timeout to support Render/free host cold starts
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

// Response interceptor for clear error messaging and cold start handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Backend server connection timed out. The backend host (e.g. Render) may be waking up. Please retry in a few seconds.';
    } else if (error.message === 'Network Error') {
      message = 'Network Error: Cannot connect to backend server. Please verify your VITE_API_URL environment variable, SSL (HTTPS), or CORS configuration.';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    const errorCode = error.response?.data?.errorCode || error.code || 'API_ERROR';
    return Promise.reject({ message, errorCode, status: error.response?.status });
  }
);

export default API;

