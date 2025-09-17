// chart.js/auto is registered in index.js
import { Bar } from 'react-chartjs-2';

export default function InventoryMovement({ inventoryMovement = { days: [], products: [] }, transactions = [] }) {
  const products = (inventoryMovement.products || []).map(p => ({ ...p, total: (p.data||[]).reduce((s,a)=>s+a,0) }));
  products.sort((a,b)=>b.total-a.total);
  const top = products.slice(0,8);

  const fast = products.filter(p => p.total > 50).slice(0,8);
  const stagnant = products.filter(p => p.total <= 5).slice(0,8);

  const barData = {
    labels: top.map(p=>p.item),
    datasets: [{ label: 'Movement', data: top.map(p=>p.total), backgroundColor: '#60A5FA' }]
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { type: 'category', ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 } },
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">Inventory Movement & Use Cases</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          <div className="text-sm text-gray-500">Top moving items</div>
          <div style={{ height: '320px', maxHeight: '60vh' }} className="mt-2">
            <Bar
              key={top.map(p=>p.item).join('|')}
              data={barData}
              options={barOptions}
              redraw={true}
            />
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Fast vs Stagnant</div>
          <div className="mt-2 text-sm">
            <div className="font-medium">Fast-moving</div>
            <div style={{ maxHeight: 140, overflow: 'auto' }} className="mb-2">
              {fast.length ? (
                <ul className="list-disc list-inside text-sm">
                  {fast.map(p => <li key={p.item}>{p.item}</li>)}
                </ul>
              ) : '—'}
            </div>

            <div className="font-medium">Stagnant</div>
            <div style={{ maxHeight: 140, overflow: 'auto' }}>
              {stagnant.length ? (
                <ul className="list-disc list-inside text-sm">
                  {stagnant.map(p => <li key={p.item}>{p.item}</li>)}
                </ul>
              ) : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
