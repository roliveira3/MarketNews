import axios, { AxiosError } from "axios";
import {
  Candles,
  NewsItem,
  StockMetricsAPI,
  Trends,
  dateToString,
  DEBUG_MODE,
} from "./constants";

const baseURL = "https://finnhub.io/api/v1";
const apiKey = "cla0kshr01qk1fmloecgcla0kshr01qk1fmloed0";

/**
 * Helper function to fetch data from API.
 * Returns data of a given type T or null.
 */
async function fetchAPIData<T>(
  endpoint: string,
  params: { [key: string]: any }
): Promise<T | null> {
  params["token"] = apiKey;
  try {
    const response = await axios.get(`${baseURL}/${endpoint}`, {
      params: params,
    });
    return (response?.data as T) ?? null;
  } catch (error) {
    if (DEBUG_MODE) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          console.log(
            "API limit reached! Not all stocks were loaded correctly."
          );
        } else {
          console.log("Could not connect to API.");
        }
      }
    }
    return null;
  }
}

/**
 * Get the name of the stock from API.
 * Returns null if no data could be found.
 */
export async function getStockName(symbol: string): Promise<string | null> {
  const responseData = await fetchAPIData<{ name: string }>("stock/profile2", {
    symbol: symbol,
  });
  return responseData?.name ?? null;
}

/**
 * Get stock metrics from API.
 * Returns null if no data could be found.
 */
export async function getStockMetrics(
  symbol: string
): Promise<StockMetricsAPI | null> {
  const responseData = await fetchAPIData<{ metric: StockMetricsAPI }>(
    "stock/metric",
    {
      symbol: symbol,
      metric: "all",
    }
  );
  if (responseData?.metric === undefined) {
    return null;
  }

  const metric: StockMetricsAPI = responseData!.metric;
  return {
    "52WeekLow": metric["52WeekLow"] ?? null,
    "52WeekLowDate": metric["52WeekLowDate"] ?? null,
    "52WeekHigh": metric["52WeekHigh"] ?? null,
    "52WeekHighDate": metric["52WeekHighDate"] ?? null,
    "priceRelativeToS&P50052Week":
      metric["priceRelativeToS&P50052Week"] ?? null,
    marketCapitalization: metric.marketCapitalization ?? null,
    dividendPerShareAnnual: metric.dividendPerShareAnnual ?? null,
    revenuePerShareAnnual: metric.revenuePerShareAnnual ?? null,
  };
}

/**
 * Get candles from API, given the number of days and the resolution.
 * Returns null if no data could be found.
 */
export async function getStockCandles(
  symbol: string,
  days: number,
  resolution: string
): Promise<Candles | null> {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
  const toTimestamp = Math.floor(new Date().getTime() / 1000);

  const responseData = await fetchAPIData<Candles>("stock/candle", {
    symbol: symbol,
    resolution: resolution,
    from: fromTimestamp,
    to: toTimestamp,
  });
  if (responseData === null) {
    return null;
  }

  // Check if response contains candle data
  const requiredProps: (keyof Candles)[] = ["o", "l", "h", "c", "t"];
  let candleLength: number | null = null;
  const returnCandles: Candles = { o: [], l: [], h: [], c: [], t: [] };
  for (const prop of requiredProps) {
    if (!(prop in responseData)) {
      return null;
    }

    // Assure length of all properties is the same
    if (candleLength === null) {
      candleLength = responseData[prop].length;
    } else if (responseData[prop].length !== candleLength) {
      return null;
    }

    returnCandles[prop] = responseData[prop];
  }

  return returnCandles;
}

/**
 * Get trend recommendations from API.
 * Returns null if no data could be found.
 */
export async function getStockTrends(symbol: string): Promise<Trends> {
  const responseData = await fetchAPIData<Trends[]>("stock/recommendation", {
    symbol: symbol,
  });
  if (responseData === null || responseData.length === 0) {
    return {
      strongBuy: 0,
      buy: 0,
      hold: 0,
      sell: 0,
      strongSell: 0,
    };
  }

  const latestTrend = responseData[0] as Trends;
  return {
    strongBuy: latestTrend["strongBuy"],
    buy: latestTrend["buy"],
    hold: latestTrend["hold"],
    sell: latestTrend["sell"],
    strongSell: latestTrend["strongSell"],
  };
}

/**
 * Get company news from API.
 * Returns null if no data could be found.
 */
export async function getStockNews(symbol: string): Promise<NewsItem[] | null> {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const responseData = await fetchAPIData<NewsItem[]>("company-news", {
    symbol: symbol,
    from: dateToString(lastWeek),
    to: dateToString(today),
  });
  if (responseData === null) {
    return null;
  }

  // Assure all properties contain data
  let data: NewsItem[] = responseData.filter(
    (item: NewsItem) =>
      item.headline !== "" &&
      item.summary !== "" &&
      item.image !== "" &&
      item.source !== "" &&
      item.url !== ""
  );
  data = data.length <= 5 ? data : data.slice(0, 5);

  const companyNews: NewsItem[] = data.map((item: NewsItem) => ({
    datetime: item.datetime,
    headline: item.headline,
    summary: item.summary,
    image: item.image,
    source: item.source,
    url: item.url,
  }));

  return companyNews;
}
