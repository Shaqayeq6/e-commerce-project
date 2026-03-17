import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Order Confirmation</h1>
        <p>No order data found. Please checkout first.</p>
        <Link to="/">Go to Store</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>✅ Order Confirmed!</h1>
      <p><strong>Order ID:</strong> {data.orderId}</p>
      <p><strong>Name:</strong> {data.customer.fullName}</p>
      <p><strong>Email:</strong> {data.customer.email}</p>
      <p><strong>Total Paid:</strong> ${Number(data.total).toFixed(2)}</p>

      <div style={{ marginTop: 14 }}>
        <Link to="/">Back to Store</Link>
      </div>
    </div>
  );
}