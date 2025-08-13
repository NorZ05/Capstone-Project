import { useState, useEffect } from "react";
import { FaChartLine, FaDollarSign, FaShoppingCart, FaExchangeAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const transactions = [
  { id: 1, item: "Cement Bag", quantity: 5, total: 2500, payment: "Credit Card", date: "2025-06-09" },
  { id: 2, item: "Steel Rod (10mm)", quantity: 10, total: 7500, payment: "Cash", date: "2025-06-08" },
  { id: 3, item: "Brick", quantity: 100, total: 1500, payment: "Credit Card", date: "2025-06-07" },
];

const topSelling = [
  { item: "Steel Rod (10mm)", sold: 150, revenue: 112500 },
  { item: "Cement Bag", sold: 120, revenue: 60000 },
  { item: "Brick", sold: 500, revenue: 7500 },
];

const salesData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Sales Revenue",
      data: [50000, 65000, 70000, 85000],
      backgroundColor: "#4CAF50",
    },
  ],
};

const expensesData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Operational Costs",
      data: [30000, 35000, 40000, 45000],
      backgroundColor: "#FF5733",
    },
  ],
};

export default function BusinessPerformance() {
  const [revenue, setRevenue] = useState(225000);
  const [expenses, setExpenses] = useState(150000);
  const [netProfit, setNetProfit] = useState(revenue - expenses);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 5000)); // Simulated revenue update
      setExpenses(prev => prev + Math.floor(Math.random() * 3000)); // Simulated expense update
      setNetProfit(revenue - expenses);
    }, 5000);

    return () => clearInterval(interval);
  }, [revenue, expenses]);

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">Revenue & Financial Summary</h1>

      {}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-green-100 rounded-lg shadow-md flex items-center gap-4">
          <FaDollarSign className="text-green-600 text-2xl" />
          <div>
            <h2 className="text-lg font-bold">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-700">${revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-6 bg-red-100 rounded-lg shadow-md flex items-center gap-4">
          <FaExchangeAlt className="text-red-600 text-2xl" />
          <div>
            <h2 className="text-lg font-bold">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-700">${expenses.toLocaleString()}</p>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md flex items-center gap-4 ${netProfit >= 0 ? "bg-blue-100" : "bg-yellow-100"}`}>
          {netProfit >= 0 ? <FaArrowUp className="text-blue-600 text-2xl" /> : <FaArrowDown className="text-yellow-600 text-2xl" />}
          <div>
            <h2 className="text-lg font-bold">Net Profit</h2>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-blue-700" : "text-yellow-700"}`}>${netProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Sales Revenue Over Time</h2>
          <Bar data={salesData} />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Expenses Over Time</h2>
          <Bar data={expensesData} />
        </div>
      </div>

      {}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Payment Method</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{transaction.item}</td>
                <td className="p-2">{transaction.quantity}</td>
                <td className="p-2">${transaction.total.toLocaleString()}</td>
                <td className="p-2">{transaction.payment}</td>
                <td className="p-2">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
