import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programService } from '../services/programService';

export function usePrograms(params = {}) {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => programService.list(params),
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: programService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => programService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: programService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}