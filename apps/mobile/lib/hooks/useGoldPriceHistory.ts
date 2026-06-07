import { useQuery, useMutation } from '@tanstack/react-query';
import { goldPriceHistoryApi, GetGoldPriceHistoryParams } from '../api/goldPriceHistory';

// Query keys
export const goldPriceHistoryKeys = {
  all: ['goldPriceHistory'] as const,
  lists: () => [...goldPriceHistoryKeys.all, 'list'] as const,
  list: (params?: GetGoldPriceHistoryParams) => [...goldPriceHistoryKeys.lists(), params] as const,
};

/**
 * Hook to fetch gold price history
 */
export const useGoldPriceHistory = (params?: GetGoldPriceHistoryParams) => {
  return useQuery({
    queryKey: goldPriceHistoryKeys.list(params),
    queryFn: () => goldPriceHistoryApi.getHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - price history doesn't change often
  });
};

/**
 * Hook to seed historical data (for testing)
 */
export const useSeedHistoricalData = () => {
  return useMutation({
    mutationFn: (days: number) => goldPriceHistoryApi.seedHistoricalData(days),
  });
};
