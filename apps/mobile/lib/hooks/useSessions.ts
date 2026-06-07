import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: authApi.getActiveSessions,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useLogoutAllDevices = () => {
  return useMutation({
    mutationFn: authApi.signOutAllDevices,
  });
};
