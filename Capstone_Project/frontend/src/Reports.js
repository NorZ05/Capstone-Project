
import { useState, useEffect, useMemo } from "react";
import cfg from './config';
import { FaFileExport, FaFilter, FaCalendarAlt, FaPrint } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

// Minimal demo dataset used as a safe fallback when backend is unreachable.
const DEMO_TRANSACTIONS = [
  { id: "T-1001", date: "2025-08-01", pos: "POS-1", item: "Cement Bag", category: "Cement", qty: 20, unit: 250, branch: "Main" },
  { id: "T-1002", date: "2025-08-01", pos: "POS-2", item: "Steel Rod 10mm", category: "Steel", qty: 5, unit: 1500, branch: "Warehouse" },
  { id: "T-1003", date: "2025-08-02", pos: "POS-1", item: "Brick", category: "Masonry", qty: 100, unit: 75, branch: "Main" },
  { id: "T-1004", date: "2025-08-03", pos: "POS-3", item: "Paint - Gallon", category: "Paint", qty: 10, unit: 850, branch: "Retail" },
  { id: "T-1005", date: "2025-08-04", pos: "POS-2", item: "Glue 1L", category: "Adhesive", qty: 15, unit: 120, branch: "Main" },
];

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
}

function downloadCSV(rows, filename = "report.csv", columns = null) {
  if (!rows || !rows.length) return;
  const keys = Array.isArray(columns) && columns.length ? columns : Object.keys(rows[0]);
  const header = keys.map(k => `"${String(k).replace(/"/g, '""')}"`).join(",");
  const csvRows = rows.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = [header, ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Reports() {
  // Filters and UI state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branch, setBranch] = useState("All");
  const [timeframe, setTimeframe] = useState('Last 7 Days'); // Today, Last 7 Days, This Month, Last Month, This Year
  const [category, setCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("monthly"); // monthly or quarterly
  const [showGross, setShowGross] = useState(true);
  const [groupField, setGroupField] = useState("category"); // category or payment

  // Data
  const [transactions, setTransactions] = useState([]);
  const [salesTrend, setSalesTrend] = useState({ labels: [], totals: [] });
  const [inventoryMovement, setInventoryMovement] = useState({ days: [], products: [] });
  const [forecast] = useState({ recent: [], forecast: [] });
  const [anomalies, setAnomalies] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [persistBenchmark, setPersistBenchmark] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState({ key: "date", dir: "desc" });

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      try {
        // Use analytics endpoints when available, fall back to reports endpoints
        const txP = fetch(`${cfg.API_BASE}/analytics/transactions`).catch(() => fetch(`${cfg.API_BASE}/reports/sales`));
        const salesP = fetch(`${cfg.API_BASE}/analytics/sales-trends?months=24`).catch(() => fetch(`${cfg.API_BASE}/reports/sales`));
        const invP = fetch(`${cfg.API_BASE}/analytics/inventory-movement?days=180`).catch(() => fetch(`${cfg.API_BASE}/reports/inventory`));
        const anomP = fetch(`${cfg.API_BASE}/reports/anomalies`).catch(() => fetch(`${cfg.API_BASE}/anomalies`));
        const expP = fetch(`${cfg.API_BASE}/performance/expenses`).catch(() => Promise.resolve({ ok: false }));

        const [txRes, salesRes, invRes, anomRes, expRes] = await Promise.all([txP, salesP, invP, anomP, expP]);

        if (txRes && txRes.ok) {
          const tx = await txRes.json();
          if (mounted && Array.isArray(tx)) setTransactions(tx);
        } else if (mounted) {
          setTransactions(DEMO_TRANSACTIONS);
        }

        if (salesRes && salesRes.ok) {
          const s = await salesRes.json();
          if (mounted) setSalesTrend({ labels: s.months || s.labels || [], totals: s.totals || s.totals || [] });
        }

        if (invRes && invRes.ok) {
          const im = await invRes.json();
          if (mounted) setInventoryMovement(im);
        }

        if (anomRes && anomRes.ok) {
          const an = await anomRes.json();
          if (mounted) setAnomalies(Array.isArray(an) ? an : (an.rows || []));
        }

            // (no-op) don't auto-run benchmark on load

        if (expRes && expRes.ok) {
          const ex = await expRes.json();
          if (mounted) setExpenses(Array.isArray(ex) ? ex : (ex.rows || []));
        }
      } catch (err) {
        if (mounted) setTransactions(DEMO_TRANSACTIONS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAll();
    return () => { mounted = false; };
  }, []);

  async function runBenchmark(opts = {}) {
    try {
      setRunningBenchmark(true);
      // call backend benchmark run endpoint; do not require secret in dev
      const qs = [];
      if (opts.persist) qs.push('persist=1');
      const url = `${cfg.API_BASE}/benchmark/run${qs.length ? '?' + qs.join('&') : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('benchmark failed');
      const body = await res.json();
      setBenchmarkResults(body);
      // refresh anomalies to include persisted ones if opted
      if (opts.persist) {
        const ar = await fetch(`${cfg.API_BASE}/anomalies`);
        if (ar.ok) setAnomalies(await ar.json());
      }
    } catch (err) {
      console.error('benchmark run error', err);
    } finally {
      setRunningBenchmark(false);
    }
  }

  // (removed) top-level movingAverage helper was unused; chartData defines its own movingAverage implementation where needed

  // Derived lists
  const branches = useMemo(() => ["All", ...Array.from(new Set(transactions.map(t => t.branch || "Main")))], [transactions]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(transactions.map(t => t.category || "Misc")))], [transactions]);
  const paymentMethods = useMemo(() => ["All", ...Array.from(new Set(transactions.map(t => t.payment || "Cash")))], [transactions]);

  // Filtering
  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        if (branch !== "All" && t.branch !== branch) return false;
        if (category !== "All" && t.category !== category) return false;
        if (paymentMethod !== "All" && (t.payment || "Cash") !== paymentMethod) return false;
        if (fromDate && t.date < fromDate) return false;
        if (toDate && t.date > toDate) return false;
        if (search) {
          const s = search.toLowerCase();
          if (!((t.item || "").toLowerCase().includes(s) || (t.id && t.id.toLowerCase().includes(s)))) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortBy.dir === "asc" ? 1 : -1;
        if (sortBy.key === "total") return (a.qty * (a.unit || 0) - b.qty * (b.unit || 0)) * dir;
        if (sortBy.key === "qty") return (a.qty - b.qty) * dir;
        return a[sortBy.key] > b[sortBy.key] ? dir : a[sortBy.key] < b[sortBy.key] ? -dir : 0;
      });
  }, [transactions, branch, category, paymentMethod, fromDate, toDate, search, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // clamp page whenever totalPages changes without referencing `page` directly
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setPage(p => Math.min(p, totalPages)); }, [totalPages]);
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  // KPI
  const kpi = useMemo(() => {
    const totalSales = transactions.reduce((s, t) => s + (t.qty * (t.unit || 0)), 0);
    const txCount = transactions.length;
    const avgTicket = txCount ? Math.round(totalSales / txCount) : 0;
    const inventoryValue = inventoryMovement.products ? inventoryMovement.products.reduce((s,p)=> s + (p.on_hand||0)*(p.unit_price||0),0) : 1250000;
    return { totalSales, txCount, avgTicket, inventoryValue };
  }, [transactions, inventoryMovement]);

  // Profit margin per item (best-effort) — compute early so enhancedKPI can reference if needed
  const profitMargins = useMemo(() => {
    // Expect transactions to have cost or unit_cost; otherwise margin unavailable
    const map = new Map();
    filtered.forEach(t => {
      const key = t.item || t.id || 'unknown';
      const entry = map.get(key) || { item: key, quantitySold: 0, revenue: 0, cost: 0 };
      entry.quantitySold += Number(t.qty || 0);
      entry.revenue += Number(t.qty || 0) * Number(t.unit || 0);
      entry.cost += Number(t.qty || 0) * Number(t.unit_cost || t.cost || 0);
      map.set(key, entry);
    });
    const arr = Array.from(map.values()).map(r => ({ ...r, margin: r.revenue - r.cost }));
    return arr;
  }, [filtered]);

  // Additional KPIs requested
  const enhancedKPI = useMemo(() => {
    // derive date window from timeframe
    const now = new Date();
    let start = new Date(0);
    if (timeframe === 'Today') { start = new Date(); start.setHours(0,0,0,0); }
    else if (timeframe === 'Last 7 Days') { start = new Date(); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0); }
    else if (timeframe === 'This Month') { start = new Date(now.getFullYear(), now.getMonth(), 1); }
    else if (timeframe === 'Last Month') { start = new Date(now.getFullYear(), now.getMonth()-1, 1); }
    else if (timeframe === 'This Year') { start = new Date(now.getFullYear(), 0, 1); }

    const relevantTx = transactions.filter(t => {
      const d = new Date(t.date || new Date());
      return d >= start && d <= now;
    });

    // Average Daily Revenue
    const days = Math.max(1, Math.ceil((now - start) / (1000*60*60*24)) + 1);
    const totalRevenue = relevantTx.reduce((s,t)=>s + (Number(t.qty||0) * Number(t.unit||0)), 0);
    const avgDailyRevenue = Math.round(totalRevenue / days || 0);

    // Inventory Turnover Rate = COGS / Average Inventory. Best-effort: use profitMargins total as COGS proxy
    const cogs = transactions.reduce((s,t)=> s + (Number(t.qty||0) * Number(t.unit_cost||t.cost||0)), 0);
    const avgInventory = (inventoryMovement.products || []).reduce((s,p)=> s + ((p.on_hand||0) * (p.unit_price||0)), 0) || 1;
    const invTurnover = avgInventory > 0 ? +(cogs / avgInventory).toFixed(2) : null;

    // Expense-to-Revenue Ratio over same window
    const relevantExp = expenses.filter(e => { const d=new Date(e.date||e.created_at||new Date()); return d>=start && d<=now; });
    const totalExpenses = relevantExp.reduce((s,e)=> s + Number(e.amount||0), 0);
    const expToRev = totalRevenue > 0 ? Math.round((totalExpenses / totalRevenue) * 100) : null;

    // Profit Margin Average: compute per-item margins from filtered locally (avoid referencing profitMargins to prevent init-order issues)
    const map = new Map();
    filtered.forEach(t => {
      const key = t.item || t.id || 'unknown';
      const entry = map.get(key) || { revenue: 0, cost: 0 };
      entry.revenue += Number(t.qty || 0) * Number(t.unit || 0);
      entry.cost += Number(t.qty || 0) * Number(t.unit_cost || t.cost || 0);
      map.set(key, entry);
    });
    const margins = Array.from(map.values()).filter(p => p.revenue > 0).map(p => ((p.revenue - p.cost) / p.revenue) * 100);
    const avgMarginPct = margins.length ? Math.round(margins.reduce((s,a)=>s+a,0)/margins.length) : null;

    return { avgDailyRevenue, invTurnover, expToRev, avgMarginPct };
  }, [transactions, timeframe, inventoryMovement, expenses, filtered]);

  // Sales chart data (monthly/quarterly) with anomaly overlay
  // map a chart label (monthly like 2023-11 or quarterly like 2023-Q1) to a start/end Date
  function labelRange(label) {
    // Quarterly label like 2023-Q1
    const qMatch = /^([0-9]{4})-Q([1-4])$/.exec(label);
    if (qMatch) {
      const y = Number(qMatch[1]);
      const q = Number(qMatch[2]);
      const startMonth = (q - 1) * 3 + 1;
      const start = new Date(Date.UTC(y, startMonth - 1, 1));
      const end = new Date(Date.UTC(y, startMonth + 2, 1));
      end.setUTCDate(0); // last day of quarter
      return { start, end };
    }
    // Monthly label like 2023-11
    const mMatch = /^([0-9]{4})-([0-9]{2})$/.exec(label);
    if (mMatch) {
      const y = Number(mMatch[1]);
      const m = Number(mMatch[2]);
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 1));
      end.setUTCDate(0); // last day of month
      return { start, end };
    }
    // fallback: try parse as ISO date (day precision)
    const d = new Date(label);
    if (!isNaN(d)) return { start: new Date(d.setHours(0, 0, 0, 0)), end: new Date(d.setHours(23, 59, 59, 999)) };
    // last resort: wide range to match nothing
    return { start: new Date(0), end: new Date(0) };
  }

  const chartData = useMemo(() => {
    // Helper: build monthly labels/data from transactions if server data missing
    let labels = salesTrend.labels && salesTrend.labels.length ? salesTrend.labels.slice() : [];
    let data = salesTrend.totals && salesTrend.totals.length ? salesTrend.totals.slice() : [];

    if (!labels.length) {
      const map = new Map();
      const fmt = (d) => (d||'').slice(0,7);
      filtered.forEach(t => {
        const key = fmt(t.date || new Date().toISOString().slice(0,10));
        map.set(key, (map.get(key) || 0) + (Number(t.qty||0) * Number(t.unit||0)));
      });
      labels = Array.from(map.keys()).sort();
      data = labels.map(l => map.get(l) || 0);
    }

    // Quarterly aggregation when requested
    if (groupBy === 'quarterly') {
      const qmap = new Map();
      labels.forEach((lab, i) => {
        const [y,m] = lab.split('-');
        const q = Math.floor((Number(m)-1)/3)+1;
        const key = `${y}-Q${q}`;
        qmap.set(key, (qmap.get(key)||0) + (data[i]||0));
      });
      labels = Array.from(qmap.keys());
      data = labels.map(l => qmap.get(l) || 0);
    }

    // Build daily series helper for timeframe windows
    function buildDailySeries(days) {
      const end = new Date(); end.setHours(23,59,59,999);
      const start = new Date(); start.setDate(end.getDate() - (days-1)); start.setHours(0,0,0,0);
      const map = new Map();
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        map.set(d.toISOString().slice(0,10), 0);
      }
      filtered.forEach(t => {
        const d = (t.date || new Date()).slice(0,10);
        if (map.has(d)) map.set(d, map.get(d) + (Number(t.qty||0) * Number(t.unit||0)));
      });
      const labs = Array.from(map.keys());
      return { labels: labs, data: labs.map(l => map.get(l)) };
    }

    // Apply timeframe selection
    let finalLabels = labels.slice();
    let finalData = data.slice();
    if (timeframe === 'Today') {
      const s = buildDailySeries(1); finalLabels = s.labels; finalData = s.data;
    } else if (timeframe === 'Last 7 Days') {
      const s = buildDailySeries(7); finalLabels = s.labels; finalData = s.data;
    } else if (timeframe === 'This Month') {
      const now = new Date(); const days = now.getDate(); const s = buildDailySeries(days); finalLabels = s.labels; finalData = s.data;
    } else if (timeframe === 'Last Month') {
      const now = new Date(); const first = new Date(now.getFullYear(), now.getMonth()-1, 1); const last = new Date(now.getFullYear(), now.getMonth(), 0);
      const map = new Map(); for (let d = new Date(first); d <= last; d.setDate(d.getDate()+1)) map.set(d.toISOString().slice(0,10), 0);
      filtered.forEach(t => { const d = (t.date || new Date()).slice(0,10); if (map.has(d)) map.set(d, map.get(d) + (Number(t.qty||0) * Number(t.unit||0))); });
      finalLabels = Array.from(map.keys()); finalData = finalLabels.map(l => map.get(l));
    } else if (timeframe === 'This Year') {
      const year = new Date().getFullYear(); const mlabels = []; const mdata = [];
      for (let m=0;m<12;m++) { const k = `${year}-${String(m+1).padStart(2,'0')}`; mlabels.push(k); mdata.push(0); }
      filtered.forEach(t=>{ const key = (t.date||'').slice(0,7); const idx = mlabels.indexOf(key); if(idx>=0) mdata[idx]+= (Number(t.qty||0)*Number(t.unit||0)); });
      finalLabels = mlabels; finalData = mdata;
    }

    // Build anomaly overlay for the finalLabels
    const anomalyMeta = finalLabels.map((lab) => {
      const range = labelRange(lab);
      return anomalies.filter(a => {
        const ts = a.detected_at || a.timestamp || a.date;
        if (!ts) return false;
        const d = new Date(ts);
        if (isNaN(d)) return false;
        return d >= range.start && d <= range.end;
      });
    });
    const anomalyValues = finalLabels.map((lab, idx) => {
      const hits = anomalyMeta[idx] || [];
      if (!hits.length) return null;
      const score = Math.max(...hits.map(h => Number(h.score || 1)));
      const base = finalData[idx] || 0;
      return base ? base * (1 + Math.min(0.35, score * 0.06)) : score;
    });

    // moving averages
    function movingAverage(arr, window) {
      const out = new Array(arr.length).fill(null);
      for (let i=0;i<arr.length;i++) {
        const start = Math.max(0, i - (window-1));
        const slice = arr.slice(start, i+1).filter(v=>v!=null);
        if (!slice.length) out[i]=null; else out[i] = Math.round(slice.reduce((s,a)=>s+a,0)/slice.length);
      }
      return out;
    }
    const ma7 = movingAverage(finalData, 7);
    const ma30 = movingAverage(finalData, 30);

    const anomalyPointRadius = anomalyValues.map(v => v ? 6 : 0);
    const anomalyPointBg = anomalyValues.map(v => v ? 'rgba(239,68,68,0.95)' : 'rgba(239,68,68,0.0)');

    const datasets = [
      { label: showGross ? 'Gross Sales' : 'Net Revenue', data: finalData, borderColor: '#3B82F6', backgroundColor: '#BFDBFE', tension: 0.1, fill: true },
      { label: 'Anomalies', data: anomalyValues, type: 'line', pointRadius: anomalyPointRadius, pointHoverRadius: anomalyPointRadius.map(r => r ? r + 3 : 0), showLine: false, borderColor: 'rgba(239,68,68,0.9)', backgroundColor: 'rgba(239,68,68,0.9)', pointBackgroundColor: anomalyPointBg },
      { label: '7-day MA', data: ma7, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.08)', borderDash: [4,4], tension: 0.2, pointRadius: 0 },
      { label: '30-day MA', data: ma30, borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.06)', borderDash: [6,4], tension: 0.2, pointRadius: 0 }
    ];

    return { labels: finalLabels, datasets };
  }, [salesTrend, filtered, anomalies, groupBy, showGross, timeframe]);

  // Chart options with anomaly tooltip
  const chartOptions = useMemo(() => ({
    plugins: {
      tooltip: {
        callbacks: {
          // show anomaly details when hovering anomaly dataset points
          label: function(context) {
            const ds = context.dataset || {};
            const label = context.label || '';
            if (ds.label === 'Anomalies') {
              const idx = context.dataIndex;
              const val = ds.data[idx];
              // find anomalies in this label range
              const range = labelRange(label);
              const hits = anomalies.filter(a => {
                const ts = a.detected_at || a.timestamp || a.date;
                if (!ts) return false;
                const d = new Date(ts);
                if (isNaN(d)) return false;
                return d >= range.start && d <= range.end;
              });
              if (!hits.length) return `Anomaly score ${val || ''}`;
              return hits.map(h => `${h.metric || h.type || 'Anomaly'}: ${h.details || h.description || JSON.stringify(h)}`).join('\n');
            }
            return `${ds.label || ''}: ${context.formattedValue}`;
          }
        }
      }
    },
    interaction: { intersect: false, mode: 'index' },
    maintainAspectRatio: false
  }), [anomalies]);

  // Inventory movement chart data and fast/stagnant items
  const invChartData = useMemo(() => {
    if (!inventoryMovement || !inventoryMovement.days) return null;
    const products = (inventoryMovement.products || []).map(p => ({ ...p, total: (p.data||[]).reduce((s,a)=>s+a,0) }));
    products.sort((a,b)=>b.total-a.total);
    const top = products.slice(0,6);
    return {
      labels: inventoryMovement.days,
      datasets: top.map((p,i)=>({ label: p.item, data: p.data, backgroundColor: ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA','#F472B6'][i%6] }))
    };
  }, [inventoryMovement]);

  // Expense trend aggregated by month
  const expenseTrend = useMemo(() => {
    if (!expenses || !expenses.length) return null;
    const map = new Map();
    expenses.forEach(e => {
      const m = (e.date || e.created_at || new Date()).toString().slice(0,7);
      map.set(m, (map.get(m)||0) + Number(e.amount || 0));
    });
    const labels = Array.from(map.keys()).sort();
    const data = labels.map(l => map.get(l));
    return { labels, data };
  }, [expenses]);

  

  function toggleSort(key) {
    setSortBy(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">MIS — Reports & Analytics</h1>

      {/* Filter panel */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-600" />
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
          <span className="text-sm text-gray-500">to</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded px-2 py-1" />
          <label htmlFor="timeframe-select" className="sr-only">Timeframe presets</label>
          <select id="timeframe-select" value={timeframe} onChange={e => {
            const v = e.target.value; setTimeframe(v);
            // update date inputs for convenience
            const now = new Date();
            if (v === 'Today') { const d = now.toISOString().slice(0,10); setFromDate(d); setToDate(d); }
            else if (v === 'Last 7 Days') { const end = now.toISOString().slice(0,10); const start = new Date(); start.setDate(now.getDate()-6); setFromDate(start.toISOString().slice(0,10)); setToDate(end); }
            else if (v === 'This Month') { const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0,10); setFromDate(start); setToDate(now.toISOString().slice(0,10)); }
            else if (v === 'Last Month') { const start = new Date(now.getFullYear(), now.getMonth()-1, 1); const end = new Date(now.getFullYear(), now.getMonth(), 0); setFromDate(start.toISOString().slice(0,10)); setToDate(end.toISOString().slice(0,10)); }
            else if (v === 'This Year') { const start = new Date(now.getFullYear(),0,1).toISOString().slice(0,10); setFromDate(start); setToDate(now.toISOString().slice(0,10)); }
          }} className="border rounded px-2 py-1 ml-2 text-sm">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <select value={branch} onChange={e => setBranch(e.target.value)} className="border rounded px-2 py-1">
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-2 py-1">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="border rounded px-2 py-1">
            {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input placeholder="Search item or tx id" value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm">Show</label>
          <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="border rounded px-2 py-1">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select value={groupField} onChange={e => setGroupField(e.target.value)} className="border rounded px-2 py-1">
            <option value="category">Group: Category</option>
            <option value="payment">Group: Payment Method</option>
          </select>
          <label className="flex items-center gap-2"><input type="checkbox" checked={showGross} onChange={e => setShowGross(e.target.checked)} /> Gross</label>
          <button onClick={() => {
            const cols = ["date","id","item","category","qty","unit","unit_cost"];
            const rows = filtered.map(r => ({ date: r.date, id: r.id, item: r.item, category: r.category, qty: r.qty, unit: r.unit || 0, unit_cost: r.unit_cost || r.cost || 0 }));
            downloadCSV(rows, `report-${new Date().toISOString().slice(0,10)}.csv`, cols);
          }} className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"><FaFileExport />Export CSV</button>
          <button onClick={() => window.print()} className="bg-gray-200 px-3 py-2 rounded flex items-center gap-2"><FaPrint />Print</button>
        </div>
      </div>

      {/* Audit & Benchmarking */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Audit & Benchmarking</h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={persistBenchmark} onChange={e => setPersistBenchmark(e.target.checked)} /> Persist</label>
            <button onClick={() => runBenchmark({ persist: persistBenchmark })} disabled={runningBenchmark} className="px-3 py-1 bg-indigo-600 text-white rounded">{runningBenchmark ? 'Running…' : 'Run Benchmark'}</button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Persisted anomalies</div>
            <div className="text-xl font-bold">{anomalies.length}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Benchmark anomalies</div>
            <div className="text-xl font-bold">{benchmarkResults ? (benchmarkResults.anomalies || []).length : '—'}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Benchmark records</div>
            <div className="text-xl font-bold">{benchmarkResults ? ((benchmarkResults.metrics && benchmarkResults.metrics.totalRecords) || '—') : '—'}</div>
          </div>
        </div>

        {benchmarkResults && (
          <div className="mt-4">
            <h4 className="font-semibold">Benchmark Findings</h4>
            <div className="text-sm text-gray-700 mt-2">Found {benchmarkResults.anomalies.length} anomalies in simulated data (duration {benchmarkResults.metrics.durationMs}ms)</div>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {benchmarkResults.anomalies.slice(0,8).map((b,i)=> <li key={i}>{b.source} — {b.severity}: {b.description}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold">{formatCurrency(kpi.totalSales)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Transactions</div>
          <div className="text-2xl font-bold">{kpi.txCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Avg Ticket</div>
          <div className="text-2xl font-bold">{formatCurrency(kpi.avgTicket)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Inventory Value</div>
          <div className="text-2xl font-bold">{formatCurrency(kpi.inventoryValue)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Expenses (recent)</div>
          <div className="text-2xl font-bold">{formatCurrency(expenses.reduce((s,e)=>s+Number(e.amount||0),0))}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Avg Daily Revenue ({timeframe})</div>
          <div className="text-2xl font-bold">{formatCurrency(enhancedKPI.avgDailyRevenue)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Inventory Turnover</div>
          <div className="text-2xl font-bold">{enhancedKPI.invTurnover !== null ? enhancedKPI.invTurnover : '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Expense → Revenue (%)</div>
          <div className="text-2xl font-bold">{enhancedKPI.expToRev !== null ? `${enhancedKPI.expToRev}%` : '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Avg Profit Margin (%)</div>
          <div className="text-2xl font-bold">{enhancedKPI.avgMarginPct !== null ? `${enhancedKPI.avgMarginPct}%` : '—'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Sales Trend ({groupBy})</h2>
          <div style={{ height: '360px', maxHeight: '60vh' }} className="relative">
            {loading ? (
              <div className="text-center py-10">Loading chart...</div>
            ) : (
              <Line key={(groupBy||'') + '-' + timeframe} data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} redraw={true} />
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Inventory Movement (last period)</h3>
          {invChartData ? (
            <div className="mt-3">
              <Bar key={invChartData ? invChartData.labels.join('|') : 'inv-none'} data={invChartData} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} style={{ height: 220 }} redraw={true} />
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-3">No inventory movement data.</div>
          )}

          <div className="mt-4 border-t pt-3">
            <h4 className="font-semibold">Forecast (demo)</h4>
            <div className="text-sm text-gray-600">Recent: {forecast.recent ? forecast.recent.join(', ') : '—'}</div>
            <div className="text-sm text-gray-600">Forecast next months (seasonal simulated): {forecast.forecast ? forecast.forecast.join(', ') : '—'}</div>
          </div>
        </div>
      </div>

      {/* Expense trend and Profit margin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-bold">Expenses vs Revenue</h3>
          {expenseTrend ? (
            <div style={{ height: 240 }} className="mt-3">
              <Bar data={{ labels: expenseTrend.labels, datasets: [{ label: 'Expenses', data: expenseTrend.data, backgroundColor: '#F87171' }, { label: 'Revenue', data: chartData.labels.map(l => {
                const idx = chartData.labels.indexOf(l);
                return idx >= 0 ? (chartData.datasets[0].data[idx] || 0) : 0;
              }), backgroundColor: '#3B82F6' }] }} />
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-3">No expense data.</div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Profit Margin Insights</h3>
          <div className="mt-3 text-sm text-gray-600">Top items by margin</div>
          <div className="mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-1">Item</th>
                  <th className="py-1">Qty</th>
                  <th className="py-1">Revenue</th>
                  <th className="py-1">Cost</th>
                  <th className="py-1">Margin</th>
                </tr>
              </thead>
              <tbody>
                {profitMargins.slice(0,8).map((p,i)=> (
                  <tr key={i} className="border-b">
                    <td className="py-1">{p.item}</td>
                    <td className="py-1">{p.quantitySold}</td>
                    <td className="py-1">{formatCurrency(p.revenue)}</td>
                    <td className="py-1">{formatCurrency(p.cost)}</td>
                    <td className="py-1">{formatCurrency(p.margin)}</td>
                  </tr>
                ))}
                {profitMargins.length === 0 && <tr><td colSpan={5} className="py-4 text-gray-500">No margin data (missing cost/unit_cost in transactions)</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transactions / report table */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Report Table</h3>
          <div className="text-sm text-gray-500">Showing {filtered.length} records</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 cursor-pointer" onClick={() => toggleSort("date")}>Date</th>
                <th className="py-2">Item</th>
                <th className="py-2">Category</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Revenue</th>
                <th className="py-2">Cost</th>
                <th className="py-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2">{r.date}</td>
                  <td className="py-2">{r.item}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2">{r.qty}</td>
                  <td className="py-2">{formatCurrency((r.qty||0)*(r.unit||0))}</td>
                  <td className="py-2">{formatCurrency((r.qty||0)*(r.unit_cost||r.cost||0))}</td>
                  <td className="py-2">{formatCurrency((r.qty||0)*((r.unit||0) - (r.unit_cost||r.cost||0)))}</td>
                </tr>
              ))}
              {pageRows.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-gray-500">No records match the current filters.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">Next</button>
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label>Rows</label>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="border rounded px-2 py-1">
              {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
