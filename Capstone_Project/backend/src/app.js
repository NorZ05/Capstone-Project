const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const anomalyRouter = require('./routes/anomaly');
const inventoryRouter = require('./routes/inventory');
const performanceRouter = require('./routes/performance');
const analyticsRouter = require('./routes/analytics');
const anomaliesRouter = require('./routes/anomalies');
const benchmarkRouter = require('./routes/benchmark');
const reportsRouter = require('./routes/reports');
const dbInit = require('./db/init');

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
const fs = require('fs');
// ensure uploads directory
const uploadsDir = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
// serve uploaded images
app.use('/uploads', express.static(uploadsDir));

app.use('/api/products', productsRouter);
app.use('/api/anomaly', anomalyRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/anomalies', anomaliesRouter);
app.use('/api/benchmark', benchmarkRouter);
app.use('/api/reports', reportsRouter);

console.log('reports router mounted');

// health / root
app.get('/', (req, res) => res.send('MIS backend running. Use /api/* endpoints'));

// Diagnostic: list registered routes (temporary)
app.get('/__routes', (req, res) => {
	try {
		const routes = app._router.stack
			.filter((r) => r.route)
			.map((r) => {
				const methods = Object.keys(r.route.methods).join(',');
				return `${methods.toUpperCase()} ${r.route.path}`;
			});
		res.json({ routes });
	} catch (e) {
		res.status(500).json({ error: String(e) });
	}
});

// optional: trigger DB init (migrations + seed)
app.post('/api/db/init', async (req, res) => {
	try {
				await dbInit.runMigrations();
				await dbInit.seedProducts();
				if (dbInit.seedInventory) await dbInit.seedInventory();
				res.json({ ok: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: String(err) });
	}
});

const port = process.env.PORT || 5000;
// bind to HOST env or 0.0.0.0 so container and host requests (127.0.0.1) work reliably
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => console.log(`Backend listening on ${host}:${port}`));
