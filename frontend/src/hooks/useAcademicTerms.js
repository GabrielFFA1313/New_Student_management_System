import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicTermService } from '../services/academicTermService';

export function useAcademicTerms(params = {}) {
  return useQuery({
    queryKey: ['academicTerms', params],
    queryFn: () => academicTermService.list(params),
  });
}

export function useCreateAcademicTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicTermService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academicTerms'] }),
  });
}

export function useUpdateAcademicTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => academicTermService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academicTerms'] }),
  });
}

export function useDeleteAcademicTerm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicTermService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['academicTerms'] }),
  });
}