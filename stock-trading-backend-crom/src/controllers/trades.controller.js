import { findUserById } from "../repositories/users.repo.js";
import { getPortfolio, listTransactions } from "../repositories/trades.repo.js";
import { executeTrade } from "../services/trading.service.js";

export async function portfolio(req, res, next) {
  try {
    const user = await findUserById(req.user.userId);
    const positions = await getPortfolio(req.user.userId);
    res.json({ cashBalance: Number(user.cash_balance), positions });
  } catch (e) { next(e); }
}

export async function transactions(req, res, next) {
  try {
    const limit = req.query.limit ?? 50;
    const transactions = await listTransactions(req.user.userId, limit);
    res.json({ transactions });
  } catch (e) { next(e); }
}

export async function buy(req, res, next) {
  try {
    const { ticker, shares } = req.validated.body;
    const out = await executeTrade({ userId: req.user.userId, ticker, type: "BUY", shares });
    res.status(201).json(out);
  } catch (e) { next(e); }
}

export async function sell(req, res, next) {
  try {
    const { ticker, shares } = req.validated.body;
    const out = await executeTrade({ userId: req.user.userId, ticker, type: "SELL", shares });
    res.status(201).json(out);
  } catch (e) { next(e); }
}
