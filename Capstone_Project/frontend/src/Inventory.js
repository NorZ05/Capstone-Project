/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import cfg from './config';
import { FaSearch, FaPlus, FaEdit, FaExclamationTriangle, FaBox, FaTrash } from "react-icons/fa";
import { products } from "./POS";

// helper to turn server-relative upload paths into full URLs (module-level so modals can use it)
function normalizeImgUrl(img) {
  if (!img) return '';
  if (typeof img !== 'string') return img;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/uploads')) {
    const apiBase = cfg.API_BASE || '/api';
    const origin = apiBase.replace(/\/api\/?$/, '');
    if (!origin || origin === '/') return img;
    return `${origin}${img}`;
  }
  return img;
}


export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState('All');
  const [liveInventory, setLiveInventory] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [categories, setCategories] = useState([...new Set(products.map(p => p.category))]);
  const [serverProducts, setServerProducts] = useState(null);

  // UI state for add/edit
  const [adding, setAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [editModal, setEditModal] = useState(null); // { id, name, price, category, qty }
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // load inventory from backend; set fetchError flag when network/backend is unreachable
  async function loadInventory() {
    try {
      const res = await fetch(`${cfg.API_BASE}/inventory`);
      if (!res.ok) throw new Error('bad');
      const json = await res.json();
      setLiveInventory(json);
      // also fetch product metadata (images) from backend so uploaded images appear
      try {
        const prodRes = await fetch(`${cfg.API_BASE}/products`);
        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          // build a map id -> product
          const map = {};
          prodJson.forEach(p => { map[String(p.id)] = p; });
          setServerProducts(map);
        }
      } catch (e) { /* ignore */ }
      // update categories from live data + local products
      try {
        const prodCats = products.map(p => p.category);
        const liveCats = json.map(i => i.category).filter(Boolean);
        setCategories([...new Set([...prodCats, ...liveCats])]);
      } catch (e) { /* ignore */ }
      setFetchError(false);
    } catch (e) {
      // fallback: map from local products with zero qty
      setLiveInventory(products.map(p => ({ product_id: p.id, name: p.name, price: p.price, category: p.category, qty_on_hand: p.stock ?? 0, location: 'Nagasat Hardware - Main Warehouse' })));
      setFetchError(true);
    }
  }

  useEffect(() => { loadInventory(); }, []);

  const inventory = products.map(product => {
    const match = liveInventory.find(li => Number(li.product_id) === Number(product.id));
    const serverP = serverProducts && serverProducts[String(product.id)];
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: match ? Number(match.qty_on_hand) : (product.stock ?? 0),
      threshold: 15,
      img: (serverP && serverP.img) ? serverP.img : product.img,
    };
  });
  const totalValue = inventory.reduce((sum, item) => {
    const price = parseFloat(item.price);
    const stock = parseInt(item.stock);
    return sum + (isNaN(price) || isNaN(stock) ? 0 : price * stock);
  }, 0);

  const lowStockItems = inventory.filter(item => item.stock < item.threshold);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const status = item.stock <= 0 ? 'No Stock' : (item.stock < item.threshold ? 'Low Stock' : 'In Stock');
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8 bg-white min-h-screen space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-sm text-gray-500">Track and manage your hardware and construction supplies.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setAdding(true)} className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center gap-2">
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-md">
          <p className="text-sm">Unable to reach the backend inventory API. The list is showing fallback values (zero stock). Check your API configuration (REACT_APP_API_URL) or the backend service.</p>
        </div>
      )}

      {/* Summary Cards - above both Inventory and Stock Alerts */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <SummaryCard label="Total Products" value={inventory.length} />
        <SummaryCard label="Categories" value={categories.length} />
        <SummaryCard label="Low Stock Items" value={lowStockItems.length} />
        <SummaryCard label="Total Value" value={`₱${totalValue.toLocaleString()}`} />
      </div>

      {/* Main grid: table left, alerts right */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaBox className="text-gray-600" />
              <h2 className="text-lg font-semibold">Inventory</h2>
            </div>
            {/* Search & Filter inside Inventory card */}
            <div className="flex gap-4 items-center mb-4">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory by name..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md px-4 py-2"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="All">Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">Status</option>
                <option value="In Stock">In stock</option>
                <option value="Low Stock">Low stock</option>
                <option value="No Stock">No stock</option>
              </select>
            </div>

            {/* Product Inventory Table */}
            <div className="max-h-[520px] overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 text-left bg-gray-100">Item</th>
                    <th className="p-2 text-left bg-gray-100">Category</th>
                    <th className="p-2 text-left bg-gray-100">Price</th>
                    <th className="p-2 text-left bg-gray-100">Stock</th>
                    <th className="p-2 text-left bg-gray-100">
                      <span className="font-semibold">Status</span>
                    </th>
                    <th className="p-2 text-left bg-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 text-sm flex items-center gap-2">
                        <img src={normalizeImgUrl(item.img)} alt={item.name} className="w-8 h-8 object-cover rounded-md border border-gray-300" />
                        <span className="truncate">{item.name}</span>
                      </td>
                      <td className="p-2 text-sm truncate">{item.category}</td>
                      <td className="p-2 text-sm whitespace-nowrap">₱{parseFloat(item.price).toFixed(2)}</td>
                      <td className="p-2 text-sm">{item.stock}</td>
                      <td className="p-2 text-sm">
                        {item.stock <= 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">No stock</span>
                        ) : item.stock < item.threshold ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Low stock</span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">In stock</span>
                        )}
                      </td>
                      <td className="p-2 text-sm flex gap-2">
                        <button onClick={() => setEditModal({ id: item.id, img: item.img, name: item.name, price: String(item.price || ''), category: item.category || '', qty: item.stock })} className="text-gray-600 hover:text-green-600"><FaEdit /></button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ open: true, id: item.id, name: item.name }); }} className="text-red-600 hover:text-red-800" title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          {/* Stock Alerts column (moved to right) */}
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold">
              <FaExclamationTriangle /> Stock Alerts
            </div>
            <p className="text-sm text-gray-700 mb-2">Products requiring immediate attention:</p>
            {lowStockItems.length > 0 ? (
              <div className="max-h-[520px] overflow-y-auto space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm text-gray-800 p-2 border rounded-md bg-white">
                    <div className="flex items-center gap-2">
                      <img src={normalizeImgUrl(item.img)} alt={item.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-gray-600">Current stock: <strong>{item.stock}</strong></div>
                      <div className="text-xs text-gray-500">Threshold: {item.threshold}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 italic">Everything’s in stock, no action needed!</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm delete modal */}
      <ConfirmDeleteModal
        openState={confirmDelete}
        onClose={() => setConfirmDelete({ open: false, id: null, name: '' })}
        onConfirm={async () => {
          try {
            await fetch(`${cfg.API_BASE}/products/${confirmDelete.id}`, { method: 'DELETE' });
            setConfirmDelete({ open: false, id: null, name: '' });
            await loadInventory();
          } catch (e) { console.error('delete failed', e); }
        }}
      />

      {/* Add Product modal */}
      <AddProductModal
        open={adding}
        onClose={() => setAdding(false)}
        onSaved={async () => { setAdding(false); await loadInventory(); }}
        categories={categories}
        addCategory={(name) => { if (!name) return; setCategories(prev => Array.from(new Set([...prev, name]))); }}
      />

      {/* Edit Product modal */}
      <EditProductModal
        open={!!editModal}
        initialData={editModal}
        onClose={() => setEditModal(null)}
        onSaved={async () => { setEditModal(null); await loadInventory(); }}
        categories={categories}
        addCategory={(name) => { if (!name) return; setCategories(prev => Array.from(new Set([...prev, name]))); }}
      />

    </div>
  );
}

// Confirm delete modal (rendered by Inventory when needed)
function ConfirmDeleteModal({ openState, onClose, onConfirm }) {
  const { open, id, name } = openState || {};
  if (!open) return null;
  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} style={{ pointerEvents: 'auto' }} />
      <div className="bg-white p-6 rounded shadow-lg w-[420px] relative" onClick={(e) => { e.stopPropagation(); }} style={{ zIndex: 100000, pointerEvents: 'auto' }}>
        <h4 className="font-semibold mb-2">Delete product</h4>
        <p className="text-sm text-gray-700 mb-4">Are you sure you want to delete <strong>{name}</strong>? This will remove it from products and inventory.</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ pointerEvents: 'auto' }}>Cancel</button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={async (e) => { e.stopPropagation(); await onConfirm(); }} style={{ pointerEvents: 'auto' }}>Delete</button>
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(modal, document.body);
}

