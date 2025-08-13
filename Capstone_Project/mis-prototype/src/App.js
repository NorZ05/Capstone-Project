import { useState } from "react";
import Login from "./Login";
import Home from "./Home";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <Home onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}
