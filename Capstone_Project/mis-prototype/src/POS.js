import { useState } from "react";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaTimes, FaSearch } from "react-icons/fa";
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

const products = [
  { id: 1, name: "Cement Bag", price: 500, img: cementImg },
  { id: 2, name: "Steel Rod (10mm)", price: 750, img: steelrodImg },
  { id: 3, name: "Brick (Per Piece)", price: 15, img: brickImg },
  { id: 4, name: "Asphalt (Per Ton)", price: 12000, img: asphaltImg },
  { id: 5, name: "Fiberglass Insulation (Per Roll)", price: 2500, img: fiberglassImg },
  { id: 6, name: "Metal Roofing Sheet", price: 1500, img: metalroofImg },
  { id: 7, name: "Concrete Blocks (Per Piece)", price: 50, img: concreteImg },
  { id: 8, name: "Recycled Plastic Panel", price: 800, img: plasticpanelsImg },
  { id: 9, name: "Bamboo Plank (Per Meter)", price: 100, img: bambooImg },
  { id: 10, name: "Hempcrete Brick", price: 200, img: hempcreteImg }
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCart = () => setCartOpen((prev) => !prev);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      return existingItem
        ? prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (index, amount) => {
    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, quantity: Math.max(item.quantity + amount, 1) } : item))
    );
  };

  const removeFromCart = (index) => setCart((prevCart) => prevCart.filter((_, i) => i !== index));

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col relative">
      {}
      <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-[250px] mb-6">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full outline-none bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {}
      <button
        className="absolute top-4 right-4 w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={toggleCart}
      >
        <FaShoppingCart className="text-2xl" />
      </button>

      {}
      <div className="grid grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="h - 400 w - 400 p-4 bg-blue-200 rounded-lg shadow-md flex flex-col items-center text-center">
            <img src={product.img} alt={product.name} className="w-48 h-48 object-cover rounded-md" />
            <h2 className="text-md font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-700 text-md">₱{product.price}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {}
      <div
        className={`absolute top-16 right-0 w-[400px] bg-white p-6 rounded-lg shadow-lg transition-transform duration-500 ${
          cartOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button className="text-gray-600 hover:text-black" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        <div className="h-[350px] bg-gray-50 p-4 rounded-md shadow-inner overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-700 text-center">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3">
  {cart.map((item, index) => (
    <li key={index} className="flex items-center justify-between border-b pb-2">
      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
      <div className="flex-1 px-2">
        <h2 className="text-sm font-semibold">{item.name}</h2>
        <p className="text-gray-700 text-sm">₱{item.price}</p>
      </div>

      {/* Quantity Adjustments */}
      <div className="flex items-center space-x-2">
        <button className="bg-gray-300 p-1 rounded-md hover:bg-gray-400" onClick={() => updateQuantity(index, -1)}>
          <FaMinus />
        </button>
        <span className="text-sm font-bold text-blue-600">{item.quantity}</span> {/* 🔥 Ensuring Quantity Appears */}
        <button className="bg-gray-300 p-1 rounded-md hover:bg-gray-400" onClick={() => updateQuantity(index, 1)}>
          <FaPlus />
        </button>
      </div>

      <button className="text-red-500 hover:text-red-700 ml-2" onClick={() => removeFromCart(index)}>
        <FaTrash />
      </button>
    </li>
  ))}
</ul>

          )}
        </div>

        {}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₱{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
          </div>
          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
