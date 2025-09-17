import React, { useMemo } from 'react';

export default function SupplierDashboard({ transactions = [] }) {
  // simple supplier aggregation from transactions
  const suppliers = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      const s = t.supplier || 'Unknown';
      const entry = map.get(s) || { supplier: s, orders: 0, total: 0, delays: 0 };
      entry.orders += 1; entry.total += Number(t.qty||0) * Number(t.unit||0);
      if (t.delivery_delay && Number(t.delivery_delay) > 3) entry.delays += 1;
      map.set(s, entry);
    });
    return Array.from(map.values()).sort((a,b)=>b.total-a.total);
  }, [transactions]);

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold">Supplier Performance</h3>
      <div className="mt-3 text-sm">
        {suppliers.slice(0,6).map(s => (
          <div key={s.supplier} className="flex justify-between items-center py-2 border-b">
            <div>
              <div className="font-semibold">{s.supplier}</div>
              <div className="text-xs text-gray-500">Orders: {s.orders} • Delays: {s.delays}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{Math.round(s.total)}</div>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && <div className="text-gray-500">No supplier data</div>}
      </div>
    </div>
  );
}
