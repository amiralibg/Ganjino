import { useQuery } from '@tanstack/react-query';
import { goldApi } from '../api/gold';

export const useGoldPrices = () => {
  return useQuery({
    queryKey: ['gold'],
    queryFn: goldApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const use18KGoldPrice = () => {
  return useQuery({
    queryKey: ['gold', '18k'],
    queryFn: goldApi.get18K,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
