import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi, UpdateGoalData } from '../api/goals';

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getAll,
  });
};

export const useWishlistedGoals = () => {
  return useQuery({
    queryKey: ['goals', 'wishlisted'],
    queryFn: goalsApi.getWishlisted,
  });
};

export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalData }) =>
      goalsApi.update(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
      void queryClient.invalidateQueries({ queryKey: ['goals', variables.id] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.toggleWishlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
