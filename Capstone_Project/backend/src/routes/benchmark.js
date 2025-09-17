const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../db');

// Utility: random helpers
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Generate simulated dataset for 2023-2024
function generateDataset(startDate, endDate) {
  const items = [
    { id: 1, name: 'Cement Bag 40kg' },
    { id: 2, name: 'Rebar 10mm' },
    { id: 3, name: 'Gravel 1m3' },
    { id: 4, name: 'Plywood 8ft' },
    { id: 5, name: 'Asphalt 50kg' },
    { id: 6, name: 'Hollow Block' }
  ];

  const records = [];
  const start = startDate ? new Date(startDate) : new Date('2023-01-01');
  const end = endDate ? new Date(endDate) : new Date('2024-12-31');

  let txCounter = 100000;

  // helper to add transaction
  function addTx(d, item, qty) {
    const txId = `TX${txCounter++}`;
    records.push({ itemID: item.id, itemName: item.name, quantitySold: qty, stockLevel: null, transactionDate: d.toISOString(), transactionID: txId, adjustmentType: 'sale' });
    return txId;
  }

  // Seed initial stock
  const stock = {};
  for (const it of items) stock[it.id] = 500 + rndInt(0, 500);

  // simulate daily activity
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const month = d.getMonth() + 1;
    // determine demand factor
    let demandFactor = 0.1; // base
    if ((month >=3 && month <=6) || (month >=9 && month <=11)) demandFactor += 0.6; // building months
    if ((month >=1 && month <=2) || (month >=7 && month <=8)) demandFactor += 0.4; // road months

    // choose top sellers more often
    for (const it of items) {
      const baseProb = it.id <= 3 ? 0.5 : 0.2; // first 3 are top sellers
      if (Math.random() < baseProb * demandFactor) {
        const qty = rndInt(1, it.id <= 3 ? 20 : 6);
        const txId = addTx(new Date(d), it, qty);
        stock[it.id] = Math.max(0, stock[it.id] - qty);
      }
    }

    // random stock adjustments (restock) monthly
    if (d.getDate() === 1 && Math.random() < 0.7) {
      for (const it of items) {
        const add = rndInt(50, 300);
        stock[it.id] += add;
        records.push({ itemID: it.id, itemName: it.name, quantitySold: null, stockLevel: stock[it.id], transactionDate: new Date(d).toISOString(), transactionID: `ADJ${txCounter++}`, adjustmentType: 'restock' });
      }
    }
  }

  // Inject intentional anomalies
  // Duplicate transaction IDs
  if (records.length > 200) {
    const a = records[rndInt(0, records.length - 1)];
    records.push({ ...a, transactionID: a.transactionID, transactionDate: new Date(a.transactionDate).toISOString(), adjustmentType: a.adjustmentType });
  }

  // Stock adjustments without matching transactions
  records.push({ itemID: 2, itemName: 'Rebar 10mm', quantitySold: null, stockLevel: 9999, transactionDate: new Date('2024-03-15').toISOString(), transactionID: `ADJX${txCounter++}`, adjustmentType: 'restock' });

  // Stock levels below reorder point without restocking
  records.push({ itemID: 5, itemName: 'Asphalt 50kg', quantitySold: null, stockLevel: 2, transactionDate: new Date('2024-09-10').toISOString(), transactionID: `ADJX${txCounter++}`, adjustmentType: 'manual' });

  // Mismatched totals (simulate sales but stock unchanged)
  // pick an earlier sale and add a sale record without decrementing stock
  const mis = records.find(r => r.adjustmentType === 'sale');
  if (mis) {
    records.push({ itemID: mis.itemID, itemName: mis.itemName, quantitySold: mis.quantitySold, stockLevel: null, transactionDate: new Date(mis.transactionDate).toISOString(), transactionID: `TX_DUP${txCounter++}`, adjustmentType: 'sale' });
  }

  return { items, records };
}

