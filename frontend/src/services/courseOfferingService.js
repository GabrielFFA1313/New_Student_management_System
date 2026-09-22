import apiClient from './apiClient';

export const courseOfferingService = {
  async list(params = {}) {
    const response = await apiClient.get('/course-offerings', { params });
    return response.data;
  },

  async get(id) {
    const response = await apiClient.get(`/course-offerings/${id}`);
    return response.data.data;
  },

  async create(payload) {
    const response = await apiClient.post('/course-offerings', payload);
    return response.data.data;
  },

  async update(id, payload) {
    const response = await apiClient.patch(`/course-offerings/${id}`, payload);
    return response.data.data;
  },

  async remove(id) {
    await apiClient.delete(`/course-offerings/${id}`);
  },
};