import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Food Listing Services
export const foodListingService = {
  create: (data) => api.post('/food-listings', data),
  getAll: (params) => api.get('/food-listings', { params }),
  getById: (id) => api.get(`/food-listings/${id}`),
  update: (id, data) => api.put(`/food-listings/${id}`, data),
  delete: (id) => api.delete(`/food-listings/${id}`),
  getMyListings: () => api.get('/food-listings/my-listings'),
};

// Request Services
export const requestService = {
  create: (data) => api.post('/requests', data),
  getById: (id) => api.get(`/requests/${id}`),
  getMyRequests: () => api.get('/requests/my-requests'),
  getRequestsForMyListings: () => api.get('/requests/my-listings-requests'),
  accept: (id) => api.put(`/requests/${id}/accept`),
  reject: (id, data) => api.put(`/requests/${id}/reject`, data),
  complete: (id) => api.put(`/requests/${id}/complete`),
  cancel: (id, data) => api.put(`/requests/${id}/cancel`, data),
};

// NGO Services
export const ngoService = {
  register: (data) => api.post('/ngos', data),
  getAll: (params) => api.get('/ngos', { params }),
  getById: (id) => api.get(`/ngos/${id}`),
  update: (id, data) => api.put(`/ngos/${id}`, data),
  verify: (id) => api.put(`/ngos/${id}/verify`),
  getMyNGO: () => api.get('/ngos/ngo/my-ngo'),
};

// Rating Services
export const ratingService = {
  createRating: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get(`/ratings/${userId}`),
};

// User Services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  uploadProfileImage: (formData) => api.post('/users/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
