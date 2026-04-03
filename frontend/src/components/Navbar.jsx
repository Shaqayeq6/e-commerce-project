import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

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
        {user && user.role === "admin" && (
          <>
            <Link
              to="/admin"
              style={{
                color: "#ffeb3b",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Admin Panel
            </Link>

            <Link
              to="/admin/customers"
              style={{
                color: "#ffeb3b",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Users
            </Link>

            <Link
              to="/orders"
              style={{
                color: "#ffeb3b",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Sales History
            </Link>
          </>
        )}

        <Link
          to="/orders"
          style={{ color: "white", textDecoration: "none" }}
        >
          Orders
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Hi, {user.fullName.split(" ")[0]} (Profile)
            </Link>

            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "6px 10px",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{ color: "white", textDecoration: "none" }}
          >
            Login / Register
          </Link>
        )}

        <Link
          to="/cart"
          style={{ color: "white", textDecoration: "none" }}
        >
          🛒 Cart ({totalItems})
        </Link>
      </div>
    </nav>
  );
}