import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetch("http://localhost:5001/api/orders")
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <h2 style={{ padding: 20 }}>Access Denied</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin - Sales History</h1>
      <Link to="/admin">⬅ Back to Admin</Link>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.orderId} style={{ border: "1px solid #ddd", padding: 16, marginTop: 10 }}>
            <h3>Order #{order.orderId}</h3>
            <p><b>Customer:</b> {order.customer.fullName}</p>
            <p><b>Email:</b> {order.customer.email}</p>
            <p><b>Total:</b> ${order.total}</p>

            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}