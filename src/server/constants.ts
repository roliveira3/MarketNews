export interface Candles {
  o: number[];
  l: number[];
  h: number[];
  c: number[];
  t: number[];
}

export interface PriceChanges {
  last24h: number;
  last7d: number;
  last30d: number;
}

export interface StockOverview extends PriceChanges {
  name: string;
  symbol: string;
  price: number;
}

export interface Trends {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface StockMetricsAPI {
  "52WeekLow": number | null;
  "52WeekLowDate": string | null;
  "52WeekHigh": number | null;
  "52WeekHighDate": string | null;
  "priceRelativeToS&P50052Week": number | null;
  marketCapitalization: number | null;
  dividendPerShareAnnual: number | null;
  revenuePerShareAnnual: number | null;
}

export interface StockMetrics extends PriceChanges {
  lowPriceWeekly: number | null;
  lowDateWeekly: string | null;
  highPriceWeekly: number | null;
  highDateWeekly: string | null;
  lowPriceYearly: number | null;
  lowDateYearly: string | null;
  highPriceYearly: number | null;
  highDateYearly: string | null;
  priceRelativeToSP500Yearly: number | null;
  marketCap: number | null;
  dividendPerShareYearly: number | null;
  revenuePerShareYearly: number | null;
}

export interface StockDetails extends StockOverview, StockMetrics {
  trends: Trends;
}

export interface NewsItem {
  datetime: number;
  headline: string;
  summary: string;
  image: string;
  source: string;
  url: string;
}

// Enable stock and candle data updates
export const UPDATES_ENABLED = true;
//print fetches to console
export const DEBUG_MODE = true;

// Intervals in milliseconds to fetch data from API
export const CANDLES_DAILY_INTERVAL = 60000;
export const CANDLES_MINUTE_INTERVAL = 60000;
export const NEWS_INTERVAL = 2 * 60000;
export const METRICS_INTERVAL = 5 * 60000;
export const TRENDS_INTERVAL = 15 * 60000;

export const DATA_PATH = "src/server/data";

/**
 * Translate date to string of date in ISO format (yyyy-mm-dd).
 */
export const dateToString = (date: Date): string => {
  return date.toISOString().split("T")[0] ?? "";
};
