import { Router } from "express";
import { fetchTrades } from "../binance";

const router = Router();

router.get('/fetch-trades', async (req, res) => {
  const { symbol, startTime, endTime } = req.query;

  if (typeof symbol !== 'string' || typeof startTime !== 'string' || typeof endTime !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameters. Required: symbol, dateFrom, dateTo' });
  }
  const data = await fetchTrades(symbol, startTime, endTime);

  res.json({ status: 'ok', data })
});

export default router