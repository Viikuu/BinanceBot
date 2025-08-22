import { Router } from "express";
import { analizeTrades, fetchTrades } from "../binance";
import { DateTime } from "luxon";

const TradesRouter = Router();

TradesRouter.get('/fetch-trades', async (req, res) => {
  const { symbol, startTime, endTime } = req.query;

  if (typeof symbol !== 'string' || typeof startTime !== 'string' || typeof endTime !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameters. Required: symbol, dateFrom, dateTo' });
  }
  const startTimeIso = DateTime.fromISO(startTime);
  const endTimeIso = DateTime.fromISO(endTime);

  if (!startTimeIso.isValid || !endTimeIso.isValid) {
    return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 format.' });
  }
  if (endTimeIso <= startTimeIso) {
    return res.status(400).json({ error: 'Invalid date range. dateTo must be after dateFrom.' });
  }

  const data = await fetchTrades(symbol, startTimeIso.toMillis(), endTimeIso.toMillis());

  const tradesAnalyzis = analizeTrades(data);

  res.json({ status: 'ok', tradesAnalyzis })
});

export default TradesRouter;