// Detection rules
function runDetection(dataset, opts = {}) {
  const anomalies = [];
  const byTx = new Map();
  const txTimes = new Map(); // map txId -> timestamps[] for window detection
  const stockByItem = new Map();

  const dupWindowDays = Number(opts.dupWindowDays || 1); // consider duplicates within N days
  const highSalesThreshold = Number(opts.highSalesThreshold || 1000); // per-item high sales flag
  const reorderPoints = opts.reorderPoints || { /* itemID: reorderPoint */ };

  for (const r of dataset.records) {
    if (r.adjustmentType === 'sale') {
      const key = r.transactionID;
      const ts = new Date(r.transactionDate);

      // track timestamps per tx id
      if (!txTimes.has(key)) txTimes.set(key, []);
      txTimes.get(key).push(ts);

      // duplicate if same tx id occurs within dupWindowDays
      const times = txTimes.get(key);
      if (times.length > 1) {
        // check if any previous time is within window
        const prev = times.slice(0, -1);
        const foundClose = prev.some(p => Math.abs(ts - p) <= dupWindowDays * 24 * 60 * 60 * 1000);
        if (foundClose) {
          anomalies.push({ source: 'POS', severity: 'Warning', description: `Duplicate transaction ID ${key} for item ${r.itemName} within ${dupWindowDays} days`, timestamp: r.transactionDate });
        } else {
          // duplicate but outside window — lower severity info
          anomalies.push({ source: 'POS', severity: 'Info', description: `Repeated transaction ID ${key} for item ${r.itemName} outside ${dupWindowDays}-day window`, timestamp: r.transactionDate });
        }
      }

      // keep sales totals per item
      const cur = stockByItem.get(r.itemID) || { sold: 0, lastSale: null };
      cur.sold += r.quantitySold || 0;
      cur.lastSale = r.transactionDate;
      stockByItem.set(r.itemID, cur);
    } else if (r.adjustmentType === 'restock' || r.adjustmentType === 'manual') {
      // record restock events (used later for reorder checks)
      const cur = stockByItem.get(r.itemID) || { sold: 0, lastSale: null, restocks: [] };
      cur.restocks = cur.restocks || [];
      cur.restocks.push(new Date(r.transactionDate));
      stockByItem.set(r.itemID, cur);

      // log adjustments as info
      anomalies.push({ source: 'Inventory', severity: 'Info', description: `Stock adjustment for ${r.itemName} (${r.adjustmentType}) at ${r.transactionDate}`, timestamp: r.transactionDate });
    }
  }

  // Low stock without restocking using per-item reorder points (default 15)
  for (const r of dataset.records) {
    if (r.stockLevel != null) {
      const rp = reorderPoints[String(r.itemID)] != null ? Number(reorderPoints[String(r.itemID)]) : 15;
      if (r.stockLevel < rp) {
        const recDate = new Date(r.transactionDate);
        const restockWithin = dataset.records.some(x => x.itemID === r.itemID && (x.adjustmentType === 'restock' || x.adjustmentType === 'manual') && (new Date(x.transactionDate) > recDate) && ((new Date(x.transactionDate) - recDate) / (1000*60*60*24) <= 30));
        if (!restockWithin) {
          anomalies.push({ source: 'Inventory', severity: 'Critical', description: `Low stock for ${r.itemName} (${r.stockLevel}) below reorder point ${rp} without restock within 30 days`, timestamp: r.transactionDate });
        }
      }
    }
  }

  // Mismatched inventory vs sales: high sales volumes per-item threshold
  for (const [itemID, stats] of stockByItem.entries()) {
    if (stats.sold > highSalesThreshold) {
      anomalies.push({ source: 'POS', severity: 'Warning', description: `High sales volume for item ${itemID}: ${stats.sold} units (threshold ${highSalesThreshold})`, timestamp: stats.lastSale });
    }
  }

  return anomalies;
}

router.get('/', (req, res) => {
  res.json({ message: 'benchmark route: use /api/benchmark/run' });
});

router.get('/run', async (req, res) => {
  // Guard: require secret header in production or when BENCHMARK_SECRET is configured
  const secret = process.env.BENCHMARK_SECRET;
  if (process.env.NODE_ENV === 'production' || secret) {
    const provided = req.headers['x-benchmark-secret'];
    if (!provided || (secret && provided !== secret)) {
      return res.status(403).json({ error: 'Forbidden: benchmark run is protected' });
    }
  }
  try {
    const start = Date.now();
    const startDate = req.query.startDate; // e.g. '2023-01-01'
    const endDate = req.query.endDate; // e.g. '2025-09-16'
    const dataset = generateDataset(startDate, endDate);

    // parse options from query
    const dupWindowDays = req.query.dupWindowDays ? Number(req.query.dupWindowDays) : undefined;
    const highSalesThreshold = req.query.highSalesThreshold ? Number(req.query.highSalesThreshold) : undefined;
    let reorderPoints = undefined;
    if (req.query.reorderPoints) {
      try {
        reorderPoints = JSON.parse(req.query.reorderPoints);
      } catch (e) {
        // ignore parse error
      }
    }
    const persist = req.query.persist === '1';

    const opts = { dupWindowDays, highSalesThreshold, reorderPoints };
    const anomalies = runDetection(dataset, opts);
    const durationMs = Date.now() - start;

    const out = { metrics: { totalRecords: dataset.records.length, anomaliesFound: anomalies.length, durationMs }, anomalies };

    // persist results JSON
    const outPath = path.join(__dirname, '..', 'data', 'simulated_benchmark_results.json');
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');

    // optionally persist dataset for debugging
    try {
      const dsPath = path.join(__dirname, '..', 'data', 'simulated_dataset.json');
      fs.writeFileSync(dsPath, JSON.stringify(dataset, null, 2), 'utf8');
    } catch (e) {
      // ignore
    }

    // optionally persist anomalies into anomalies table so DAD UI will show them
    if (persist && anomalies.length) {
      for (const a of anomalies) {
        try {
          const metric = `${a.source}:${a.severity}`;
          const score = a.severity === 'Critical' ? 3 : a.severity === 'Warning' ? 2 : 1;
          await pool.query('INSERT INTO anomalies(metric, score, details, detected_at) VALUES($1,$2,$3,$4)', [metric, score, JSON.stringify({ description: a.description, source: a.source }), a.timestamp || new Date().toISOString()]);
        } catch (e) {
          console.error('persist anomaly error', e.message || e);
        }
      }
    }

    res.json(out);
  } catch (err) {
    console.error('benchmark run error', err.message || err);
    res.status(500).json({ error: String(err) });
  }
});

module.exports = router;
