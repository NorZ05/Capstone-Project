import { useState, useEffect, useMemo, useCallback } from "react";
import cfg from './config';
import {
  FaDollarSign,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
} from "react-icons/fa";

  function SummaryCard({ title, value, subtitle, color = "blue", icon }) {
    const bg = {
      green: "bg-green-50 border-green-300 text-green-800",
      red: "bg-red-50 border-red-300 text-red-800",
      blue: "bg-blue-50 border-blue-300 text-blue-800",
      yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
    }[color];

    return (
      <div className={`${bg} border rounded-md p-5 flex items-center gap-4`}>
        {icon}
        <div>
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  }

  function MiniBarChart({ data = [], width = 120, height = 30, color = "#60A5FA" }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map((d) => d || 0));
    const barW = Math.max(2, Math.floor(width / data.length) - 2);
    return (
      <svg width={width} height={height} className="block">
        {data.map((d, i) => {
          const h = max === 0 ? 0 : Math.round((d / max) * (height - 4));
          const x = i * (barW + 2);
          return <rect key={i} x={x} y={height - h} width={barW} height={h} fill={color} rx={2} />;
        })}
      </svg>
    );
  }

  export default function BusinessPerformance() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Core metrics
    const [revenue, setRevenue] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [netProfit, setNetProfit] = useState(0);

    // Collections
    const [topSelling, setTopSelling] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [revenueTrend, setRevenueTrend] = useState([]);

    // POS health
    const [posHealth, setPosHealth] = useState({ status: 'Unknown', lastEvent: null, events24: 0, recentAnoms: 0 });

  // Expenses and trend
  const [expensesList, setExpensesList] = useState([]);
  const [expenseFilters, setExpenseFilters] = useState({ category: 'All', start: '', end: '' });
  const [profitTrend, setProfitTrend] = useState([]);

    // polling interval (ms) — configurable later
    const POLL = 15_000;

  const fetchSummary = useCallback(async () => {
    const res = await fetch(`${cfg.API_BASE}/performance/summary`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  const fetchTopSelling = useCallback(async () => {
    const res = await fetch(`${cfg.API_BASE}/performance/top-selling`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  const fetchTransactions = useCallback(async (limit = 200) => {
    const res = await fetch(`${cfg.API_BASE}/performance/transactions?limit=${limit}`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  const fetchPosHealth = useCallback(async () => {
    const res = await fetch(`${cfg.API_BASE}/performance/pos-health`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  const fetchExpenses = useCallback(async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.start) params.set('start', filters.start);
    if (filters.end) params.set('end', filters.end);
    const res = await fetch(`${cfg.API_BASE}/performance/expenses?${params.toString()}`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  const fetchProfitTrend = useCallback(async (period = 'monthly') => {
    const res = await fetch(`${cfg.API_BASE}/performance/profit-trend?period=${period}`);
    if (!res.ok) throw new Error(`status:${res.status}`);
    return res.json();
  }, []);

  useEffect(() => {
    let mounted = true;
    let timer = null;

    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const [sum, top, txs, health, expRes, trendRes] = await Promise.all([
          fetchSummary(),
          fetchTopSelling(),
          fetchTransactions(300),
          fetchPosHealth(),
          fetchExpenses(expenseFilters),
          fetchProfitTrend('monthly')
        ]);

        if (!mounted) return;
        setRevenue(sum.revenue ?? 0);
        setExpenses(sum.expenses ?? 0);
        setNetProfit(sum.netProfit ?? (sum.revenue ? sum.revenue - (sum.expenses || 0) : 0));

  setTopSelling(top.topSelling ?? []);
  setTransactions(txs.transactions ?? []);
  // keep revenueTrend if provided by legacy endpoint; fallback to empty
  setRevenueTrend([]);

  setPosHealth(health || { status: 'Unknown', lastEvent: null, events24: 0, recentAnoms: 0 });
  setExpensesList(expRes.expenses ?? []);
  setProfitTrend(trendRes.trend ?? []);
      } catch (err) {
        console.error('BusinessPerformance load error', err);
        if (!mounted) return;
        setError(String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    timer = setInterval(() => loadAll().catch(e => console.error(e)), POLL);

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
  }, [fetchSummary, fetchTopSelling, fetchTransactions, fetchPosHealth]);

  const topSellingWithIndex = useMemo(() => topSelling.map((t, i) => ({ ...t, rank: i + 1 })), [topSelling]);

  // format currency as Philippine Peso
  const fmtPHP = (v) => {
    try {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(Number(v || 0));
    } catch (e) {
      return `₱${Number(v || 0).toLocaleString()}`;
    }
  };

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-[95vw] mx-auto border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📈 Business Performance</h1>
            <p className="text-sm text-gray-600">Overview of sales, costs and key operational metrics</p>
          </div>
          <div className="text-sm text-gray-500">{loading ? "Loading..." : error ? `Offline: ${error}` : "Live"}</div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Revenue"
            value={fmtPHP(revenue)}
            subtitle="Total income from sales"
            color="green"
            icon={<FaDollarSign className="text-green-600 text-2xl" />}
          />

          <SummaryCard
            title="Expenses"
            value={fmtPHP(expenses)}
            subtitle="Operational and supply costs"
            color="red"
            icon={<FaExchangeAlt className="text-red-600 text-2xl" />}
          />

          <div className={`rounded-md p-5 flex items-center gap-4 border ${netProfit >= 0 ? "bg-blue-50 border-blue-300" : "bg-yellow-50 border-yellow-300"}`}>
            {netProfit >= 0 ? (
              <FaArrowUp className="text-blue-600 text-2xl" />
            ) : (
              <FaArrowDown className="text-yellow-600 text-2xl" />
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Net Profit</h3>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-blue-800" : "text-yellow-800"}`}>{fmtPHP(netProfit)}</p>
              <div className="mt-2">
                <MiniBarChart data={revenueTrend} width={160} height={36} color={netProfit >= 0 ? "#60A5FA" : "#FBBF24"} />
              </div>
              <p className="text-xs text-gray-600 mt-1">Revenue minus expenses</p>
            </div>
          </div>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top-Selling List */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">🏆 Top-Selling Items</h2>
              <span className="text-xs text-gray-500">Updated now</span>
            </div>
            <div className="max-h-72 overflow-auto">
              {topSellingWithIndex.length === 0 ? (
                <div className="text-sm text-gray-500 p-3">No data</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left text-xs font-semibold text-gray-700">#</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-700">Item</th>
                      <th className="p-2 text-right text-xs font-semibold text-gray-700">Units</th>
                      <th className="p-2 text-right text-xs font-semibold text-gray-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingWithIndex.map((item) => (
                      <tr key={item.product_id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm text-gray-800">{item.rank}</td>
                        <td className="p-2 text-sm text-gray-800">{item.item}</td>
                        <td className="p-2 text-sm text-right text-gray-800">{item.sold}</td>
                        <td className="p-2 text-sm text-right text-gray-800">{fmtPHP(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">📆 Recent Transactions</h2>
              <span className="text-xs text-gray-500">Last 24 hours</span>
            </div>
            <div className="max-h-72 overflow-auto">
              {transactions.length === 0 ? (
                <div className="text-sm text-gray-500 p-3">No transactions</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left text-xs font-semibold text-gray-700">Date</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-700">Transaction</th>
                      <th className="p-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={tx.id || i} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm text-gray-800">{new Date(tx.date).toLocaleString()}</td>
                        <td className="p-2 text-sm text-gray-800">{tx.id}</td>
                        <td className="p-2 text-sm text-right text-gray-800">{fmtPHP(tx.total ?? tx.amount)}</td>
                        <td className="p-2 text-sm text-gray-800">{tx.status ?? 'Completed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Expenses and Profit Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-3">Add Expense</h3>
            <ExpenseForm onSaved={async () => { const res = await fetchExpenses(expenseFilters); setExpensesList(res.expenses || []); const t = await fetchProfitTrend('monthly'); setProfitTrend(t.trend || []); const s = await fetchSummary(); setExpenses(s.expenses || 0); setNetProfit(s.netProfit || (s.revenue - (s.expenses||0))); }} />
          </div>

          <div className="col-span-2 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Expense History</h3>
              <div className="flex gap-2">
                <select value={expenseFilters.category} onChange={e => setExpenseFilters(f => ({ ...f, category: e.target.value }))} className="border p-2 rounded">
                  <option>All</option>
                  <option>Utilities</option>
                  <option>Labor</option>
                  <option>Logistics</option>
                  <option>Supplies</option>
                  <option>Miscellaneous</option>
                </select>
                <input type="date" value={expenseFilters.start} onChange={e => setExpenseFilters(f => ({ ...f, start: e.target.value }))} className="border p-2 rounded" />
                <input type="date" value={expenseFilters.end} onChange={e => setExpenseFilters(f => ({ ...f, end: e.target.value }))} className="border p-2 rounded" />
                <button onClick={async () => { const res = await fetchExpenses(expenseFilters); setExpensesList(res.expenses || []); }} className="px-3 py-2 bg-blue-600 text-white rounded">Filter</button>
              </div>
            </div>
            <ExpenseTable expenses={expensesList} onRefresh={async () => { const res = await fetchExpenses(expenseFilters); setExpensesList(res.expenses || []); const s = await fetchSummary(); setExpenses(s.expenses || 0); setNetProfit(s.netProfit || (s.revenue - (s.expenses||0))); }} />
          </div>

          <div className="col-span-3 bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-3">Profitability Trend</h3>
            <ProfitChart data={profitTrend} />
          </div>
        </div>

        {/* POS Health */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold mb-2 text-gray-800">🩺 POS Health</h2>
            <button onClick={() => { /* manual refresh */
                setLoading(true);
                (async () => {
                  try {
                    const h = await fetchPosHealth();
                    setPosHealth(h);
                  } catch (e) {
                    console.error(e);
                    setError(String(e));
                  } finally { setLoading(false); }
                })();
            }} className="text-sm text-blue-600">Refresh</button>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <FaCheckCircle className={`text-xl ${posHealth.status === 'No issues' ? 'text-green-700' : posHealth.status === 'Delayed sync' ? 'text-yellow-600' : 'text-gray-500'}`} />
              <div>
                <div className="text-sm font-medium">{posHealth.status}</div>
                <div className="text-xs text-gray-500">Events (24h): {posHealth.events24} • Recent anomalies: {posHealth.recentAnoms}</div>
                {posHealth.lastEvent && <div className="text-xs text-gray-400">Last event: {new Date(posHealth.lastEvent).toLocaleString()}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

// Expense form component
function ExpenseForm({ onSaved }) {
  const [category, setCategory] = useState('Utilities');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!category || !amount || isNaN(Number(amount))) return alert('Please provide valid category and amount');
    setSaving(true);
    try {
      const res = await fetch(`${cfg.API_BASE}/performance/expenses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, amount: Number(amount), date, notes }) });
      if (!res.ok) throw new Error(await res.text());
      setCategory('Utilities'); setAmount(''); setNotes('');
      if (onSaved) await onSaved();
    } catch (e) { console.error(e); alert('Failed to save expense'); }
    setSaving(false);
  }

  return (
    <div>
      <label className="block text-sm">Category</label>
      <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full border p-2 rounded mb-2">
        <option>Utilities</option>
        <option>Labor</option>
        <option>Logistics</option>
        <option>Supplies</option>
        <option>Miscellaneous</option>
      </select>
      <label className="block text-sm">Amount</label>
      <input value={amount} onChange={e=>setAmount(e.target.value)} className="w-full border p-2 rounded mb-2" />
      <label className="block text-sm">Date</label>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border p-2 rounded mb-2" />
      <label className="block text-sm">Notes</label>
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border p-2 rounded mb-2" />
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="px-3 py-2 bg-teal-600 text-white rounded">{saving ? 'Saving…' : 'Save Expense'}</button>
      </div>
    </div>
  );
}

// Expense table component
function ExpenseTable({ expenses = [], onRefresh = () => {} }) {
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function doDelete(id) {
    try {
      const res = await fetch(`${cfg.API_BASE}/performance/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      await onRefresh();
    } catch (e) { console.error(e); alert('Delete failed'); }
    setConfirmDelete(null);
  }

  return (
    <div>
      <div className="max-h-64 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-2 text-left text-xs font-semibold text-gray-700">Category</th>
              <th className="p-2 text-right text-xs font-semibold text-gray-700">Amount</th>
              <th className="p-2 text-left text-xs font-semibold text-gray-700">Date</th>
              <th className="p-2 text-left text-xs font-semibold text-gray-700">Notes</th>
              <th className="p-2 text-left text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-sm text-gray-800">{e.category}</td>
                <td className="p-2 text-sm text-right text-gray-800">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(e.amount || 0))}</td>
                <td className="p-2 text-sm text-gray-800">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2 text-sm text-gray-800">{e.notes}</td>
                <td className="p-2 text-sm text-gray-800">
                  <button onClick={() => setEditing(e)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => setConfirmDelete(e)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditExpenseModal initial={editing} onClose={() => setEditing(null)} onSaved={onRefresh} />}
      {confirmDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="bg-white p-6 rounded shadow">
            <p>Delete expense <strong>{confirmDelete.category}</strong> for {confirmDelete.amount}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 border rounded" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => doDelete(confirmDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditExpenseModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...initial });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`${cfg.API_BASE}/performance/expenses/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(await res.text());
      if (onSaved) await onSaved();
      onClose();
    } catch (e) { console.error(e); alert('Save failed'); }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white p-6 rounded shadow w-[420px]">
        <h3 className="font-semibold mb-2">Edit Expense</h3>
        <label className="block text-sm">Category</label>
        <input className="w-full border p-2 rounded mb-2" value={form.category} onChange={e=>setForm(f=>({...f, category: e.target.value}))} />
        <label className="block text-sm">Amount</label>
        <input className="w-full border p-2 rounded mb-2" value={form.amount} onChange={e=>setForm(f=>({...f, amount: e.target.value}))} />
        <label className="block text-sm">Date</label>
        <input type="date" className="w-full border p-2 rounded mb-2" value={form.date ? form.date.slice(0,10) : ''} onChange={e=>setForm(f=>({...f, date: e.target.value}))} />
        <label className="block text-sm">Notes</label>
        <textarea className="w-full border p-2 rounded mb-2" value={form.notes || ''} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-teal-600 text-white rounded" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// Profit chart (simple SVG line)
function ProfitChart({ data = [] }) {
  if (!data || !data.length) return <div className="text-sm text-gray-500">No trend data</div>;
  // map to numbers
  const values = data.map(d => Number(d.net || 0));
  const labels = data.map(d => d.period);
  const max = Math.max(...values.map(v => Math.abs(v))) || 1;
  const w = 800, h = 200, pad = 30;
  const stepX = (w - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v + max) / (2 * max)) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map((p, i) => `${i===0?'M':'L'} ${p[0]} ${p[1]}`).join(' ');
  return (
    <div className="overflow-auto">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
        <path d={path} fill="none" stroke="#2563EB" strokeWidth="2" />
      </svg>
      <div className="text-xs text-gray-500 mt-2">Showing {data.length} periods</div>
    </div>
  );
}
