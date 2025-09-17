const express = require('express');
const { detectAnomaly, listAlerts } = require('../services/anomalyService');
const router = express.Router();

router.post('/', (req, res) => {
  const evt = req.body;
  if (!evt || typeof evt.value === 'undefined') return res.status(400).send({ error: 'value required' });
  const alert = detectAnomaly(evt);
  // persist anomaly if flagged
  if (alert.isAnomaly) {
    try {
      const pool = require('../db');
      (async () => {
        const r = await pool.query('INSERT INTO analytics_events(source, metric, value, payload) VALUES($1,$2,$3,$4) RETURNING id', [evt.source || null, evt.metric || null, evt.value, evt.payload || null]);
        const eventId = r.rows[0].id;
        await pool.query('INSERT INTO anomalies(event_id, metric, score, details) VALUES($1,$2,$3,$4)', [eventId, alert.metric, alert.score, { details: alert.details }]);
      })();
    } catch (e) {
      console.error('persist anomaly error', e.message || e);
    }
  }
  res.status(201).json(alert);
});

router.get('/', (req, res) => res.json(listAlerts()));

module.exports = router;
