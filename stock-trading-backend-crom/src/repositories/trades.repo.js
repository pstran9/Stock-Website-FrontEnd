import { pool } from "../db/pool.js";

export async function getPortfolio(userId) {
  const [rows] = await pool.query(
    `SELECT s.ticker, s.name, p.shares
     FROM positions p
     JOIN stocks s ON s.id = p.stock_id
     WHERE p.user_id = :userId
     ORDER BY s.ticker`,
    { userId }
  );
  return rows;
}

export async function listTransactions(userId, limit = 50) {
  const [rows] = await pool.query(
    `SELECT t.id, t.type, s.ticker, t.shares, t.price, t.total_amount, t.created_at
     FROM transactions t
     JOIN stocks s ON s.id = t.stock_id
     WHERE t.user_id = :userId
     ORDER BY t.created_at DESC
     LIMIT :limit`,
    { userId, limit: Number(limit) }
  );
  return rows;
}
