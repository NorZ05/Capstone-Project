import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
// import 'chart.js/auto'; // Removed as it's globally registered in index.js

export default function SalesTrend({ transactions = [], anomalies = [], timeframe = 'Last 7 Days' }) {
  const [viewBy, setViewBy] = useState('category'); // category | item | supplier
  const [materialView, setMaterialView] = useState('all'); // building | road | all

  const grouped = useMemo(() => {
    // group by month-year
    const map = new Map();
    transactions.forEach(t => {
      const key = (t.date||'').slice(0,7);
      const cat = t.category || 'Misc';
      // determine material type naive mapping based on category keywords
      const lower = (t.item || '').toLowerCase() + ' ' + cat.toLowerCase();
      const type = /cement|rebar|block|plywood|bricks|brick/.test(lower) ? 'building' : /gravel|asphalt|bitumen|road|sand/.test(lower) ? 'road' : 'other';
      if (materialView !== 'all' && type !== materialView) return;
      map.set(key, (map.get(key) || 0) + (Number(t.qty||0) * Number(t.unit||0)));
    });
    const labels = Array.from(map.keys()).sort();
    const data = labels.map(l => map.get(l));
    return { labels, data };
  }, [transactions, materialView]);

  // seasonal overlays (labels shown in UI text; arrays reserved for future overlay rendering)

  const chartData = {
    labels: grouped.labels,
    datasets: [
      { label: 'Sales', data: grouped.data, borderColor: '#3B82F6', backgroundColor: '#BFDBFE', fill: true }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Material-Centric Sales Trends</h3>
        <div className="flex items-center gap-2">
          <select value={materialView} onChange={e=>setMaterialView(e.target.value)} className="border rounded px-2 py-1">
            <option value="all">All Materials</option>
            <option value="building">Building Materials</option>
            <option value="road">Road Materials</option>
          </select>
          <select value={viewBy} onChange={e=>setViewBy(e.target.value)} className="border rounded px-2 py-1">
            <option value="category">By Category</option>
            <option value="item">By Item</option>
            <option value="supplier">By Supplier</option>
          </select>
        </div>
      </div>

        <div className="mt-3" style={{ height: 320 }}>
          <Line key={timeframe + '-' + materialView} data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: true } } }} redraw={true} />
        </div>

      <div className="mt-3 text-sm text-gray-600">
        <div>Seasonal overlays: Building (Mar–Jun, Sep–Nov), Road (Jan–Feb, Jul–Aug)</div>
      </div>
    </div>
  );
}
