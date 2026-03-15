import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useContext(CartContext);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#111",
        color: "white"
      }}
    >
      <Link
        to="/"
        style={{ color: "white", textDecoration: "none", fontSize: "20px" }}
      >
        ShaqaWear
      </Link>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link
          to="/orders"
          style={{ color: "white", textDecoration: "none" }}
        >
          Orders
        </Link>

        <Link
          to="/cart"
          style={{ color: "white", textDecoration: "none" }}
        >
          🛒 Cart ({totalItems})
        </Link>
        <Link
  to="/admin"
  style={{ color: "white", textDecoration: "none" }}
>
  Admin
</Link>
      </div>
    </nav>
  );
}