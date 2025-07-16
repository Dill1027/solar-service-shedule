import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || 'Request failed'));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(new Error(error.response?.data?.message || error.message || 'API request failed'));
  }
);

export const installationService = {
  // Get all installations with optional filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/installations', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch installations');
    }
  },

  // Get single installation by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/installations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch installation');
    }
  },

  // Create new installation
  create: async (installationData) => {
    try {
      const response = await api.post('/installations', installationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create installation');
    }
  },

  // Update existing installation
  update: async (id, installationData) => {
    try {
      const response = await api.put(`/installations/${id}`, installationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update installation');
    }
  },

  // Delete installation
  delete: async (id) => {
    try {
      const response = await api.delete(`/installations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete installation');
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get('/installations/stats/overview');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
};

export default api;
