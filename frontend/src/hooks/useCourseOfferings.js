import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseOfferingService } from '../services/courseOfferingService';

export function useCourseOfferings(params = {}) {
  return useQuery({
    queryKey: ['courseOfferings', params],
    queryFn: () => courseOfferingService.list(params),
  });
}

export function useCreateCourseOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseOfferingService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courseOfferings'] }),
  });
}

export function useUpdateCourseOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => courseOfferingService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courseOfferings'] }),
  });
}

export function useDeleteCourseOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseOfferingService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courseOfferings'] }),
  });
}