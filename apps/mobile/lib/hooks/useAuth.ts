import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
    retry: false,
    select: (data) => data.user,
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
