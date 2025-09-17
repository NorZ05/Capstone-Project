const express = require('express');
const pool = require('../db');
const { detectAnomaly } = require('../services/anomalyService');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM anomalies ORDER BY detected_at DESC LIMIT 100');
    res.json(r.rows);
  } catch (err) {
    console.error('anomalies list error:', err.message || err);
    res.json([{ id: 1, event_id: null, metric: 'sales', score: 3.2, details: {}, detected_at: new Date() }]);
  }
});

// Live detection endpoint: GET /api/anomalies/detect
// Runs lightweight detection across inventory and sales and returns structured anomalies.
router.get('/detect', async (req, res) => {
  try {
    const persist = req.query.persist === '1';
    const threshold = Number(req.query.threshold) || 15; // default reorder threshold
    const staleDays = Number(req.query.staleDays) || 7;

    const anomalies = [];

    // Inventory checks
    const invR = await pool.query(`
      SELECT p.id as product_id, p.name, i.qty_on_hand, i.last_updated
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
    `);
    for (const row of invR.rows) {
      const name = row.name || `product:${row.product_id}`;
      const qty = row.qty_on_hand == null ? null : Number(row.qty_on_hand);
      const last = row.last_updated;

      if (qty == null) {
        anomalies.push({
          source: 'inventory',
          severity: 'Warning',
          title: 'Missing inventory row',
          description: `No inventory record exists for ${name}`,
          timestamp: new Date().toISOString(),
        });
        continue;
      }

      if (qty <= Math.ceil(threshold / 2)) {
        anomalies.push({ source: 'inventory', severity: 'Critical', title: 'Critical Stock Alert', description: `${name} is critically low (${qty} units remaining, reorder level: ${threshold})`, timestamp: (last || new Date()).toISOString() });
      } else if (qty < threshold) {
        anomalies.push({ source: 'inventory', severity: 'Warning', title: 'Low Stock', description: `${name} is below reorder level (${qty} < ${threshold})`, timestamp: (last || new Date()).toISOString() });
      }

      if (last) {
        const lastDate = new Date(last);
        const ageDays = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > staleDays) {
          anomalies.push({ source: 'inventory', severity: 'Warning', title: 'Stale Inventory Update', description: `${name} inventory not updated for ${Math.round(ageDays)} days`, timestamp: lastDate.toISOString() });
        }
      }
    }

    // POS / Sales checks
    // Missing totals
    const missingTotals = await pool.query(`SELECT id, product_id, qty, total, created_at FROM sales WHERE total IS NULL OR total <= 0 ORDER BY created_at DESC LIMIT 50`);
    for (const r of missingTotals.rows) {
      anomalies.push({ source: 'POS', severity: 'Warning', title: 'Missing Sale Total', description: `Sale id=${r.id} has missing or zero total (qty=${r.qty})`, timestamp: (r.created_at || new Date()).toISOString() });
    }

    // Duplicate product sales at same timestamp (possible duplicate transaction)
    const dupR = await pool.query(`
      SELECT product_id, created_at, COUNT(*) as cnt
      FROM sales
      GROUP BY product_id, created_at
      HAVING COUNT(*) > 1
      ORDER BY cnt::int DESC
      LIMIT 50
    `);
    for (const r of dupR.rows) {
      anomalies.push({ source: 'POS', severity: 'Warning', title: 'Possible Duplicate Sales', description: `Product ${r.product_id} has ${r.cnt} sales with identical timestamp ${r.created_at}` , timestamp: new Date().toISOString() });
    }

    // Large spike check: compare last 7 days vs previous 7 days
    const spikeR = await pool.query(`
      SELECT
        (SELECT COALESCE(SUM(total),0) FROM sales WHERE created_at >= now() - interval '7 days') as recent,
        (SELECT COALESCE(SUM(total),0) FROM sales WHERE created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days') as previous
    `);
    const recent = Number(spikeR.rows[0].recent || 0);
    const previous = Number(spikeR.rows[0].previous || 0);
    if (previous > 0 && recent / previous >= 1.5) {
      anomalies.push({ source: 'POS', severity: 'Warning', title: 'Unusual Sales Pattern', description: `Sales increased by ${Math.round(((recent / previous) - 1) * 100)}% compared to previous week`, timestamp: new Date().toISOString() });
    }

    // Optionally persist detected anomalies into anomalies table
    if (persist && anomalies.length) {
      for (const a of anomalies) {
        try {
          const metric = `${a.source}:${a.title}`;
          const score = a.severity === 'Critical' ? 3 : a.severity === 'Warning' ? 2 : 1;
          await pool.query('INSERT INTO anomalies(metric, score, details, detected_at) VALUES($1,$2,$3,$4)', [metric, score, JSON.stringify({ description: a.description, source: a.source }), a.timestamp || new Date().toISOString()]);
        } catch (e) {
          console.error('persist anomaly error', e.message || e);
        }
      }
    }

    res.json(anomalies);
  } catch (err) {
    console.error('detect anomalies error:', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

// Accept analytic event and run detector; persist event and anomaly if any
router.post('/ingest', async (req, res) => {
  const { source, metric, value, payload } = req.body;
  try {
    const er = await pool.query('INSERT INTO analytics_events(source, metric, value, payload) VALUES($1,$2,$3,$4) RETURNING id, created_at', [source, metric, value, payload || null]);
    const eventId = er.rows[0].id;
    const detected = detectAnomaly({ source, metric, value });
    if (detected.isAnomaly) {
      await pool.query('INSERT INTO anomalies(event_id, metric, score, details) VALUES($1,$2,$3,$4)', [eventId, detected.metric, detected.score, JSON.stringify({ details: detected.details })]);
    }
    res.json({ eventId, anomaly: detected.isAnomaly ? detected : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// mark an anomaly resolved
router.put('/:id/resolve', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  try {
    const r = await pool.query('UPDATE anomalies SET resolved_at = now() WHERE id = $1 RETURNING *', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('resolve anomaly error', err.message || err);
    res.status(500).json({ error: 'db error' });
  }
});

// undo resolve (clear resolved_at)
router.put('/:id/unresolve', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  try {
    const r = await pool.query('UPDATE anomalies SET resolved_at = NULL WHERE id = $1 RETURNING *', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('unresolve anomaly error', err.message || err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
