import axios from "axios";
import { env } from "./config";
import { DateTime } from "luxon";
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