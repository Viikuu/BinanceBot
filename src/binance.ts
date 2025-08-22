import axios from "axios";
import { env } from "./config";
import { DateTime } from "luxon";


const api = axios.create({
  baseURL: env.BINANCE_API_URL,
  timeout: 10000,
});

export const fetchTrades = async (symbol: string, startTime: number, endTime: number) => {
  try {
    const parsedSymbol = symbol.toUpperCase();
    const { data } = await api.get('/api/v3/aggTrades', {
      params: {
        symbol: parsedSymbol,
        startTime,
        endTime,
        limit: 1000,
      }
    });

    console.log(`Fetched ${data.length} trades for ${parsedSymbol} from ${DateTime.fromMillis(startTime).toISODate} to ${DateTime.fromMillis(endTime).toISODate()}, data:`, data);

    return data;

  } catch (error) {
    console.error('Error fetching trades from Binance:', error);
    throw error;
  }
}