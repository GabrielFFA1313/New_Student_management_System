import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../services/gradeService';

export function useGrades(params = {}) {
  return useQuery({
    queryKey: ['grades', params],
    queryFn: () => gradeService.list(params),
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] }); // enrollment.grade changed
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => gradeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}