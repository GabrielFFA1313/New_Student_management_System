import apiClient from './apiClient';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  getStoredUser() {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};