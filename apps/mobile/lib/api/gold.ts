import apiClient from './client';

export interface GoldPrice {
  date: string;
  time: string;
  time_unix: number;
  symbol: string;
  name_en: string;
  name: string;
  price: number;
  change_value: number;
  change_percent: number;
  unit: string;
}

export const goldApi = {
  getAll: async (): Promise<GoldPrice[]> => {
    const response = await apiClient.get<{ gold: GoldPrice[] }>('/gold');
    return response.data.gold;
  },

  get18K: async (): Promise<{ price: number; unit: string }> => {
    const response = await apiClient.get<{ price: number; unit: string }>('/gold/18k');
    return response.data;
  },
};
