import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
});

// ── Webhook routes ──────────────────────────────────────────
export const fetchWebhookLogs = () => api.get('/api/webhook/logs');
export const receiveWebhook   = (data) => api.post('/api/webhook/receive', data);

// ── Merchant routes ─────────────────────────────────────────
// These will work once you add merchant routes to your backend.
// Expected: GET /api/merchants  POST /api/merchants
export const fetchMerchants  = () => api.get('/api/merchants');
export const createMerchant  = (data) => api.post('/api/merchants', data);
export const deleteMerchant  = (id) => api.delete(`/api/merchants/${id}`);

export default api;
