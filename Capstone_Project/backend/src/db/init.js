const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function runMigrations() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_init.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migrations applied');
}

async function seedProducts() {
  const p = path.join(__dirname, '..', 'data', 'products_seed.json');
  if (!fs.existsSync(p)) {
    console.log('No products_seed.json found, skipping seed');
    return;
  }
  const products = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const prod of products) {
    await pool.query(
      `INSERT INTO products(id, name, price, category) VALUES($1,$2,$3,$4) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price, category=EXCLUDED.category`,
      [prod.id, prod.name, prod.price, prod.category]
    );
  }
  console.log('Seeded products:', products.length);
}

async function seedInventory() {
  const p = path.join(__dirname, '..', 'data', 'inventory_seed.json');
  if (!fs.existsSync(p)) {
    console.log('No inventory_seed.json found, skipping inventory seed');
    return;
  }
  const inventory = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const item of inventory) {
    // item: { product_id, qty_on_hand, location }
    await pool.query(
      `INSERT INTO inventory(product_id, qty_on_hand, location, last_updated) VALUES($1,$2,$3, now()) ON CONFLICT (product_id) DO UPDATE SET qty_on_hand = EXCLUDED.qty_on_hand, location = EXCLUDED.location, last_updated = now()`,
      [item.product_id, item.qty_on_hand, item.location]
    );
  }
  console.log('Seeded inventory:', inventory.length);
}

async function seedSales() {
  const p = path.join(__dirname, '..', 'data', 'sales_seed.json');
  if (!fs.existsSync(p)) {
    console.log('No sales_seed.json found, skipping sales seed');
    return;
  }
  const sales = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const s of sales) {
    try {
      await pool.query(
        `INSERT INTO sales(product_id, qty, total, created_at) VALUES($1,$2,$3,$4)`,
        [s.product_id, s.qty, s.total, s.created_at || new Date().toISOString()]
      );
    } catch (err) {
      // ignore dupes or errors
    }
  }
  console.log('Seeded sales:', sales.length);
}

async function seedAnalytics() {
  const p = path.join(__dirname, '..', 'data', 'analytics_seed.json');
  if (!fs.existsSync(p)) {
    console.log('No analytics_seed.json found, skipping analytics seed');
    return;
  }
  const events = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const e of events) {
    try {
      await pool.query('INSERT INTO analytics_events(source, metric, value, payload, created_at) VALUES($1,$2,$3,$4,$5)', [e.source, e.metric, e.value, e.payload || null, e.created_at || new Date().toISOString()]);
    } catch (err) {
      // ignore
    }
  }
  console.log('Seeded analytics:', events.length);
}

async function main() {
  try {
    await runMigrations();
    await seedProducts();
  await seedInventory();
  await seedSales();
  await seedAnalytics();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { runMigrations, seedProducts, seedInventory, seedSales, seedAnalytics, main };
