import { useState, useEffect } from 'react';
import cfg from '../config';
import KPICards from './KPICards';
import SalesTrend from './SalesTrend';
import InventoryMovement from './InventoryMovement';
import SupplierDashboard from './SupplierDashboard';
import Forecasting from './Forecasting';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [inventoryMovement, setInventoryMovement] = useState({ days: [], products: [] });
  const [anomalies, setAnomalies] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [timeframe, setTimeframe] = useState('Last 7 Days'); // Today, Last 7 Days, This Month, Last Month, This Year
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const txRes = await fetch(`${cfg.API_BASE}/analytics/transactions`).catch(() => fetch(`${cfg.API_BASE}/reports/sales`));
        const invRes = await fetch(`${cfg.API_BASE}/analytics/inventory-movement?days=180`).catch(() => fetch(`${cfg.API_BASE}/reports/inventory`));
        const anomRes = await fetch(`${cfg.API_BASE}/reports/anomalies`).catch(() => fetch(`${cfg.API_BASE}/anomalies`));
        const expRes = await fetch(`${cfg.API_BASE}/performance/expenses`).catch(() => Promise.resolve({ ok: false }));

        if (txRes && txRes.ok) {
          const tx = await txRes.json(); if (mounted) setTransactions(Array.isArray(tx) ? tx : (tx.rows || []));
        }
        if (invRes && invRes.ok) {
          const im = await invRes.json(); if (mounted) setInventoryMovement(im);
        }
        if (anomRes && anomRes.ok) {
          const an = await anomRes.json(); if (mounted) setAnomalies(Array.isArray(an) ? an : (an.rows || []));
        }
        if (expRes && expRes.ok) {
          const ex = await expRes.json(); if (mounted) setExpenses(Array.isArray(ex) ? ex : (ex.rows || []));
        }
      } catch (err) {
        console.error('analytics load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center">Analytics — Operational Insights</h1>
      <div className="flex items-center justify-end gap-4">
        <label className="text-sm text-gray-600">Timeframe</label>
        <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="border rounded px-2 py-1">
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      <KPICards transactions={transactions} inventoryMovement={inventoryMovement} expenses={expenses} anomalies={anomalies} timeframe={timeframe} />

      <section>
        <SalesTrend transactions={transactions} anomalies={anomalies} timeframe={timeframe} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InventoryMovement inventoryMovement={inventoryMovement} transactions={transactions} timeframe={timeframe} />
        </div>
        <div>
          <SupplierDashboard transactions={transactions} timeframe={timeframe} />
          <Forecasting transactions={transactions} timeframe={timeframe} />
        </div>
      </section>
    </div>
  );
}
