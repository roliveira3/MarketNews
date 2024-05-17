import fs from "fs";

import stocks from "./data/stocks.json";
import namesData from "./data/names.json";
import candlesDailyData from "./data/candlesDaily.json";
import candlesMinuteData from "./data/candlesMinute.json";
import metricsData from "./data/metrics.json";
import trendsData from "./data/trends.json";
import newsData from "./data/news.json";
import * as api from "./api";
import {
  Candles,
  DEBUG_MODE,
  NewsItem,
  PriceChanges,
  StockMetrics,
  Trends,
  dateToString,
  DATA_PATH,
  CANDLES_DAILY_INTERVAL,
  CANDLES_MINUTE_INTERVAL,
  METRICS_INTERVAL,
  TRENDS_INTERVAL,
  NEWS_INTERVAL,
} from "./constants";
import * as dataHandler from "./dataHandler";

/**
 * Check if data needs to be updated.
 */
function isUpdateReady(symbol: string, data: any, interval: number) {
  if (symbol in data) {
    const lastUpdate: number | null =
      (data[symbol as keyof typeof data]?.["lastUpdate"] as number) ?? null;
    if (lastUpdate === null || Date.now() - lastUpdate < interval) {
      return false;
    }
  }
  return true;
}

/**
 * Calculate price change in percentage.
 */
const calcChange = (currPrice: number, prevPrice: number): number => {
  return Number(((currPrice * 100) / prevPrice - 100).toFixed(2));
};

/**
 * Get price changes in the last 24 hours, 7 days and 30 days.
 * Returns 0 if no price could be found.
 */
