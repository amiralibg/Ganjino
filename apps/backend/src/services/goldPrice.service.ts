import axios from 'axios';
import { env } from '../config/env';

const GOLD_API_URL = env.GOLD_API_URL;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const getGoldApiKey = (): string => {
  const apiKey = env.GOLD_API_KEY;
  if (!apiKey) {
    throw new Error('GOLD_API_KEY environment variable is not set');
  }
  return apiKey;
};

interface MarketItem {
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

interface GoldApiResponse {
  gold: MarketItem[];
  currency: MarketItem[];
  cryptocurrency: unknown[];
}

interface CachedMarketData {
  data: GoldApiResponse;
  timestamp: number;
}

let marketCache: CachedMarketData | null = null;

/**
 * Fetch the full market snapshot (gold + currency) with a shared 5-minute cache.
 * A single upstream request returns gold and currency, so both share one cache.
 */
const fetchMarketData = async (): Promise<GoldApiResponse> => {
  if (marketCache && Date.now() - marketCache.timestamp < CACHE_DURATION) {
    console.log('Returning cached market data');
    return marketCache.data;
  }

  try {
    console.log('Fetching fresh market data from API');
    const response = await axios.get<GoldApiResponse>(GOLD_API_URL, {
      params: { key: getGoldApiKey() },
      timeout: 10000, // 10 second timeout
    });

    marketCache = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch market data:', errorMessage);

    // If we have cached data (even if expired), return it
    if (marketCache) {
      console.log('Returning expired cache due to API error');
      return marketCache.data;
    }

    throw new Error('Failed to fetch market data and no cache available');
  }
};

export const fetchGoldPrices = async (): Promise<MarketItem[]> => {
  const market = await fetchMarketData();
  return market.gold;
};

export const fetchCurrencyPrices = async (): Promise<MarketItem[]> => {
  const market = await fetchMarketData();
  return market.currency;
};

export const get18KGoldPrice = async (): Promise<number> => {
  const goldPrices = await fetchGoldPrices();
  const gold18K = goldPrices.find((item) => item.symbol === 'IR_GOLD_18K');

  if (!gold18K) {
    throw new Error('18K gold price not found');
  }

  return gold18K.price;
};

/**
 * Free-market US Dollar price in Toman (symbol "USD").
 */
export const getUSDPrice = async (): Promise<number> => {
  const currencyPrices = await fetchCurrencyPrices();
  const usd = currencyPrices.find((item) => item.symbol === 'USD');

  if (!usd) {
    throw new Error('USD price not found');
  }

  return usd.price;
};

export const calculateGoldEquivalent = (priceInToman: number, goldPricePerGram: number): number => {
  // Returns how many grams of gold needed to buy the item
  return priceInToman / goldPricePerGram;
};
