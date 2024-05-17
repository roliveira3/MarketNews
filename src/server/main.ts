import express from "express";
import ViteExpress from "vite-express";

import stocks from "./data/stocks.json";
import { updateData } from "./updateData";
import {
  StockDetails,
  StockMetrics,
  StockOverview,
  Trends,
  UPDATES_ENABLED,
} from "./constants";
import * as dataHandler from "./dataHandler";

// creates the express app do not change
const app = express();

/**
 * Get stock overview for all stocks on landing page.
 *
 * fetch url: /stocks-overview?category=topStocks
 * response: StockOverview[]
 */
app.get("/stocks-overview", async function (req, res) {
  const stocksOverview: StockOverview[] = [];
  if (
    !("category" in req.query) ||
    !((req.query["category"] as string) in stocks)
  ) {
    res.status(404).json({ message: "Missing category" });
    return;
  }

  const category = req.query["category"] as keyof typeof stocks;
  for (const symbol of stocks[category]) {
    let name: string | null = null;
    let price: number | null = null;
    let metrics: StockMetrics | null = null;
    let tries = 0;
    while (
      tries < 10 &&
      (!dataHandler.isSymbolComplete(symbol) ||
        name === null ||
        price === null ||
        metrics === null)
    ) {
      // Ignore wait time for first try
      if (tries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      name = dataHandler.getName(symbol);
      price = dataHandler.getPrice(symbol);
      metrics = dataHandler.getMetrics(symbol);
      tries++;
    }

    if (
      !dataHandler.isSymbolComplete(symbol) ||
      name === null ||
      price === null ||
      metrics === null
    ) {
      continue;
    }

    stocksOverview.push({
      name: name!,
      symbol: symbol,
      price: price!,
      last24h: metrics["last24h"] ?? 0,
      last7d: metrics["last7d"] ?? 0,
      last30d: metrics["last30d"] ?? 0,
    });
  }

  res.status(200).json({ message: stocksOverview });
});

/**
 * Get stock details for a specific symbol.
 *
 * fetch url: /stock-details?symbol=AAAA
 * response: StockDetails
 */
app.get("/stock-details", async function (req, res) {
  const symbol = req.query["symbol"] as string;
  let name: string | null = null;
  let price: number | null = null;
  let metrics: StockMetrics | null = null;
  let trends: Trends | null = null;
  name = dataHandler.getName(symbol);
  price = dataHandler.getPrice(symbol);
  metrics = dataHandler.getMetrics(symbol);
  trends = dataHandler.getTrends(symbol);

  if (name === null || price === null || metrics === null || trends === null) {
    res.status(404).json({ message: "Stock could not be found" });
    return;
  }

  const stockDetails: StockDetails = {
    name: name,
    symbol: symbol,
    price: price,
    ...metrics,
    trends: trends,
  };
  res.status(200).json({ message: stockDetails });
});

/**
 * Get daily candles for a specific symbol.
 *
 * fetch url: /candles?symbol=AAAA
 * response: Candles[]
 */
app.get("/candles", async function (req, res) {
  const symbol = req.query["symbol"] as string;
  const candles = dataHandler.getCandlesDaily(symbol);
  if (candles === null) {
    res.status(404).json({ message: "No candles found" });
    return;
  }

  res.status(200).json({ message: candles });
});

/**
 * Get minute candles for a specific symbol.
 *
 * fetch url: /close7d?symbol=AAAA
 * response: number[]
 */
app.get("/close7d", async function (req, res) {
  const symbol = req.query["symbol"] as string;
  const candles = dataHandler.getCandlesMinute(symbol);
  if (candles === null) {
    res.status(404).json({ message: "No candles found" });
    return;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timestamp7d = currentTimestamp - 7 * 24 * 60 * 60;
  const price7d: number[] = [];
  for (let i = 0; i < candles["t"].length; i++) {
    if (timestamp7d < candles["t"][i]!) {
      price7d.push(candles["c"][i] ?? 0);
    }
  }

  res.status(200).json({ message: price7d });
});

/**
 * Get the latest news of a given stock.
 *
 * fetch url: /company-news?symbol=AAAA
 * response: NewsItem[] with length 5
 */
app.get("/company-news", async function (req, res) {
  const symbol = req.query["symbol"] as string;
  const companyNews = dataHandler.getNews(symbol);
  if (companyNews === null) {
    res.status(404).json({ message: "No news found" });
    return;
  }

  res.status(200).json({ message: companyNews });
});

// Do not change below this line
ViteExpress.listen(app, 5173, () =>
  console.log("Server is listening on http://localhost:5173")
);

dataHandler.removeUnusedSymbols();

if (UPDATES_ENABLED) {
  // Initial update
  updateData();

  setInterval(() => {
    updateData();
  }, 10000);
}
