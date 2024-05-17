import fs from "fs";

import namesData from "./data/names.json";
import stocks from "./data/stocks.json";
import candlesDailyData from "./data/candlesDaily.json";
import candlesMinuteData from "./data/candlesMinute.json";
import metricsData from "./data/metrics.json";
import trendsData from "./data/trends.json";
import newsData from "./data/news.json";
import {
  Candles,
  DATA_PATH,
  NewsItem,
  StockMetrics,
  Trends,
} from "./constants";

const fileDataPairs = {
  names: namesData,
  candlesDaily: candlesDailyData,
  candlesMinute: candlesMinuteData,
  metrics: metricsData,
  trends: trendsData,
  news: newsData,
};

/**
 * Get the name of a symbol from data.
 */
export function getName(symbol: string): string | null {
  return symbol in namesData
    ? namesData[symbol as keyof typeof namesData]?.["name"] ?? null
    : null;
}

/**
 * Get the current price of a symbol from data.
 */
export function getPrice(symbol: string): number | null {
  const closePrices: number[] | null =
    symbol in candlesMinuteData
      ? (candlesMinuteData[symbol as keyof typeof candlesMinuteData]?.[
          "candles"
        ]?.["c"] as number[]) ?? null
      : null;
  return closePrices?.[closePrices.length - 1] ?? null;
}

/**
 * Get the metrics of a symbol from data.
 */
export function getMetrics(symbol: string): StockMetrics | null {
  return symbol in metricsData
    ? (metricsData[symbol as keyof typeof metricsData]?.[
        "metrics"
      ] as StockMetrics) ?? null
    : null;
}

/**
 * Get the trends of a symbol from data.
 */
export function getTrends(symbol: string): Trends | null {
  return symbol in trendsData
    ? (trendsData[symbol as keyof typeof trendsData]?.["trends"] as Trends) ??
        null
    : null;
}

/**
 * Get the company news of a symbol from data.
 */
export function getNews(symbol: string): NewsItem[] | null {
  return symbol in newsData
    ? (newsData[symbol as keyof typeof newsData]?.["topNews"] as NewsItem[]) ??
        null
    : null;
}

/**
 * Get the daily candles of a symbol from data.
 */
export function getCandlesDaily(symbol: string): Candles | null {
  return symbol in candlesDailyData
    ? (candlesDailyData[symbol as keyof typeof candlesDailyData]?.[
        "candles"
      ] as Candles) ?? null
    : null;
}

/**
 * Get the minute candles of a symbol from data.
 */
export function getCandlesMinute(symbol: string): Candles | null {
  return symbol in candlesMinuteData
    ? (candlesMinuteData[symbol as keyof typeof candlesMinuteData]?.[
        "candles"
      ] as Candles) ?? null
    : null;
}

/**
 * Check if all data for a symbol exists.
 */
export function isSymbolComplete(symbol: string) {
  for (const data of Object.values(fileDataPairs)) {
    if (!(symbol in data)) {
      return false;
    }
  }
  return true;
}

/**
 * Remove all data from symbols that are not in data/stocks.json.
 */
export function removeUnusedSymbols() {
  for (const [filename, data] of Object.entries(fileDataPairs)) {
    Object.keys(data).forEach((key) => {
      if (!stocks.topStocks || !(stocks.topStocks as string[]).includes(key)) {
        delete data[key as keyof typeof data];
      }
    });

    const json = JSON.stringify(data, null, 4);
    fs.writeFileSync(`${DATA_PATH}/${filename}.json`, json);
  }
}
