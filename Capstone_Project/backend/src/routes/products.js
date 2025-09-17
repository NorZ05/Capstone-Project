const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

// configure multer to save uploads into data/uploads
const uploadsPath = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsPath); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')); }
});
const upload = multer({ storage });

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
let products = [];
try {
  products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
} catch (e) {
  products = [
    { id: 1001, name: 'Acetylene Hose Meter', price: 50.0, category: 'Hose & Tubing', img: '' },
    { id: 1002, name: 'Acrylic Thinner 700ml', price: 540.0, category: 'Paint & Primer', img: '' }
  ];
}

const dataPath = path.join(__dirname, '..', 'data', 'products_seed.json');

function readProducts() {
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath, 'utf8');
  try {
    const all = JSON.parse(raw);
    return all.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, img: p.img || '' }));
  } catch (e) {
    return [];
  }
}

router.get('/', (req, res) => {
  res.json(readProducts());
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = readProducts().find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// create a new product (append to products_seed.json)
// accept an optional image file named 'image'
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, category } = req.body || {};
  let img = '';
  if (req.file) {
    img = `/uploads/${req.file.filename}`;
  } else if (req.body.img) img = req.body.img;
  if (!name || !price) return res.status(400).json({ error: 'name and price required' });
  try {
    const all = readProducts();
    const maxId = all.reduce((m, p) => Math.max(m, Number(p.id || 0)), 1000);
    const id = maxId + 1;
  const prod = { id, name, price: String(price), category: category || 'Misc', img: img || '' };
    // append to the seed file on disk
    const existing = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : [];
    existing.push(prod);
    fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2));
    // also insert to DB products table to satisfy FK constraints for inventory
    try {
      const pool = require('../db');
      pool.query('INSERT INTO products(id, name, price, category) VALUES($1,$2,$3,$4)', [id, name, String(price), prod.category]).catch(e=>console.error('db insert product warning', e.message||e));
    } catch (e) {
      console.error('db insert missing', e.message || e);
    }
    res.status(201).json(prod);
  } catch (e) {
    console.error('create product error', e.message || e);
    res.status(500).json({ error: 'could not create' });
  }
});

// delete a product (DB + seed file)
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  try {
    const pool = require('../db');
    const r = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    // also remove from seed file
    try {
      const dataPath = path.join(__dirname, '..', 'data', 'products_seed.json');
      if (fs.existsSync(dataPath)) {
        const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8')) || [];
        const filtered = existing.filter(p => Number(p.id) !== id);
        fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2));
        fs.fsyncSync(fs.openSync(dataPath, 'r+'));
        // Log for debug
        if (existing.length === filtered.length) {
          console.error('Delete: Product not found in products_seed.json:', id);
        }
      }
    } catch (e) { console.error('remove seed file error', e.message || e); }
    if (!r.rows.length) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true, deleted: r.rows[0] });
  } catch (err) {
    console.error('delete product error', err.message || err);
    res.status(500).json({ error: 'db error' });
  }
});

// update a product (DB + seed file). accepts JSON body with name, price, category
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'invalid id' });
  const { name, price, category } = req.body || {};
  let img = undefined;
  if (req.file) img = `/uploads/${req.file.filename}`;
  try {
    const pool = require('../db');
    const updateFields = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) { updateFields.push(`name=$${idx++}`); values.push(name); }
    if (price !== undefined) { updateFields.push(`price=$${idx++}`); values.push(String(price)); }
    if (category !== undefined) { updateFields.push(`category=$${idx++}`); values.push(category); }
    if (updateFields.length) {
      const q = `UPDATE products SET ${updateFields.join(', ')} WHERE id=$${idx} RETURNING *`;
      values.push(id);
      await pool.query(q, values);
    }
    // update seed file
    try {
      const dataPath = path.join(__dirname, '..', 'data', 'products_seed.json');
      if (fs.existsSync(dataPath)) {
        const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8')) || [];
        const updated = existing.map(p => {
          if (Number(p.id) !== id) return p;
          const copy = { ...p };
          if (name !== undefined) copy.name = name;
          if (price !== undefined) copy.price = String(price);
          if (category !== undefined) copy.category = category;
          if (img !== undefined) copy.img = img;
          return copy;
        });
        fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
      }
    } catch (e) { console.error('update seed file error', e.message || e); }
    res.json({ ok: true });
  } catch (err) {
    console.error('update product error', err.message || err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
