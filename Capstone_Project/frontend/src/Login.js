import { useState } from "react";
import LoginLogo from "./Assets/LoginLogo.png";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "Admin" && password === "Admin123") {
      onLogin();
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-white-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-500 transform scale-600">
        {}

        <div className="flex justify-center mb-6">
          <img src={LoginLogo} alt="MIS Logo" className="w-50 h-50" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome! Login to Continue</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