async function getPriceChanges(symbol: string): Promise<PriceChanges> {
  const price = dataHandler.getPrice(symbol);
  const stockCandles30d = dataHandler.getCandlesMinute(symbol);
  if (
    price === null ||
    stockCandles30d === null ||
    stockCandles30d["o"].length === 0
  ) {
    return {
      last24h: 0,
      last7d: 0,
      last30d: 0,
    };
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timestamp24h = currentTimestamp - 24 * 60 * 60;
  const timestamp7d = currentTimestamp - 7 * 24 * 60 * 60;
  const price30d = stockCandles30d!["o"][0]!;
  let price7d: number | null = null;
  let price24h: number | null = null;
  for (let i = 0; i < stockCandles30d.t.length; i++) {
    if (price7d === null && timestamp7d <= stockCandles30d.t[i]!) {
      price7d = stockCandles30d.o[i] ?? null;
    }
    if (timestamp24h <= stockCandles30d.t[i]!) {
      price24h = stockCandles30d.o[i] ?? null;
      break;
    }
  }

  return {
    last24h: price24h === null ? 0 : calcChange(price, price24h),
    last7d: price7d === null ? 0 : calcChange(price, price7d),
    last30d: calcChange(price, price30d),
  };
}

/**
 * Get low and high price and date, given a sequence of candles.
 */
export function getStockLowHigh(symbol: string): {
  lowPrice: number | null;
  lowDate: Date | null;
  highPrice: number | null;
  highDate: Date | null;
} {
  const candles = dataHandler.getCandlesDaily(symbol);
  if (candles === null) {
    return {
      lowPrice: null,
      lowDate: null,
      highPrice: null,
      highDate: null,
    };
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timestamp30d = currentTimestamp - 30 * 24 * 60 * 60;
  let lowIndex = 0;
  let highIndex = 0;
  for (let i = 1; i < candles.t.length; i++) {
    if (timestamp30d > candles.t[i]!) {
      continue;
    }
    if (candles.l[i]! < candles.l[lowIndex]!) {
      lowIndex = i;
    }
    if (candles.h[i]! > candles.h[highIndex]!) {
      highIndex = i;
    }
  }
  return {
    lowPrice: candles.l[lowIndex]!,
    lowDate: new Date(candles.t[lowIndex]! * 1000),
    highPrice: candles.h[highIndex]!,
    highDate: new Date(candles.t[highIndex]! * 1000),
  };
}

/**
 * Update data/names.json with current data from API.
 * Only update if name is not stored in data/names.json.
 */
async function updateStockName(symbol: string) {
  if (symbol in namesData) {
    return;
  }

  const names: {
    [key: string]: {
      name: string;
    };
  } = namesData;

  const stockName = await api.getStockName(symbol);
  if (stockName === null) {
    return;
  }

  names[symbol] = {
    name: stockName,
  };

  const namesJson = JSON.stringify(names, null, 4);
  fs.writeFileSync(`${DATA_PATH}/names.json`, namesJson);
  if (DEBUG_MODE) console.log(`${symbol}: Name updated!`);
}

/**
 * Update data/candlesDaily.json with current data from API.
 */
async function updateCandleDailyData(symbol: string) {
  if (!isUpdateReady(symbol, candlesDailyData, CANDLES_DAILY_INTERVAL)) {
    return;
  }

  const candles: {
    [key: string]: {
      lastUpdate: number;
      candles: Candles;
    };
  } = candlesDailyData;

  const stockCandles = await api.getStockCandles(symbol, 90, "D");
  if (stockCandles === null) {
    return;
  }

  candles[symbol] = {
    lastUpdate: Date.now(),
    candles: stockCandles,
  };

  const candlesJson = JSON.stringify(candles, null, 4);
  fs.writeFileSync(`${DATA_PATH}/candlesDaily.json`, candlesJson);
  if (DEBUG_MODE) console.log(`${symbol}: Candles Daily updated!`);
}

/**
 * Update data/candlesMinute.json with current data from API.
 */
async function updateCandleMinuteData(symbol: string) {
  if (!isUpdateReady(symbol, candlesMinuteData, CANDLES_MINUTE_INTERVAL)) {
    return;
  }

  const candles: {
    [key: string]: {
      lastUpdate: number;
      candles: Candles;
    };
  } = candlesMinuteData as {
    [key: string]: {
      lastUpdate: number;
      candles: Candles;
    };
  };

  const stockCandles = await api.getStockCandles(symbol, 30, "1");
  if (stockCandles === null) {
    return;
  }

  candles[symbol] = {
    lastUpdate: Date.now(),
    candles: stockCandles,
  };

  const candlesJson = JSON.stringify(candles, null, 4);
  fs.writeFileSync(`${DATA_PATH}/candlesMinute.json`, candlesJson);
  if (DEBUG_MODE) console.log(`${symbol}: Candles Minute updated!`);
}

/**
 * Update data/metrics.json with current data from API.
 */
export async function updateStockMetrics(symbol: string) {
  if (!isUpdateReady(symbol, metricsData, METRICS_INTERVAL)) {
    return;
  }

  const metrics: {
    [key: string]: {
      lastUpdate: number;
      metrics: StockMetrics;
    };
  } = metricsData;

  const stockMetrics = await api.getStockMetrics(symbol);
  if (stockMetrics === null) {
    return;
  }

  const priceChanges = await getPriceChanges(symbol);
  const weeklyLowHigh = getStockLowHigh(symbol);
  metrics[symbol] = {
    lastUpdate: Date.now(),
    metrics: {
      lowPriceWeekly: weeklyLowHigh.lowPrice,
      lowDateWeekly: weeklyLowHigh.lowDate
        ? dateToString(weeklyLowHigh.lowDate)
        : null,
      highPriceWeekly: weeklyLowHigh.highPrice,
      highDateWeekly: weeklyLowHigh.highDate
        ? dateToString(weeklyLowHigh.highDate)
        : null,
      lowPriceYearly: stockMetrics["52WeekLow"],
      lowDateYearly: stockMetrics["52WeekLowDate"],
      highPriceYearly: stockMetrics["52WeekHigh"],
      highDateYearly: stockMetrics["52WeekHighDate"],
      priceRelativeToSP500Yearly: stockMetrics["priceRelativeToS&P50052Week"],
      marketCap: stockMetrics.marketCapitalization,
      dividendPerShareYearly: stockMetrics.dividendPerShareAnnual,
      revenuePerShareYearly: stockMetrics.revenuePerShareAnnual,
      ...priceChanges,
    },
  };

  const metricsJson = JSON.stringify(metrics, null, 4);
  fs.writeFileSync(`${DATA_PATH}/metrics.json`, metricsJson);
  if (DEBUG_MODE) console.log(`${symbol}: Metrics updated!`);
}

/**
 * Update data/trends.json with current data from API.
 */
async function updateStockTrends(symbol: string) {
  if (!isUpdateReady(symbol, trendsData, TRENDS_INTERVAL)) {
    return;
  }

  const trends: {
    [key: string]: {
      lastUpdate: number;
      trends: Trends;
    };
  } = trendsData;

  const stockTrends = await api.getStockTrends(symbol);
  trends[symbol] = {
    lastUpdate: Date.now(),
    trends: stockTrends,
  };

  const trendsJson = JSON.stringify(trends, null, 4);
  fs.writeFileSync(`${DATA_PATH}/trends.json`, trendsJson);
  if (DEBUG_MODE) console.log(`${symbol}: Trends updated!`);
}

/**
 * Update data/news.json with current data from API.
 */
async function updateNewsData(symbol: string) {
  if (!isUpdateReady(symbol, newsData, NEWS_INTERVAL)) {
    return;
  }

  const news: {
    [key: string]: {
      lastUpdate: number;
      topNews: NewsItem[];
    };
  } = newsData;
  const stockNews = await api.getStockNews(symbol);
  if (stockNews === null) {
    return;
  }

  news[symbol] = {
    lastUpdate: Date.now(),
    topNews: stockNews,
  };

  const newsJson = JSON.stringify(news, null, 4);
  fs.writeFileSync(`${DATA_PATH}/news.json`, newsJson);
  if (DEBUG_MODE) console.log(`${symbol}: News updated!`);
}

/**
 * Update all data.
 */
export async function updateData() {
  for (const symbol of stocks.topStocks) {
    updateCandleMinuteData(symbol).then(() => updateStockMetrics(symbol));
    updateStockName(symbol);
    updateCandleDailyData(symbol);
    updateStockTrends(symbol);
    updateNewsData(symbol);
  }
}
