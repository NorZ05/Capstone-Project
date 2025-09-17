const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products_seed.json');
const outPath = path.join(__dirname, '..', 'data', 'inventory_seed.json');

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

const categoryRanges = {
  // mid-sized hardware store typical stock levels (per SKU)
  'Paint & Primer': [8, 60],        // variety of cans, liters
  'Wire Mesh': [5, 40],
  'Roofing': [5, 80],
  'Construction': [2, 50],
  'Sheet Metals': [1, 20],
  'Rigging Tools': [2, 30],
  'Hardware': [10, 500],            // bolts, hinges, medium-high
  'Hose & Tubing': [5, 120],
  'Chemicals': [2, 60],
  'Fasteners': [50, 3000],          // nails, screws often stocked in bulk
  'Plumbing Fitting': [5, 400],
  'Tools': [2, 150],
  'Adhesives': [10, 400],
  'Wire Accessories': [5, 300],
  'Masonry': [10, 500],
  'Paint': [8, 120],
  'Electrical': [5, 300],
  'Boards & Panels': [2, 80],
  'Welding Supplies': [5, 200],
  'Covers & Sheets': [2, 60],
  'Fasteners (bulk)': [200, 5000],
  'Misc': [5, 200],
  'default': [5, 150]
};

function chooseRangeForCategory(cat) {
  if (!cat) return categoryRanges['default'];
  if (categoryRanges[cat]) return categoryRanges[cat];
  // try heuristic matches
  if (/paint|primer|boysen|emulsion/i.test(cat)) return categoryRanges['Paint & Primer'];
  if (/wire|mesh|barbed/i.test(cat)) return categoryRanges['Wire Mesh'];
  if (/roof|asla|asalum/i.test(cat)) return categoryRanges['Roofing'];
  if (/sheet|plate|steel|ms plate/i.test(cat)) return categoryRanges['Sheet Metals'];
  if (/nail|fastener|bolt|screw/i.test(cat)) return categoryRanges['Fasteners'];
  if (/hose|tube/i.test(cat)) return categoryRanges['Hose & Tubing'];
  if (/chemic|epoxy|curing|compound/i.test(cat)) return categoryRanges['Chemicals'];
  if (/plumb|pipe|elbow|coupling/i.test(cat)) return categoryRanges['Plumbing Fitting'];
  if (/electrical|wire|insulator|conduit/i.test(cat)) return categoryRanges['Electrical'];
  return categoryRanges['default'];
}

function deterministicQty(id, min, max) {
  const span = max - min + 1;
  // simple deterministic mapping using id
  const v = Math.abs(id * 97) % span; // 97 is a small multiplier for distribution
  return min + v;
}

function main() {
  if (!fs.existsSync(productsPath)) {
    console.error('products_seed.json not found at', productsPath);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  const location = 'Nagasat Hardware - Main Warehouse';

  const inventory = products.map(p => {
    const [min, max] = chooseRangeForCategory(p.category || '').slice(0,2);
    const qty = clamp(deterministicQty(Number(p.id), min, max), min, max);
    return { product_id: p.id, qty_on_hand: qty, location };
  });

  fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2), 'utf8');
  console.log(`Wrote ${inventory.length} inventory records to ${outPath}`);
}

main();
