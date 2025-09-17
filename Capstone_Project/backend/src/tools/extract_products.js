const fs = require('fs');
const path = require('path');

// compute path relative to this script so it works whether run from project root or elsewhere
const srcPath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'POS.js');
const outPath = path.join(__dirname, '..', 'data', 'products_seed.json');

// ensure output directory exists
const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(srcPath)) {
  console.error('POS.js not found at', srcPath);
  console.error('cwd=', process.cwd(), '__dirname=', __dirname);
  process.exit(1);
}

const src = fs.readFileSync(srcPath, 'utf8');
// support either `export const products = [` or `export let products = [`
const exportRegex = /export\s+(?:const|let)\s+products\s*=\s*\[(.*?)\];/s;
const arrMatch = src.match(exportRegex);
if (!arrMatch) {
  console.error('products array not found in POS.js (looking for export const/let products = [');
  process.exit(1);
}
const arrayBody = arrMatch[1];

const objMatches = arrayBody.match(/\{[^}]*\}/gs) || [];
const products = [];
for (const o of objMatches) {
  const idMatch = o.match(/id\s*:\s*(\d+)/);
  // name may contain escaped quotes (\") so allow escaped characters inside the string
  const nameMatch = o.match(/name\s*:\s*"((?:\\.|[^"\\])*)"/);
  const priceMatch = o.match(/price\s*:\s*([0-9]+(?:\.[0-9]+)?)/);
  const catMatch = o.match(/category\s*:\s*"([^\"]+)"/);
  if (idMatch && nameMatch && priceMatch) {
    products.push({
      id: Number(idMatch[1]),
      // unescape any escaped characters in the JS string literal
      name: nameMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim(),
      price: Number(priceMatch[1]),
      category: catMatch ? catMatch[1].trim() : null
    });
  }
}

fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
console.log('Extracted', products.length, 'products to', outPath);
