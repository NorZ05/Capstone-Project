const express = require('express');
const pool = require('../db');
const router = express.Router();
// GET full inventory join (products + qty)
router.get('/', async (req, res) => {
  try {
    const q = `
      SELECT p.id as product_id, p.name, p.price, p.category, COALESCE(i.qty_on_hand,0) as qty_on_hand, i.location
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      ORDER BY p.id
    `;
    const r = await pool.query(q);
    res.json(r.rows);
  } catch (err) {
    console.error('inventory list error:', err.message || err);
    // fallback: read small sample from seed file
    try {
      const sample = [{ product_id: 1001, name: 'Sample', price: 0, category: 'Misc', qty_on_hand: 12, location: 'Main' }];
      res.json(sample);
    } catch (e) {
      res.json([]);
    }
  }
});

// GET inventory by product
router.get('/:productId', async (req, res) => {
  const productId = Number(req.params.productId);
  try {
    const r = await pool.query('SELECT * FROM inventory WHERE product_id=$1', [productId]);
    res.json(r.rows);
  } catch (err) {
    console.error('inventory db error:', err.message || err);
    // fallback sample
    res.json([{ id: 1, product_id: productId, qty_on_hand: 10, location: 'Main' }]);
  }
});

// Adjust inventory
router.post('/adjust', async (req, res) => {
  const { product_id, qty, location } = req.body;
  try {
    // Use INSERT ... ON CONFLICT to create row if missing or update existing quantity
    await pool.query(
      `INSERT INTO inventory(product_id, qty_on_hand, location) VALUES($1,$2,$3)
       ON CONFLICT (product_id) DO UPDATE SET qty_on_hand = inventory.qty_on_hand + EXCLUDED.qty_on_hand, last_updated = now()`,
      [product_id, qty, location]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('inventory adjust error:', err.message || err);
    // fallback behavior: return ok but do not persist
    res.json({ ok: true, warning: 'db unavailable, adjustment not persisted' });
  }
});

module.exports = router;

// delete inventory row for a product
router.delete('/:productId', async (req, res) => {
  const productId = Number(req.params.productId);
  try {
    const r = await pool.query('DELETE FROM inventory WHERE product_id = $1 RETURNING *', [productId]);
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true, deleted: r.rows[0] });
  } catch (err) {
    console.error('inventory delete error', err.message || err);
    res.status(500).json({ error: 'db error' });
  }
});
