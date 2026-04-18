import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { apiUrl } from "../lib/api";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch(apiUrl("/api/orders"))
      .then((res) => res.json())
      .then((data) => {
        if (user && user.role === "admin") {
          setOrders(data);
        } else if (user) {
          setOrders(data.filter((o) => o.customer.email === user.email));
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/">⬅ Back to Store</Link>
        </div>
        <h1 style={{ marginBottom: 20 }}>Orders</h1>
        <p>Please <Link to="/login">log in</Link> to view your orders.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Orders</h1>

      <div style={{ marginBottom: 16 }}>
        <Link to="/">⬅ Back to Store</Link>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found yet.</p>
      ) : (
        <>
          {user && user.role === "admin" && (
            <div style={{ padding: 20, background: "#f8f9fa", borderRadius: 12, marginBottom: 20, border: "1px solid #ddd" }}>
              <h2 style={{margin: "0 0 16px 0"}}>📊 Sales Summary</h2>
              <div style={{ display: "flex", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>Total Revenue</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>${orders.reduce((sum, o) => sum + Number(o.total), 0).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>Total Orders</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>{orders.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#666", textTransform: "uppercase", fontWeight: "bold" }}>Avg Order Value</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>${(orders.reduce((sum, o) => sum + Number(o.total), 0) / orders.length).toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "grid", gap: 16 }}>
            {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.orderId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 16
                }}
              >
                <h2 style={{ marginBottom: 10 }}>Order #{order.orderId}</h2>
                <p>
                  <strong>Name:</strong> {order.customer.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p>
                  <strong>Total:</strong> ${Number(order.total).toFixed(2)}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div style={{ marginTop: 12 }}>
                  <strong>Items:</strong>
                  <div style={{ marginTop: 8 }}>
                    {order.items.map((item) => (
                      <div
                        key={item.key}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          paddingBottom: 8,
                          borderBottom: "1px solid #eee"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: "bold" }}>{item.name}</div>
                          <div style={{ fontSize: 13, opacity: 0.8 }}>
                            {item.brand} • {item.category}
                            {item.selectedSize
                              ? ` • Size ${item.selectedSize}`
                              : ""}
                          </div>
                          <div style={{ fontSize: 13 }}>
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
        </>
      )}
    </div>
  );
}