// view modal removed per request

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  );
}

function AddProductModal({ open, onClose, onSaved, categories = [], addCategory = () => {} }) {
  const [form, setForm] = useState({ name: '', price: '', category: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { if (!open) { setForm({ name: '', price: '', category: '' }); setFile(null); setPreview(null); setCreatingCategory(false); setNewCat(''); } }, [open]);

  async function save() {
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', String(form.price || 0));
      fd.append('category', form.category || '');
      if (file) fd.append('image', file);
      const res = await fetch(`${cfg.API_BASE}/products`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('save failed');
      const created = await res.json();
      // if quantity provided, set inventory via adjust endpoint (for new product current is 0)
      const qty = Number(form.qty || 0);
      if (!isNaN(qty) && qty >= 0) {
        try { await fetch(`${cfg.API_BASE}/inventory/adjust`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: created.id, qty, location: 'Main' }) }); } catch (e) { /* ignore */ }
      }
      // dispatch updates so POS can refresh
      try { window.dispatchEvent(new CustomEvent('products:updated', { detail: { productId: created.id } })); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new CustomEvent('inventory:updated', { detail: { productId: created.id } })); } catch (e) { /* ignore */ }
      onSaved();
    } catch (e) { console.error(e); alert('Failed to save product'); }
  }

  function handleNewCategory() {
    if (!newCat) return;
    addCategory(newCat);
    setForm(f => ({ ...f, category: newCat }));
    setCreatingCategory(false);
    setNewCat('');
  }

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white p-6 rounded shadow-lg w-[520px] relative">
        <h4 className="font-semibold mb-2">Add product</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input className="w-full border p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
            <input className="w-full border p-2" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
            <input className="w-full border p-2" value={form.qty || ''} onChange={e => setForm({...form, qty: e.target.value})} />
          </div>
          <div className="flex gap-2 items-center">
            {!creatingCategory ? (
              <>
                <select className="border p-2" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="ml-2 text-sm text-blue-600" onClick={() => setCreatingCategory(true)}>Create new</button>
              </>
            ) : (
              <div className="flex gap-2">
                <input className="border p-2" placeholder="New category" value={newCat} onChange={e => setNewCat(e.target.value)} />
                <button className="px-2 bg-green-600 text-white rounded" onClick={handleNewCategory}>Add</button>
                <button className="px-2 border rounded" onClick={() => setCreatingCategory(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="add-product-image" className="cursor-pointer inline-block bg-gray-100 px-3 py-2 rounded">Upload Image</label>
            <input id="add-product-image" type="file" className="hidden" onChange={e => { const f = e.target.files && e.target.files[0]; setFile(f); setPreview(f ? URL.createObjectURL(f) : null); }} />
            {preview && <img src={preview} alt="preview" className="inline-block w-12 h-12 object-cover rounded ml-3" />}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-teal-600 text-white rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>, document.body
  );
}

function EditProductModal({ open, initialData, onClose, onSaved, categories = [], addCategory = () => {} }) {
  const [form, setForm] = useState(initialData || {});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { setForm(initialData || {}); setFile(null); setPreview(null); setCreatingCategory(false); setNewCat(''); }, [initialData]);

  if (!open || !initialData) return null;

  function handleNewCategory() {
    if (!newCat) return;
    addCategory(newCat);
    setForm(f => ({ ...f, category: newCat }));
    setCreatingCategory(false);
    setNewCat('');
  }

  async function save() {
    try {
      if (file) {
        const fd = new FormData();
        fd.append('name', form.name || '');
        fd.append('price', String(form.price || 0));
        fd.append('category', form.category || '');
        fd.append('image', file);
        const res = await fetch(`${cfg.API_BASE}/products/${initialData.id}`, { method: 'PUT', body: fd });
        if (!res.ok) throw new Error('save failed');
      } else {
        const res = await fetch(`${cfg.API_BASE}/products/${initialData.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, price: form.price, category: form.category }) });
        if (!res.ok) throw new Error('save failed');
      }
      // if qty provided, compute delta and adjust inventory so final qty == provided value
      const qty = Number(form.qty);
      if (!isNaN(qty) && qty >= 0) {
        try {
          const curRes = await fetch(`${cfg.API_BASE}/inventory/${initialData.id}`);
          const curJson = await curRes.json();
          let currentQty = 0;
          if (Array.isArray(curJson) && curJson.length) currentQty = Number(curJson[0].qty_on_hand || curJson[0].qty || 0);
          // delta = desired - current
          const delta = qty - currentQty;
          if (delta !== 0) {
            await fetch(`${cfg.API_BASE}/inventory/adjust`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: initialData.id, qty: delta, location: 'Main' }) });
          }
        } catch (e) { /* ignore */ }
      }
      // dispatch update events
      try { window.dispatchEvent(new CustomEvent('products:updated', { detail: { productId: initialData.id } })); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new CustomEvent('inventory:updated', { detail: { productId: initialData.id } })); } catch (e) { /* ignore */ }
      onSaved();
    } catch (e) { console.error(e); alert('Failed to update product'); }
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white p-6 rounded shadow-lg w-[520px] relative">
        <h4 className="font-semibold mb-2">Edit product</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
            <input className="w-full border p-2" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
            <input className="w-full border p-2" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
            <input className="w-full border p-2" value={form.qty || ''} onChange={e => setForm({...form, qty: e.target.value})} />
          </div>
          <div className="flex gap-2 items-center">
            {!creatingCategory ? (
              <>
                <select className="border p-2" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="ml-2 text-sm text-blue-600" onClick={() => setCreatingCategory(true)}>Create new</button>
              </>
            ) : (
              <div className="flex gap-2">
                <input className="border p-2" placeholder="New category" value={newCat} onChange={e => setNewCat(e.target.value)} />
                <button className="px-2 bg-green-600 text-white rounded" onClick={handleNewCategory}>Add</button>
                <button className="px-2 border rounded" onClick={() => setCreatingCategory(false)}>Cancel</button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="edit-product-image" className="cursor-pointer inline-block bg-gray-100 px-3 py-2 rounded">Upload Image</label>
            <input id="edit-product-image" type="file" className="hidden" onChange={e => { const f = e.target.files && e.target.files[0]; setFile(f); setPreview(f ? URL.createObjectURL(f) : null); }} />
            {preview ? <img src={preview} alt="preview" className="inline-block w-12 h-12 object-cover rounded ml-3" /> : (form.img ? <img src={normalizeImgUrl(form.img)} alt="current" className="inline-block w-12 h-12 object-cover rounded ml-3" /> : null)}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-teal-600 text-white rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>, document.body
  );
}
