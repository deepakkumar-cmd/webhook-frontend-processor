// frontend/src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
});

// Add response interceptor to handle errors and format data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// ── Auth routes ──────────────────────────────────────────
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// ── Webhook routes ──────────────────────────────────────────
export const fetchWebhookLogs = async () => {
  try {
    const response = await api.get('/api/webhook/logs');
    console.log('Raw logs response:', response.data);
    
    let logsData = [];
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      logsData = response.data.data;
    } else if (Array.isArray(response.data)) {
      logsData = response.data;
    } else if (response.data && typeof response.data === 'object') {
      logsData = [];
    }
    
    return { data: logsData };
  } catch (error) {
    console.error('Failed to fetch webhook logs:', error);
    return { data: [] };
  }
};

export const receiveWebhook = (data) => api.post('/api/webhook/receive', data);

// ── Merchant routes ─────────────────────────────────────────
export const fetchMerchants = async () => {
  try {
    const response = await api.get('/api/merchants');
    console.log('Raw merchants response:', response.data);
    
    let merchantsData = [];
    if (Array.isArray(response.data)) {
      merchantsData = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      merchantsData = response.data.data;
    }
    
    return { data: merchantsData };
  } catch (error) {
    console.error('Failed to fetch merchants:', error);
    return { data: [] };
  }
};

export const createMerchant = async (data) => {
  const response = await api.post('/api/merchants', data);
  return response.data;
};

export const deleteMerchant = async (id) => {
  const response = await api.delete(`/api/merchants/${id}`);
  return response.data;
};

export const updateMerchant = async (id, data) => {
  const response = await api.put(`/api/merchants/${id}`, data);
  return response.data;
};

// ── Webhook retry ─────────────────────────────────────────
export const retryWebhookCallback = async (webhookId) => {
  try {
    const response = await api.post(`/api/webhook/${webhookId}/retry`);
    return response.data;
  } catch (error) {
    console.error('Failed to retry webhook:', error);
    throw error;
  }
};

export const manualRetryWebhook = async (webhookId) => {
  try {
    const response = await api.post(`/api/webhook/${webhookId}/manual-retry`);
    return response.data;
  } catch (error) {
    console.error('Failed to manual retry webhook:', error);
    throw error;
  }
};

export default api;