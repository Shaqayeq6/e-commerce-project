import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5001/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <h2 style={{ padding: 20 }}>Access Denied</h2>;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Admin - Sales History</h1>

      <div style={{ marginBottom: 16 }}>
        <Link to="/admin">⬅ Back to Admin</Link>
      </div>

      {loading ? (
        <p>Loading sales history...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <>
          <div
            style={{
              padding: 20,
              background: "#f8f9fa",
              borderRadius: 12,
              marginBottom: 20,
              border: "1px solid #ddd"
            }}
          >
            <h2 style={{ margin: "0 0 16px 0" }}>📊 Sales Summary</h2>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#666",
                    textTransform: "uppercase",
                    fontWeight: "bold"
                  }}
                >
                  Total Revenue
                </div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  ${totalRevenue.toFixed(2)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#666",
                    textTransform: "uppercase",
                    fontWeight: "bold"
                  }}
                >
                  Total Orders
                </div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {orders.length}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#666",
                    textTransform: "uppercase",
                    fontWeight: "bold"
                  }}
                >
                  Avg Order Value
                </div>
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  ${avgOrderValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.orderId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 10
                }}
              >
                <h3>Order #{order.orderId}</h3>
                <p><b>Customer:</b> {order.customer.fullName}</p>
                <p><b>Email:</b> {order.customer.email}</p>
                <p><b>Total:</b> ${Number(order.total).toFixed(2)}</p>
                <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>

                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </>
      )}
    </div>
  );
}