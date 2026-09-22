import apiClient from './apiClient';

export const studentService = {
  async list(params = {}) {
    const response = await apiClient.get('/students', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/students/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/students', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/students/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/students/${id}`);
  },
};