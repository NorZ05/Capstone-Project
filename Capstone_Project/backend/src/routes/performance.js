const express = require('express');
const pool = require('../db');
const router = express.Router();

// Ensure expenses table exists (safe to call repeatedly)
async function ensureExpensesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
}

// Get sales summary with KPIs for dashboard (legacy path)
router.get('/sales-summary', async (req, res) => {
  try {
    // overall revenue
    const revR = await pool.query('SELECT COALESCE(SUM(total),0) as revenue FROM sales');
    const revenue = parseFloat(revR.rows[0].revenue || 0);

    // expenses: approximate as a percentage (placeholder) or could be from purchases table
    const expenses = parseFloat((revenue * 0.6).toFixed(2));
    const netProfit = parseFloat((revenue - expenses).toFixed(2));

    // top selling items
    const topR = await pool.query(`
      SELECT p.id as product_id, p.name, SUM(s.qty) as sold, COALESCE(SUM(s.total),0) as revenue
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 10
    `);
    const topSelling = topR.rows.map(r => ({ product_id: r.product_id, name: r.name, sold: Number(r.sold), revenue: parseFloat(r.revenue) }));

    // recent transactions
    const txR = await pool.query(`
      SELECT s.id, s.product_id, p.name as item, s.qty, s.total, s.created_at as date
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      ORDER BY s.created_at DESC
      LIMIT 50
    `);
    const transactions = txR.rows.map(r => ({ id: r.id, product_id: r.product_id, item: r.item, qty: Number(r.qty), total: parseFloat(r.total), date: r.date }));

    // revenue trend last 14 days (group by day)
    const trendR = await pool.query(`
      SELECT to_char(created_at::date, 'YYYY-MM-DD') as day, COALESCE(SUM(total),0) as total
      FROM sales
      WHERE created_at >= now() - interval '14 days'
      GROUP BY day
      ORDER BY day ASC
    `);
    const revenueTrend = trendR.rows.map(r => Number(r.total));

    res.json({ revenue, expenses, netProfit, topSelling, transactions, revenueTrend });
  } catch (err) {
    console.error('performance db error:', err.message || err);
    // fallback sample
    res.json({ revenue: 225000, expenses: 150000, netProfit: 75000, topSelling: [], transactions: [], revenueTrend: [] });
  }
});

