import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Machines
export const getMachines = () => api.get('/machines');
export const createMachine = (data) => api.post('/machines', data);
export const updateMachineStatus = (id, status) => 
  api.put(`/machines/${id}/status`, { status });

// Production
export const getProduction = () => api.get('/production');
export const createProduction = (data) => api.post('/production', data);
export const getProductionStats = () => api.get('/production/stats');

// Reports
export const getReports = (params) => api.get('/reports', { params });

export default api;