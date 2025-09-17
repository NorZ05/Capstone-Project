import { useState } from "react";
import { FaMoon, FaSun, FaPalette, FaFont, FaSlidersH, FaBell, FaEye } from "react-icons/fa";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [accentColor, setAccentColor] = useState("#4CAF50");
  const [fontSize, setFontSize] = useState("medium");
  const [layout, setLayout] = useState("grid");
  const [notifications, setNotifications] = useState(true);
  const [accessibility, setAccessibility] = useState(false);

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">⚙ Appearance Settings</h1>

      <div className="space-y-6">
        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            {theme === "light" ? <FaSun className="text-yellow-500 text-lg" /> : <FaMoon className="text-blue-500 text-lg" />}
            <p className="text-lg font-medium">Theme Mode</p>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`py-2 px-4 rounded-md transition ${theme === "light" ? "bg-gray-200" : "bg-gray-800 text-white"}`}
          >
            {theme === "light" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaPalette className="text-purple-500 text-lg" />
            <p className="text-lg font-medium">Accent Color</p>
          </div>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="border rounded-md p-2 cursor-pointer"
          />
        </div>

        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaFont className="text-green-500 text-lg" />
            <p className="text-lg font-medium">Font Size</p>
          </div>
          <select
            className="border rounded-md px-3 py-2"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaSlidersH className="text-blue-500 text-lg" />
            <p className="text-lg font-medium">Layout Preference</p>
          </div>
          <select
            className="border rounded-md px-3 py-2"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>

        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaBell className="text-red-500 text-lg" />
            <p className="text-lg font-medium">Notifications</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`py-2 px-4 rounded-md transition ${notifications ? "bg-green-500 text-white" : "bg-gray-200"}`}
          >
            {notifications ? "Enabled" : "Disabled"}
          </button>
        </div>

        {}
        <div className="p-6 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaEye className="text-indigo-500 text-lg" />
            <p className="text-lg font-medium">High Contrast Mode</p>
          </div>
          <button
            onClick={() => setAccessibility(!accessibility)}
            className={`py-2 px-4 rounded-md transition ${accessibility ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          >
            {accessibility ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}
