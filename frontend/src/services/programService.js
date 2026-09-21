import apiClient from './apiClient';

export const programService = {
  async list(params = {}) {
    const response = await apiClient.get('/programs', { params });
    return response.data; // { success, message, data, meta }
  },

  async get(id) {
    const response = await apiClient.get(`/programs/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/programs', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/programs/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/programs/${id}`);
  },
};