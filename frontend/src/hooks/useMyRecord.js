import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/authContext';
import { studentService } from '../services/studentService';
import apiClient from '../services/apiClient';

export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['myProfile', user?.student_id],
    queryFn: () => studentService.get(user.student_id),
    enabled: !!user?.student_id,
  });
}

export function useMyEnrollments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['myEnrollments', user?.student_id],
    queryFn: async () => {
      const response = await apiClient.get(`/students/${user.student_id}/enrollments`);
      return response.data;
    },
    enabled: !!user?.student_id,
  });
}

export function useMyGrades() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['myGrades', user?.student_id],
    queryFn: async () => {
      const response = await apiClient.get(`/students/${user.student_id}/grades`);
      return response.data;
    },
    enabled: !!user?.student_id,
  });
}

export function useMyAcademicRecord() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['myAcademicRecord', user?.student_id],
    queryFn: async () => {
      const response = await apiClient.get(`/students/${user.student_id}/academic-record`);
      return response.data.data;
    },
    enabled: !!user?.student_id,
  });
}