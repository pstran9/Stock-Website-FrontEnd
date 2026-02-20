import * as Stocks from "../repositories/stocks.repo.js";
import * as Pricing from "../services/pricing.service.js";

export async function list(req, res, next) {
  try {
    const stocks = await Stocks.listStocks();
    res.json({ stocks });
  } catch (e) { next(e); }
}

export async function get(req, res, next) {
  try {
    const stock = await Stocks.getStockByTicker(req.params.ticker);
    if (!stock) return res.status(404).json({ error: "Not found" });
    res.json({ stock });
  } catch (e) { next(e); }
}

export async function quote(req, res, next) {
  try {
    const quote = await Pricing.getQuote(req.params.ticker);
    res.json({ quote });
  } catch (e) { next(e); }
}

export async function history(req, res, next) {
  try {
    const limit = req.query.limit ?? 120;
    const points = await Pricing.getPriceHistory(req.params.ticker, limit);
    res.json({ ticker: req.params.ticker.toUpperCase(), points });
  } catch (e) { next(e); }
}
