const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/reports/sales?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/sales', async (req, res) => {
  try {
    const start = req.query.start || null;
    const end = req.query.end || null;
    const params = [];
    let where = '';
    if (start && end) {
      where = 'WHERE created_at::date BETWEEN $1 AND $2';
      params.push(start, end);
    }

    const q = `
      SELECT created_at::date as date, SUM(total) as revenue, COUNT(*) as transactions
      FROM sales
      ${where}
      GROUP BY date
      ORDER BY date ASC
      LIMIT 1000
    `;
    const r = await pool.query(q, params);
    res.json(r.rows.map((row) => ({ date: row.date, revenue: Number(row.revenue || 0), transactions: Number(row.transactions || 0) })));
  } catch (err) {
    console.error('reports sales error', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/reports/inventory
router.get('/inventory', async (req, res) => {
  try {
    const q = `
      SELECT p.id as product_id, p.name, COALESCE(i.qty_on_hand,0) as qty_on_hand, COALESCE(i.last_updated, NOW()) as last_updated
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      ORDER BY p.name
      LIMIT 1000
    `;
    const r = await pool.query(q);
    res.json(r.rows.map((row) => ({ product_id: row.product_id, name: row.name, qty_on_hand: Number(row.qty_on_hand || 0), last_updated: row.last_updated })));
  } catch (err) {
    console.error('reports inventory error', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/reports/anomalies?start=&end=
router.get('/anomalies', async (req, res) => {
  try {
    const start = req.query.start || null;
    const end = req.query.end || null;
    const params = [];
    let where = '';
    if (start && end) {
      where = 'WHERE detected_at::date BETWEEN $1 AND $2';
      params.push(start, end);
    }
    const q = `SELECT id, metric, score, details, detected_at, resolved_at FROM anomalies ${where} ORDER BY detected_at DESC LIMIT 1000`;
    const r = await pool.query(q, params);
    res.json(r.rows.map((row) => ({ id: row.id, metric: row.metric, score: row.score, details: row.details, detected_at: row.detected_at, resolved_at: row.resolved_at })));
  } catch (err) {
    console.error('reports anomalies error', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/reports/performance?start=&end=
router.get('/performance', async (req, res) => {
  try {
    const start = req.query.start || null;
    const end = req.query.end || null;
    const params = [];
    let where = '';
    if (start && end) {
      where = 'WHERE bp.date::date BETWEEN $1 AND $2';
      params.push(start, end);
    }

    // Assume there's a business_performance table or view with date,revenue,expenses
    const q = `
      SELECT bp.date::date as date, COALESCE(bp.revenue,0) as revenue, COALESCE(bp.expenses,0) as expenses, (COALESCE(bp.revenue,0)-COALESCE(bp.expenses,0)) as net
      FROM business_performance bp
      ${where}
      ORDER BY date ASC
      LIMIT 1000
    `;
    const r = await pool.query(q, params);
    res.json(r.rows.map((row) => ({ date: row.date, revenue: Number(row.revenue||0), expenses: Number(row.expenses||0), net: Number(row.net||0) })));
  } catch (err) {
    console.error('reports performance error', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
