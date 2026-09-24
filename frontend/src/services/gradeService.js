import apiClient from './apiClient';

export const gradeService = {
  async list(params = {}) {
    const response = await apiClient.get('/grades', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/grades/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/grades', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.put(`/grades/${id}`, payload);
    return response.data.data;
  },
};