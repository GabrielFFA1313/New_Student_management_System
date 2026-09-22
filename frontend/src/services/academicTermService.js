import apiClient from './apiClient';

export const academicTermService = {
  async list(params = {}) {
    const response = await apiClient.get('/academic-terms', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/academic-terms/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/academic-terms', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/academic-terms/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/academic-terms/${id}`);
  },
};