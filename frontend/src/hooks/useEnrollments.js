import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollmentService';

export function useEnrollments(params = {}) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => enrollmentService.list(params),
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrollmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courseOfferings'] }); // enrolled_count changed
    },
  });
}

export function useUpdateEnrollmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => enrollmentService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
  });
}

export function useDeleteEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enrollmentService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courseOfferings'] });
    },
  });
}