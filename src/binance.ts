import axios from "axios";
import { env } from "process";


const api = axios.create({
  baseURL: env.BINANCE_API_URL,
  timeout: 10000,
});

export const fetchTrades = async (symbol: string, startTimeISO: string, endTimeISO: string) => {
  try {
    const parsedSymbol = symbol.toUpperCase();
    const { data } = await api.get('/api/v3/aggTrades', {
      params: {
        symbol: parsedSymbol,
        startTime: new Date(startTimeISO).getTime(),
        endTime: new Date(endTimeISO).getTime(),
        limit: 1000,
      }
    });

    console.log(`Fetched ${data.length} trades for ${parsedSymbol} from ${startTimeISO} to ${endTimeISO}, data:`, data);

    return data;

  } catch (error) {
    console.error('Error fetching trades from Binance:', error);
    throw error;
  }
}