import React from 'react';
import { formatCurrency } from '../utils';

export default function KPICards({ transactions = [], inventoryMovement = { products: [] }, expenses = [], anomalies = [] }) {
  const totalSales = transactions.reduce((s,t) => s + (Number(t.qty||0) * Number(t.unit||0)), 0);
  const avgDailyRevenue = (() => {
    if (!transactions.length) return 0;
    const dates = transactions.map(t => (t.date||'').slice(0,10));
    const unique = new Set(dates);
    return Math.round(totalSales / Math.max(1, unique.size));
  })();

  const inventoryValue = (inventoryMovement.products || []).reduce((s,p) => s + ((p.on_hand||0) * (p.unit_price||0)), 0);
  const supplierReliability = 98; // placeholder metric

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Avg Daily Revenue</div>
        <div className="text-2xl font-bold">{formatCurrency(avgDailyRevenue)}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Inventory Turnover</div>
        <div className="text-2xl font-bold">{inventoryValue ? (Math.round(((totalSales / inventoryValue) + Number.EPSILON) * 100) / 100) : '—'}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Supplier Reliability</div>
        <div className="text-2xl font-bold">{supplierReliability}%</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Persisted Anomalies</div>
        <div className="text-2xl font-bold">{anomalies.length}</div>
      </div>
    </div>
  );
}
