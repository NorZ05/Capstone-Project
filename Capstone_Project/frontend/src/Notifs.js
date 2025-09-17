import { useState } from "react";
import { FaExclamationTriangle, FaChartLine, FaDollarSign, FaBell, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const notificationsData = [
  { id: 1, type: "lowStock", message: " Low stock: Steel Rod (10mm) - Only 5 left!", icon: <FaExclamationTriangle />, bgColor: "bg-red-100", textColor: "text-red-600" },
  { id: 2, type: "salesAnomaly", message: " Unusual sales spike detected in Cement Bag purchases!", icon: <FaChartLine />, bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
  { id: 3, type: "dailyRevenue", message: " Today's revenue: $21,750 total sales.", icon: <FaDollarSign />, bgColor: "bg-green-100", textColor: "text-green-600" },
  { id: 4, type: "scheduledReport", message: " Weekly report generated - View insights now!", icon: <FaCalendarAlt />, bgColor: "bg-blue-100", textColor: "text-blue-600" },
  { id: 5, type: "paymentAlert", message: " Large payment processed: $5,000 refund issued.", icon: <FaBell />, bgColor: "bg-purple-100", textColor: "text-purple-600" },
];

export default function Notifs() {
  const [notifications, setNotifications] = useState(notificationsData);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">🔔 Notifications & Alerts</h1>

      {}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-between gap-4 p-4 border rounded-md shadow-md ${notif.bgColor} ${notif.textColor}`}
          >
            <div className="flex items-center gap-3">
              {notif.icon}
              <p className="text-lg font-medium">{notif.message}</p>
            </div>
            <button onClick={() => dismissNotification(notif.id)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
