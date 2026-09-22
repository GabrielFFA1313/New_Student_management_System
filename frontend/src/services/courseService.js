import apiClient from './apiClient';

export const courseService = {
  async list(params = {}) {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/courses', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/courses/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/courses/${id}`);
  },
};