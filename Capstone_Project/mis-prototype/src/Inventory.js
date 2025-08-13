import { useState } from "react";
import { FaSearch, FaPlus, FaMinus, FaFileExport, FaTruck, FaClipboardList } from "react-icons/fa";
import cementImg from "./Assets/cement.png";
import steelrodImg from "./Assets/steelrod.jpg";
import brickImg from "./Assets/brick.jpg";
import asphaltImg from "./Assets/asphalt.png";
import fiberglassImg from "./Assets/fiberglass.jpeg";
import metalroofImg from "./Assets/metalroof.png";
import concreteImg from "./Assets/concrete.png";
import plasticpanelsImg from "./Assets/plasticpanels.png";
import bambooImg from "./Assets/bamboo.png";
import hempcreteImg from "./Assets/hempcrete.jpg";

const inventory = [
  { id: 1, name: "Cement Bag", price: 500, img: cementImg, quantity: 10, threshold: 50, category: "Building Material", supplier: "ABC Cement Co.", lastUpdated: "2025-06-09" },
  { id: 2, name: "Steel Rod (10mm)", price: 750, img: steelrodImg, quantity: 150, threshold: 30, category: "Metal Supplies", supplier: "XYZ Steel Inc.", lastUpdated: "2025-06-09" },
  { id: 3, name: "Brick (Per Piece)", price: 15, img: brickImg, quantity: 1000, threshold: 200, category: "Masonry", supplier: "BrickMaster", lastUpdated: "2025-06-09" },
  { id: 4, name: "Asphalt (Per Ton)", price: 12000, img: asphaltImg, quantity: 5, threshold: 10, category: "Paving Material", supplier: "RoadWorks Ltd.", lastUpdated: "2025-06-09" },
  { id: 5, name: "Fiberglass Insulation (Per Roll)", price: 2500, img: fiberglassImg, quantity: 8, threshold: 20, category: "Insulation", supplier: "GlassShield", lastUpdated: "2025-06-09" },
  { id: 6, name: "Metal Roofing Sheet", price: 1500, img: metalroofImg, quantity: 12, threshold: 15, category: "Roofing", supplier: "SteelCover", lastUpdated: "2025-06-09" },
  { id: 7, name: "Concrete Blocks (Per Piece)", price: 50, img: concreteImg, quantity: 500, threshold: 100, category: "Masonry", supplier: "ConcreteWorks", lastUpdated: "2025-06-09" },
  { id: 8, name: "Recycled Plastic Panel", price: 800, img: plasticpanelsImg, quantity: 3, threshold: 10, category: "Eco Materials", supplier: "GreenTech", lastUpdated: "2025-06-09" },
  { id: 9, name: "Bamboo Plank (Per Meter)", price: 100, img: bambooImg, quantity: 300, threshold: 50, category: "Sustainable Material", supplier: "BambooBuilds", lastUpdated: "2025-06-09" },
  { id: 10, name: "Hempcrete Brick", price: 200, img: hempcreteImg, quantity: 150, threshold: 20, category: "Sustainable Masonry", supplier: "HempStruct", lastUpdated: "2025-06-09" },
];



export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const lowStockItems = inventory.filter(item => item.quantity <= item.threshold);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredInventory(
      inventory.filter((item) => item.name.toLowerCase().includes(value) || item.category.toLowerCase().includes(value))
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">Inventory</h1>

      {}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="border rounded-md px-10 py-2 w-4/5"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-3 gap-6">
        {}
        <div className="col-span-2 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="p-2 flex items-center space-x-2">
                    <img src={item.img} alt={item.name} className="w-8 h-8 rounded-md" />
                    <span className="text-sm">{item.name}</span>
                  </td>
                  <td className="p-2 text-sm">{item.category}</td>
                  <td className="p-2 text-sm">{item.supplier}</td>
                  <td className={`p-2 font-bold text-sm ${item.quantity <= item.threshold ? "text-red-500" : "text-gray-700"}`}>
  {item.quantity}
</td>

                  <td className="p-2 text-sm">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {}
        <div className="flex flex-col gap-4">
{}
<div className="p-4 bg-gray-100 rounded-lg shadow-md">
  <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
  
  <div className="flex gap-4">
    <button className="inline-flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
      <FaPlus className="text-lg" /> <span>Restock</span>
    </button>
    
    <button className="inline-flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
      <FaMinus className="text-lg" /> <span>Remove</span>
    </button>
    
    <button className="inline-flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition">
      <FaFileExport className="text-lg" /> <span>Export Report</span>
    </button>
  </div>
</div>





          {}
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Low Stock Alerts</h2>
            {lowStockItems.map(item => (
              <p key={item.id} className="text-sm text-red-600">{item.name} (Only {item.quantity} left!)</p>
            ))}
          </div>

          {}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Recent Stock Activity</h2>
            <p className="text-sm text-gray-700"><FaClipboardList /> Cement Bag restocked (+50 units)</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">Supplier Info</h2>
            <p className="text-sm text-gray-700"><FaTruck /> ABC Cement Co. - Recent Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
