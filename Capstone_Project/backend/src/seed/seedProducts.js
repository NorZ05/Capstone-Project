const fs = require('fs');
const path = require('path');

const dest = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
const sample = [
  { id: 1001, name: 'Acetylene Hose Meter', price: 50.0, category: 'Hose & Tubing', img: '' },
  { id: 1002, name: 'Acrylic Thinner 700ml', price: 540.0, category: 'Paint & Primer', img: '' }
];
fs.writeFileSync(path.join(dest, 'products.json'), JSON.stringify(sample, null, 2));
console.log('Written sample products to backend/data/products.json');
