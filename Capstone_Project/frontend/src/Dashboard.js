import { useState, useEffect } from "react";
import { FaChartLine, FaBoxes, FaShoppingCart, FaBell, FaCog } from "react-icons/fa";
import Chart from "react-apexcharts";

const dashboardData = {
  revenue: 125000,
  totalSales: 930,
  lowStockItems: 8,
  notifications: 5,
  topProducts: [
    { name: "Cement Bag", sales: 250 },
    { name: "Steel Rod (10mm)", sales: 180 },
    { name: "Concrete Blocks", sales: 120 }
  ],
  transactions: [
    { id: 1, item: "Cement Bag", amount: 5000, date: "2025-06-08" },
    { id: 2, item: "Steel Rod (10mm)", amount: 7500, date: "2025-06-08" },
    { id: 3, item: "Brick (Per Piece)", amount: 450, date: "2025-06-08" }
  ]
};

export default function Dashboard() {
  const [data, setData] = useState(dashboardData);

  useEffect(() => {
    setTimeout(() => {
      setData(dashboardData);
    }, 1000);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Dashboard Overview</h1>

      {}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <FaChartLine className="text-blue-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold">₱{data.revenue.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <FaShoppingCart className="text-green-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold">{data.totalSales}</p>
        </div>

        {}
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <FaBoxes className="text-orange-500 text-4xl mb-3" />
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <p className="text-2xl font-bold">{data.lowStockItems}</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-6">
        {}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <Chart
            type="bar"
            width="100%"
            height="300px"
            series={[{
              name: "Sales",
              data: data.topProducts.map((product) => product.sales)
            }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: data.topProducts.map((product) => product.name) },
              colors: ["#008FFB"]
            }}
          />
        </div>

        {}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <ul className="space-y-3">
            {data.transactions.map((txn) => (
              <li key={txn.id} className="flex justify-between border-b pb-2">
                <span className="text-md font-semibold">{txn.item}</span>
                <span className="text-green-600 font-bold">₱{txn.amount.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">{txn.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
          <FaBell className="text-red-500 text-3xl" />
          <h2 className="text-lg font-semibold">Pending Notifications</h2>
          <p className="text-2xl font-bold">{data.notifications}</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
          <FaCog className="text-gray-500 text-3xl" />
          <h2 className="text-lg font-semibold">Settings & Customization</h2>
          <p className="text-2xl font-bold">⚙️</p>
        </div>
      </div>
    </div>
  );
}
