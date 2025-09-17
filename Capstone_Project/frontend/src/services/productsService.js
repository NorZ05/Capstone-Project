import cfg from '../config';

// lightweight products service: try backend first and return data; caller will handle fallback/merge
async function fetchProducts() {
  try {
    const res = await fetch(`${cfg.API_BASE}/products`);
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (e) {
    // network or backend unavailable
  }
  return [];
}

export default { fetchProducts };
