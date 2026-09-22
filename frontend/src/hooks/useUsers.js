import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await apiClient.get('/users', { params });
      return response.data.data;
    },
  });
}