// New: GET /summary - compact KPIs
router.get('/summary', async (req, res) => {
  try {
    const revR = await pool.query("SELECT COALESCE(SUM(total),0) as revenue FROM sales");
    const revenue = parseFloat(revR.rows[0].revenue || 0);
    // compute real expenses from expenses table when available
    try {
      await ensureExpensesTable();
      const expR = await pool.query("SELECT COALESCE(SUM(amount),0) as total FROM expenses");
      const expenses = parseFloat(expR.rows[0].total || 0);
      const netProfit = parseFloat((revenue - expenses).toFixed(2));
      return res.json({ revenue, expenses, netProfit });
    } catch (e) {
      // fallback to heuristic
      console.error('summary expenses read error', e.message || e);
    }
    const expenses = parseFloat((revenue * 0.6).toFixed(2));
    const netProfit = parseFloat((revenue - expenses).toFixed(2));
    res.json({ revenue, expenses, netProfit });
  } catch (err) {
    console.error('performance summary error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// Expenses CRUD
// GET /performance/expenses?category=&start=&end=
router.get('/expenses', async (req, res) => {
  try {
    await ensureExpensesTable();
    const params = [];
    const where = [];
    if (req.query.category) { params.push(req.query.category); where.push(`category = $${params.length}`); }
    if (req.query.start) { params.push(req.query.start); where.push(`date::date >= $${params.length}`); }
    if (req.query.end) { params.push(req.query.end); where.push(`date::date <= $${params.length}`); }
    const q = `SELECT id, category, amount::float as amount, date, notes, created_at FROM expenses ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY date DESC LIMIT 2000`;
    const r = await pool.query(q, params);
    res.json({ expenses: r.rows });
  } catch (e) {
    console.error('get expenses error', e.message || e);
    res.status(500).json({ error: String(e) });
  }
});

// POST /performance/expenses { category, amount, date, notes }
router.post('/expenses', async (req, res) => {
  try {
    await ensureExpensesTable();
    const { category, amount, date, notes } = req.body;
    if (!category || !amount || isNaN(Number(amount))) return res.status(400).json({ error: 'invalid payload' });
    const dt = date ? new Date(date) : new Date();
    const r = await pool.query('INSERT INTO expenses(category, amount, date, notes) VALUES($1,$2,$3,$4) RETURNING id, category, amount::float as amount, date, notes, created_at', [category, Number(amount), dt.toISOString(), notes || null]);
    res.json({ expense: r.rows[0] });
  } catch (e) {
    console.error('create expense error', e.message || e);
    res.status(500).json({ error: String(e) });
  }
});

// PUT /performance/expenses/:id
router.put('/expenses/:id', async (req, res) => {
  try {
    await ensureExpensesTable();
    const id = Number(req.params.id);
    const { category, amount, date, notes } = req.body;
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const dt = date ? new Date(date) : new Date();
    const r = await pool.query('UPDATE expenses SET category=$1, amount=$2, date=$3, notes=$4 WHERE id=$5 RETURNING id, category, amount::float as amount, date, notes, created_at', [category, Number(amount), dt.toISOString(), notes || null, id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ expense: r.rows[0] });
  } catch (e) {
    console.error('update expense error', e.message || e);
    res.status(500).json({ error: String(e) });
  }
});

// DELETE /performance/expenses/:id
router.delete('/expenses/:id', async (req, res) => {
  try {
    await ensureExpensesTable();
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const r = await pool.query('DELETE FROM expenses WHERE id=$1 RETURNING id', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error('delete expense error', e.message || e);
    res.status(500).json({ error: String(e) });
  }
});

// Profit trend: weekly or monthly net profit
// GET /performance/profit-trend?period=weekly|monthly
router.get('/profit-trend', async (req, res) => {
  try {
    const period = (req.query.period || 'monthly');
    // revenue grouped
    let revenueQ;
    if (period === 'weekly') {
      revenueQ = `
        SELECT to_char(date_trunc('week', created_at), 'IYYY-IW') as period, COALESCE(SUM(total),0) as revenue
        FROM sales
        GROUP BY period
        ORDER BY period ASC
        LIMIT 104
      `;
    } else {
      revenueQ = `
        SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') as period, COALESCE(SUM(total),0) as revenue
        FROM sales
        GROUP BY period
        ORDER BY period ASC
        LIMIT 60
      `;
    }
    const revR = await pool.query(revenueQ);
    await ensureExpensesTable();
    let expenseQ;
    if (period === 'weekly') {
      expenseQ = `SELECT to_char(date_trunc('week', date), 'IYYY-IW') as period, COALESCE(SUM(amount),0) as expense FROM expenses GROUP BY period ORDER BY period ASC LIMIT 104`;
    } else {
      expenseQ = `SELECT to_char(date_trunc('month', date), 'YYYY-MM') as period, COALESCE(SUM(amount),0) as expense FROM expenses GROUP BY period ORDER BY period ASC LIMIT 60`;
    }
    const expR = await pool.query(expenseQ);
    // merge by period
    const mapExp = {};
    expR.rows.forEach(r => { mapExp[r.period] = Number(r.expense || 0); });
    const trend = revR.rows.map(r => ({ period: r.period, revenue: Number(r.revenue || 0), expense: mapExp[r.period] || 0, net: Number(r.revenue || 0) - (mapExp[r.period] || 0) }));
    res.json({ period, trend });
  } catch (e) {
    console.error('profit-trend error', e.message || e);
    res.status(500).json({ error: String(e) });
  }
});

// New: GET /top-selling - returns list of top-selling items
router.get('/top-selling', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT p.id as product_id, p.name as item, COALESCE(SUM(s.qty),0) as sold, COALESCE(SUM(s.total),0) as revenue
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 100
    `);
    const rows = r.rows.map(x => ({ product_id: x.product_id, item: x.item, sold: Number(x.sold), revenue: parseFloat(x.revenue) }));
    res.json({ topSelling: rows });
  } catch (err) {
    console.error('top-selling error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// New: GET /transactions - recent transaction logs (paginated via ?limit=)
router.get('/transactions', async (req, res) => {
  try {
    const limit = Math.min(1000, Math.max(10, Number(req.query.limit) || 100));
    const r = await pool.query(`
      SELECT s.id, s.product_id, p.name as item, s.qty, s.total, s.created_at as date
      FROM sales s
      LEFT JOIN products p ON p.id = s.product_id
      ORDER BY s.created_at DESC
      LIMIT $1
    `, [limit]);
    const rows = r.rows.map(r => ({ id: r.id, product_id: r.product_id, item: r.item, qty: Number(r.qty), total: parseFloat(r.total), date: r.date }));
    res.json({ transactions: rows });
  } catch (err) {
    console.error('transactions error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// New: GET /pos-health - returns a simple health summary for POS systems
router.get('/pos-health', async (req, res) => {
  try {
    // look for recent analytics events from POS sources
    const r = await pool.query(`SELECT MAX(created_at) as last_event, COUNT(*) FILTER (WHERE created_at >= now() - interval '24 hours') as events_24h FROM analytics_events WHERE source ILIKE 'POS%'
    `);
    const lastEvent = r.rows[0].last_event;
    const events24 = Number(r.rows[0].events_24h || 0);

    let status = 'No data';
    if (lastEvent) {
      // if last event older than 10 minutes consider delayed
      const delayedR = await pool.query(`SELECT (now() - $1::timestamp) > interval '10 minutes' as delayed`, [lastEvent]);
      const delayed = delayedR.rows[0] && delayedR.rows[0].delayed;
      status = delayed ? 'Delayed sync' : 'No issues';
    }

    // count recent anomalies
    const a = await pool.query(`SELECT COUNT(*) as recent_anoms FROM anomalies WHERE detected_at >= now() - interval '24 hours'`);
    const recentAnoms = Number(a.rows[0].recent_anoms || 0);

    res.json({ status, lastEvent, events24, recentAnoms });
  } catch (err) {
    console.error('pos-health error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// POST record a sale (body: product_id, qty, total)
router.post('/record-sale', async (req, res) => {
  const { product_id, qty, total } = req.body;
  try {
    // perform insert sale + inventory update in a transaction to ensure consistency
    await pool.query('BEGIN');

    // lock the inventory row for this product (if exists)
    const invR = await pool.query('SELECT qty_on_hand FROM inventory WHERE product_id = $1 FOR UPDATE', [product_id]);
    if (invR.rows.length) {
      const current = Number(invR.rows[0].qty_on_hand || 0);
      if (current < qty) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ ok: false, error: 'insufficient stock', available: current });
      }
      // enough stock: insert sale then decrement
      await pool.query('INSERT INTO sales(product_id, qty, total) VALUES($1,$2,$3)', [product_id, qty, total]);
      await pool.query('UPDATE inventory SET qty_on_hand = qty_on_hand - $1, last_updated = now() WHERE product_id = $2', [qty, product_id]);
    } else {
      // no inventory row exists, treat missing as zero available => reject
      await pool.query('ROLLBACK');
      return res.status(400).json({ ok: false, error: 'insufficient stock', available: 0 });
    }

    await pool.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    try {
      await pool.query('ROLLBACK');
    } catch (e) {
      /* ignore rollback errors */
    }
    console.error('performance record error:', err.message || err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

module.exports = router;
