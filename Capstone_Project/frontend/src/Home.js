import { useState } from "react";
import profilePic from "./Assets/Admin.jpg"; 
import dashboardLogo from "./Assets/DashboardLogo.png";
import POS from "./POS";
import Inventory from "./Inventory";
import BP from "./BusinessPerformance";
// Notifs and Settings removed by request
import Analytics from './analytics/Analytics';
import Dashboard from "./Dashboard";
import DAD from "./DAD";
// SimulatedBenchmark import removed by request

export default function Home({ onLogout }) {
  const [activeModule, setActiveModule] = useState("Home");
  const userRole = "Admin"; 

  const renderContent = () => {
    switch (activeModule) {
      case "Dashboard":
        return <Dashboard/>;
      case "Point of Sale":
        return <POS/>;
      case "Inventory":
        return <Inventory/>;
      case "Performance":
        return <BP/>;
      case "Analytics":
        return <Analytics/>;
      case "Anomaly Detector":
        return <DAD/>;
      default:
        return <Dashboard/>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {}
      <header className="bg-[#1E3A8A] text-white py-4 px-6 flex items-center justify-center shadow-md space-x-4">
        <img src={dashboardLogo} alt="Nagasat Logo" className="h-24 w-auto" />
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-extrabold tracking-wide">NAGASAT</h1>
          <h2 className="text-xl font-semibold">Hardware & Construction Supplies</h2>
        </div>
      </header>

      <div className="flex flex-1">
        {}
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
          {}
          <div className="text-center mb-6">
            <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full mx-auto" />
            <h2 className="text-lg font-semibold mt-2">{userRole}</h2>
          </div>

          {}
          <ul className="space-y-4 flex-1">
            {[
              { name: "Dashboard", icon: "🏠" },
              { name: "Point of Sale", icon: "🛒" },
              { name: "Inventory", icon: "📦" },
              { name: "Performance", icon: "📄" },
              { name: "Analytics", icon: "📊" },
              { name: "Anomaly Detector", icon: "📡" },
              // Simulated Benchmark menu item removed by request
              

              { name: "Logout", icon: "⏻", action: onLogout } 
            ].map(({ name, icon, action }) => (
              <li key={name}>
                <button
                  onClick={action || (() => setActiveModule(name))}
                  className={`w-full text-left p-2 rounded-md transition ${
                    activeModule === name ? "bg-blue-500" : "hover:bg-gray-700"
                  } ${name === "Logout" ? "text-white" : ""}`}
                  style={name === "Logout" ? { backgroundColor: "#BA0D0D", hover: { backgroundColor: "#E01B1B" } } : {}}
                >
                  {icon} {name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {}
        <main className="flex-1 p-8 bg-gray-100">{renderContent()}</main>
      </div>
    </div>
  );
}
