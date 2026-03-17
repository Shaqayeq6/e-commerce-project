import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

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
        
        {/* Admin Links */}
        {user && user.role === 'admin' && (
          <Link to="/admin/customers" style={{ color: "#ffeb3b", textDecoration: "none", fontWeight: "bold" }}>
            Admin: Customers
          </Link>
        )}

        {/* Regular User / Guest Links */}
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          Orders
        </Link>
        
        {user ? (
          <Link to="/profile" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
            Hi, {user.fullName.split(' ')[0]} (Profile)
          </Link>
        ) : (
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Login / Register
          </Link>
        )}

        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>
          🛒 Cart ({totalItems})
        </Link>
      </div>
    </nav>
  );
}
