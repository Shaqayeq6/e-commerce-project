import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerFilter, setCustomerFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch("http://localhost:5001/api/orders")
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

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (user?.role === "admin") {
      if (customerFilter.trim()) {
        const q = customerFilter.toLowerCase();
        result = result.filter(
          (order) =>
            order.customer.fullName.toLowerCase().includes(q) ||
            order.customer.email.toLowerCase().includes(q)
        );
      }

      if (productFilter.trim()) {
        const q = productFilter.toLowerCase();
        result = result.filter((order) =>
          order.items.some((item) => item.name.toLowerCase().includes(q))
        );
      }

      if (dateFilter) {
        result = result.filter(
          (order) =>
            new Date(order.createdAt).toISOString().slice(0, 10) === dateFilter
        );
      }
    }

    return result.slice().reverse();
  }, [orders, customerFilter, productFilter, dateFilter, user]);

  if (!user) {
    return (
      <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/">⬅ Back to Store</Link>
        </div>
        <h1 style={{ marginBottom: 20 }}>Orders</h1>
        <p>
          Please <Link to="/login">log in</Link> to view your orders.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>
        {user.role === "admin" ? "Sales History" : "Orders"}
      </h1>

      <div style={{ marginBottom: 16 }}>
        <Link to="/">⬅ Back to Store</Link>
      </div>

      {user.role === "admin" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 20
          }}
        >
          <input
            placeholder="Filter by customer name or email"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            placeholder="Filter by product"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredOrders.map((order) => (
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
              {order.customer.address && (
                <p>
                  <strong>Address:</strong> {order.customer.address}
                </p>
              )}
              {order.customer.city && (
                <p>
                  <strong>City:</strong> {order.customer.city}
                </p>
              )}
              {order.customer.postalCode && (
                <p>
                  <strong>Postal Code:</strong> {order.customer.postalCode}
                </p>
              )}
              <p>
                <strong>Total:</strong> ${Number(order.total).toFixed(2)}
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
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
                          {item.selectedSize ? ` • Size ${item.selectedSize}` : ""}
                        </div>
                        <div style={{ fontSize: 13 }}>Qty: {item.quantity}</div>
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}