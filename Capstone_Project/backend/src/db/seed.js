const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function run() {
  const p = path.join(__dirname, '..', 'data', 'products_seed.json');
  const raw = fs.readFileSync(p, 'utf8');
  const products = JSON.parse(raw || '[]');

  for (const prod of products) {
    await pool.query(
      `INSERT INTO products(id, name, price, category) VALUES($1,$2,$3,$4) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price, category=EXCLUDED.category`,
      [prod.id, prod.name, prod.price, prod.category]
    );
  }
  console.log('Seeded products:', products.length);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
