import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const myOrders = data.filter((o) => o.customer.email === user.email);
        setOrders(myOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders for profile", err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <h1>My Profile</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #c00",
            background: "#fff",
            color: "#c00",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          background: "#f9f9f9",
          padding: 20,
          borderRadius: 12,
          marginBottom: 32
        }}
      >
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role === "admin" ? "Admin" : "Customer"}</p>
        <p><strong>Address:</strong> {user.address || "-"}</p>
        <p><strong>City:</strong> {user.city || "-"}</p>
        <p><strong>Postal Code:</strong> {user.postalCode || "-"}</p>
        <p><strong>Saved Card:</strong> {user.cardLast4 ? `**** **** **** ${user.cardLast4}` : "-"}</p>
        <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>
          <strong>Wishlist Items:</strong> {wishlistCount}{" "}
          <Link to="/wishlist">View Wishlist</Link>
        </p>
      </div>

      <h2>My Orders</h2>
      {loading ? (
        <p>Loading order history...</p>
      ) : orders.length === 0 ? (
        <p>
          You haven't placed any orders yet. <Link to="/">Start shopping!</Link>
        </p>
      ) : (
        <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.orderId}
                style={{
                  border: "1px solid #eee",
                  padding: 16,
                  borderRadius: 12
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12
                  }}
                >
                  <strong>Order #{order.orderId}</strong>
                  <span style={{ color: "#666" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  {order.items.map((item) => (
                    <div key={item.key} style={{ fontSize: 14 }}>
                      • {item.quantity}x {item.name} (${item.price.toFixed(2)})
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    borderTop: "1px solid #eee",
                    paddingTop: 8
                  }}
                >
                  Total: ${Number(order.total).toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
