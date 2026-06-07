import apiClient from './client';

export interface GoldPriceHistoryPoint {
  date: string;
  price: number;
}

export interface GoldPriceHistoryResponse {
  history: GoldPriceHistoryPoint[];
  count: number;
  startDate: string;
  endDate: string;
}

export interface GetGoldPriceHistoryParams {
  startDate?: string;
  endDate?: string;
  days?: number;
  limit?: number;
}

export const goldPriceHistoryApi = {
  getHistory: async (params?: GetGoldPriceHistoryParams): Promise<GoldPriceHistoryResponse> => {
    const response = await apiClient.get<GoldPriceHistoryResponse>('/gold-history', { params });
    return response.data;
  },

  seedHistoricalData: async (days: number = 30): Promise<void> => {
    await apiClient.post(`/gold-history/seed?days=${days}`);
  },

  storeTodayPrice: async (): Promise<void> => {
    await apiClient.post('/gold-history/store-today');
  },
};
