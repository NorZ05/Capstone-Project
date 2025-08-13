import { useState } from "react";
import { FaFileExport, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const reportsData = {
  sales: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Forecast",
        data: [12000, 15000, 14000, 18000, 21000, 20000, 22000],
        borderColor: "#4CAF50",
        backgroundColor: "#A5D6A7",
      },
    ],
  },
  returns: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Returns & Refunds",
        data: [200, 300, 250, 400, 350, 300, 450],
        borderColor: "#FF5733",
        backgroundColor: "#FF8A65",
      },
    ],
  },
  profit: {
    labels: ["2023", "2024", "2025"],
    datasets: [
      {
        label: "Profit Margin",
        data: [150000, 175000, 200000],
        borderColor: "#2196F3",
        backgroundColor: "#90CAF9",
      },
    ],
  },
};

export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [selectedYear, setSelectedYear] = useState("2025");

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">Reports & Data Insights</h1>

      {}
      <div className="flex justify-center items-center mb-6 gap-6">
        <div className="flex gap-4 items-center">
          <FaFilter className="text-gray-500 text-lg" />
          <select className="border rounded-md px-3 py-2" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales Forecast</option>
            <option value="returns">Returns & Refunds</option>
            <option value="profit">Profit Analysis</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <FaCalendarAlt className="text-gray-500 text-lg" />
          <select className="border rounded-md px-3 py-2" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <button className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition flex items-center gap-2">
          <FaFileExport /> Export Report
        </button>
      </div>

      {}
      <div className="grid grid-cols-[2fr,1fr] gap-6">
        {}
        <div className="p-6 bg-white rounded-lg shadow-md flex justify-center">
          <div className="w-full">
            <h2 className="text-lg font-bold mb-4">{reportType === "sales" ? "Sales Forecast" : reportType === "returns" ? "Return & Refund Trends" : "Profit Margin Over Time"}</h2>
            {reportType === "sales" && <Line data={reportsData.sales} />}
            {reportType === "returns" && <Bar data={reportsData.returns} />}
            {reportType === "profit" && <Bar data={reportsData.profit} />}
          </div>
        </div>

        {}
        <div className="grid gap-4">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Best-Selling Items</h2>
            <p className="text-sm">1. Steel Rod (10mm) - $112,500 Revenue</p>
            <p className="text-sm">2. Cement Bag - $60,000 Revenue</p>
            <p className="text-sm">3. Brick - $7,500 Revenue</p>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Refund Rate</h2>
            <p className="text-2xl text-red-500 font-bold">4.5%</p>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Projected Revenue Growth</h2>
            <p className="text-2xl text-green-500 font-bold">+12% Next Quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
