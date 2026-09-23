import apiClient from './apiClient';

export const enrollmentService = {
  async list(params = {}) {
    const response = await apiClient.get('/enrollments', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/enrollments/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/enrollments', payload);
    return response.data.data;
  },

  async updateStatus(id, status) {
    const response = await apiClient.patch(`/enrollments/${id}`, { status });
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/enrollments/${id}`);
  },
};