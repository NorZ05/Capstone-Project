import { useState } from "react";
import profilePic from "./Assets/Admin.jpg"; 
import dashboardLogo from "./Assets/DashboardLogo.png";
import POS from "./POS";
import Inventory from "./Inventory";
import BP from "./BusinessPerformance";
import Reports from "./Reports"; 
import Notifs from "./Notifs";
import Settings from "./Settings";
import Dashboard from "./Dashboard";

export default function Home({ onLogout }) {
  const [activeModule, setActiveModule] = useState("Home");
  const userRole = "Admin"; 

  const renderContent = () => {
    switch (activeModule) {
      case "Dashboard":
        return <Dashboard/>;
      case "POS":
        return <POS/>;
      case "Inventory":
        return <Inventory/>;
      case "Business Performance":
        return <BP/>;
      case "Analytics":
        return <Reports/>;
      case "Notifications":
        return <Notifs/>;
      case "Settings":
        return <Settings/>;
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
              { name: "Dashboard", icon: "📋" },
              { name: "POS", icon: "💳" },
              { name: "Inventory", icon: "📦" },
              { name: "Business Performance", icon: "📊" },
              { name: "Analytics", icon: "📈" },
              { name: "Notifications", icon: "🔔" },
              { name: "Settings", icon: "⚙️" },
              { name: "Logout", icon: "⏏️", action: onLogout } 
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
