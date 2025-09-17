import { useMemo, useState } from 'react';

export default function Forecasting({ transactions = [] }) {
  const [mode, setMode] = useState('building'); // building | road | all

  const monthly = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      const k = (t.date||'').slice(0,7);
      map.set(k, (map.get(k)||0) + (Number(t.qty||0) * Number(t.unit||0)));
    });
    const labels = Array.from(map.keys()).sort();
    const data = labels.map(l => map.get(l));
    // naive forecast: average of last 12 months
    const avg = data.slice(-12).reduce((s,a)=>s+(a||0),0) / Math.max(1, Math.min(12, data.length));
    const forecast = Array.from({length:12}).map((_,i)=> Math.round(avg * (1 + (Math.sin(i/12 * Math.PI*2) * 0.15))));
    return { labels: Array.from({length:12}).map((_,i) => `M+${i+1}`), forecast };
  }, [transactions]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">Seasonal Demand Forecasting</h3>
      <div className="mt-3 text-sm text-gray-600">Toggle mode and view a 12-month simulated forecast based on historical sales.</div>
      <div className="mt-3">
        <select value={mode} onChange={e=>setMode(e.target.value)} className="border rounded px-2 py-1">
          <option value="building">Building Materials</option>
          <option value="road">Road Materials</option>
          <option value="all">All Materials</option>
        </select>
      </div>
      <div className="mt-3 text-sm">
        {monthly.forecast.join(', ')}
      </div>
    </div>
  );
}
