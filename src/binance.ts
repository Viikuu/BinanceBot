import axios from "axios";
import { env } from "./config";
import { FetchedTrade, ParsedTrade } from "./types/binance.types";

const api = axios.create({
  baseURL: env.BINANCE_API_URL,
  timeout: 10000,
});

export const fetchTrades = async (symbol: string, startTime: number, endTime: number) => {
  try {
    const parsedSymbol = symbol.toUpperCase();
    const { data } = await api.get<FetchedTrade[]>('/api/v3/aggTrades', {
      params: {
        symbol: parsedSymbol,
        startTime,
        endTime,
        limit: 1000,
      }
    });

    return parseFetchedTrades(data);
  } catch (error) {
    console.error('Error fetching trades from Binance:', error);
    throw error;
  }
}

const parseFetchedTrades = (data: FetchedTrade[]): ParsedTrade[] => {
  return data.map((trade) => ({
    id: trade.a,
    price: parseFloat(trade.p),
    quantity: parseFloat(trade.q),
    firstTradeId: trade.f,
    lastTradeId: trade.l,
    timestamp: trade.T,
    isBuyerMaker: trade.m,
    isBestMatch: trade.M,
  }));
}

const sortTradesByTimestamp = (trades: ParsedTrade[]): ParsedTrade[] => {
  return trades.sort((a, b) => a.timestamp - b.timestamp);
}

const findMinAndMaxTradeValues = (trades: ParsedTrade[]): { minTradeId: number; maxTradeId: number } | null => {
  if (trades.length === 0) return null;

  let minTradeId = trades[0].id;
  let maxTradeId = trades[0].id;

  for (const trade of trades) {
    if (trade.id < minTradeId) minTradeId = trade.id;
    if (trade.id > maxTradeId) maxTradeId = trade.id;
  }

  return { minTradeId, maxTradeId };
}

type TrendDirection = 'increasing' | 'decreasing' | null;

const analizeTrades = (trades: ParsedTrade[]) => {
  const sortedTrades = sortTradesByTimestamp(trades);
  let minValueTrade = trades[0];
  let maxValueTrade = trades[0];


  let lastTrade = trades[0];
  let trend: TrendDirection = null;
  let currentTrend = [trades[0]];
  let changes = [];

  for (const trade of sortedTrades) {
    const currentPrice = trade.price;
    if (currentPrice > lastTrade.price) {
      if (trend === 'decreasing') {
        changes.push({
          startIndex: currentTrend[0].id,
          endIndex: currentTrend[currentTrend.length - 1].id,
          direction: trend,
          length: currentTrend.length,
          startPrice: currentTrend[0].price,
          endPrice: currentTrend[currentTrend.length - 1].price,
          priceChange: currentTrend[currentTrend.length - 1].price - currentTrend[0].price,
          priceChangePercent: ((currentTrend[currentTrend.length - 1].price - currentTrend[0].price) / currentTrend[0].price) * 100,
          trades: currentTrend,
        });
        currentTrend = [];
      }
      trend = 'increasing';
      currentTrend.push(trade);

    } else if (currentPrice < lastTrade.price) {
      if (trend === 'increasing') {
        changes.push({
          startIndex: currentTrend[0].id,
          endIndex: currentTrend[currentTrend.length - 1].id,
          direction: trend,
          length: currentTrend.length,
          startPrice: currentTrend[0].price,
          endPrice: currentTrend[currentTrend.length - 1].price,
          priceChange: currentTrend[currentTrend.length - 1].price - currentTrend[0].price,
          priceChangePercent: ((currentTrend[currentTrend.length - 1].price - currentTrend[0].price) / currentTrend[0].price) * 100,
          trades: currentTrend,
        });
        currentTrend = [];
      }
      trend = 'decreasing';
      currentTrend.push(trade);
    }
    lastTrade = trade;

    if (trade.price < minValueTrade.price) minValueTrade = trade;
    if (trade.price > maxValueTrade.price) maxValueTrade = trade;
  }

  if (currentTrend.length > 0) {
    changes.push({
      startIndex: currentTrend[0].id,
      endIndex: currentTrend[currentTrend.length - 1].id,
      direction: trend,
      length: currentTrend.length,
      startPrice: currentTrend[0].price,
      endPrice: currentTrend[currentTrend.length - 1].price,
      priceChange: currentTrend[currentTrend.length - 1].price - currentTrend[0].price,
      priceChangePercent: ((currentTrend[currentTrend.length - 1].price - currentTrend[0].price) / currentTrend[0].price) * 100,
      trades: currentTrend,
    });
  }

  let startTimeStamp = trades[0].timestamp;
  let endTimeTimestamp = trades[trades.length - 1].timestamp;

  const minAndMaxTradeIds = findMinAndMaxTradeValues(trades);

  return {
    startTimeStamp,
    endTimeTimestamp,
    totalTrades: trades.length,
    minValueTrade,
    maxValueTrade,
    minAndMaxTradeIds,
    changes,
  }
}