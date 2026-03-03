import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      background: "#111",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
        ShaqaWear
      </Link>

      <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
        🛒 Cart ({totalItems})
      </Link>
    </nav>
  );
}