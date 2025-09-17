const express = require('express');
const pool = require('../db');
const router = express.Router();

// ingest analytic event
router.post('/event', async (req, res) => {
  const { source, metric, value, payload } = req.body;
  try {
    const r = await pool.query('INSERT INTO analytics_events(source, metric, value, payload) VALUES($1,$2,$3,$4) RETURNING id', [source, metric, value, payload || null]);
    res.status(201).json({ id: r.rows[0].id });
  } catch (err) {
    console.error(err);
  console.error('analytics ingest error:', err.message || err);
  // fallback: return a generated id
  res.status(201).json({ id: Math.floor(Math.random() * 1000000), warning: 'db unavailable, event not persisted' });
  }
});

// simple transactions/analytics listing for reports
router.get('/transactions', async (req, res) => {
  try {
    const r = await pool.query('SELECT id, source, metric, value, payload, created_at FROM analytics_events ORDER BY created_at DESC LIMIT 200');
    res.json(r.rows.map(x => ({ id: x.id, source: x.source, metric: x.metric, value: x.value, payload: x.payload, date: x.created_at })));
  } catch (err) {
    console.error('analytics list error:', err.message || err);
    res.json([]);
  }
});

// GET /sales-trends -> monthly sales totals for the last N months (default 12)
router.get('/sales-trends', async (req, res) => {
  try {
    const months = Math.min(36, Math.max(3, Number(req.query.months) || 12));
    const r = await pool.query(`
      SELECT to_char(created_at, 'YYYY-MM') as month, COALESCE(SUM(total),0) as total
      FROM sales
      WHERE created_at >= (date_trunc('month', now()) - ($1::int - 1) * interval '1 month')
      GROUP BY month
      ORDER BY month ASC
    `, [months]);
    res.json({ months: r.rows.map(x => x.month), totals: r.rows.map(x => parseFloat(x.total)) });
  } catch (err) {
    console.error('sales-trends error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /inventory-movement -> aggregate movement per product over time (using sales as outflow)
router.get('/inventory-movement', async (req, res) => {
  try {
    const days = Math.min(365, Math.max(7, Number(req.query.days) || 90));
    const r = await pool.query(`
      SELECT p.id as product_id, p.name as item, to_char(s.created_at::date, 'YYYY-MM-DD') as day, COALESCE(SUM(s.qty),0) as out_qty
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      WHERE s.created_at >= now() - ($1::int * interval '1 day')
      GROUP BY p.id, p.name, day
      ORDER BY p.id, day ASC
    `, [days]);

    // pivot results into per-product series
    const map = new Map();
    const daysSet = new Set();
    for (const row of r.rows) {
      daysSet.add(row.day);
      const key = row.product_id;
      if (!map.has(key)) map.set(key, { product_id: row.product_id, item: row.item, series: {} });
      map.get(key).series[row.day] = Number(row.out_qty);
    }
    const daysArr = Array.from(daysSet).sort();
    const products = Array.from(map.values()).map(p => ({ product_id: p.product_id, item: p.item, data: daysArr.map(d => p.series[d] || 0) }));
    res.json({ days: daysArr, products });
  } catch (err) {
    console.error('inventory-movement error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /reports -> returns structured report rows (date, item, qty, revenue, status)
router.get('/reports', async (req, res) => {
  try {
    const limit = Math.min(2000, Math.max(50, Number(req.query.limit) || 500));
    const r = await pool.query(`
      SELECT s.id, s.created_at as date, p.name as item, s.qty, s.total, 'Completed' as status
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      ORDER BY s.created_at DESC
      LIMIT $1
    `, [limit]);
    const rows = r.rows.map(r => ({ id: r.id, date: r.date, item: r.item, qty: Number(r.qty), revenue: parseFloat(r.total), status: r.status }));
    res.json({ rows });
  } catch (err) {
    console.error('reports error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// GET /forecast -> placeholder forecast data
router.get('/forecast', async (req, res) => {
  try {
    // Placeholder: simple projection using last 3 months avg
    const r = await pool.query(`SELECT to_char(created_at, 'YYYY-MM') as month, COALESCE(SUM(total),0) as total FROM sales WHERE created_at >= now() - interval '6 months' GROUP BY month ORDER BY month DESC LIMIT 6`);
    const recent = r.rows.map(x => parseFloat(x.total));
    const avg = recent.length ? recent.reduce((s,a)=>s+a,0)/recent.length : 0;
    const months = 6;
    const forecast = Array.from({length: months}, (_,i) => Math.round(avg * (1 + (i+1)*0.02)) );
    res.json({ recent, forecast });
  } catch (err) {
    console.error('forecast error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
