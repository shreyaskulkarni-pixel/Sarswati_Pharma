import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const medicinesAPI = {
  getAll: (params) => apiClient.get('/medicines', { params }),
  getCategories: () => apiClient.get('/medicines/categories'),
  getById: (id) => apiClient.get(`/medicines/${id}`),
  getLowStock: () => apiClient.get('/medicines/inventory/low-stock'),
};

export const ordersAPI = {
  create: (data) => apiClient.post('/orders', data),
  getAll: (params) => apiClient.get('/orders', { params }),
  getById: (id) => apiClient.get(`/orders/${id}`),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
};

export const chatAPI = {
  send: (message) => apiClient.post('/chat', { message }),
};

export const contactsAPI = {
  submit: (data) => apiClient.post('/contacts', data),
};
